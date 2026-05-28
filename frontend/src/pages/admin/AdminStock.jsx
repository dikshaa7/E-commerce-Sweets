import { useState, useEffect, useMemo } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import API, { formatPrice } from '../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminTable from '../../components/admin/AdminTable';
import Loader from '../../components/Loader';

const AdminStock = () => {
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState({});

  const fetch = () => {
    Promise.all([API.get('/products?limit=200'), API.get('/products/low-stock')]).then(([all, low]) => {
      setProducts(all.data.products);
      setLowStock(low.data);
      const edits = {};
      all.data.products.forEach((p) => { edits[p._id] = p.stock; });
      setStockEdits(edits);
      setLoading(false);
    });
  };
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q);
    const matchFilter = stockFilter === 'all' || (stockFilter === 'low' ? p.stock <= p.lowStockThreshold : p.stock === 0);
    return matchSearch && matchFilter;
  }), [products, search, stockFilter]);

  const updateStock = async (id) => {
    try {
      await API.put(`/products/${id}/stock`, { stock: Number(stockEdits[id]) });
      toast.success('Stock updated');
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const markOutOfStock = async (id) => {
    try {
      await API.put(`/products/${id}/stock`, { stock: 0 });
      toast.success('Marked out of stock');
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'name', label: 'Product', render: (r) => (<div><p className="font-semibold">{r.name}</p><p className="text-xs text-gray-500">{r.brand?.name} • {r.weight}</p></div>) },
    { key: 'price', label: 'Price', render: (r) => formatPrice(r.price) },
    { key: 'current', label: 'Current Stock', render: (r) => (
      <span className={`font-bold text-lg ${r.stock === 0 ? 'text-red-600' : r.stock <= r.lowStockThreshold ? 'text-amber-600' : 'text-green-600'}`}>{r.stock}</span>
    )},
    { key: 'threshold', label: 'Threshold', render: (r) => r.lowStockThreshold },
    { key: 'update', label: 'Update Stock', render: (r) => (
      <div className="flex gap-2 items-center">
        <input type="number" min="0" value={stockEdits[r._id] ?? r.stock} onChange={(e) => setStockEdits({ ...stockEdits, [r._id]: e.target.value })} className="input-field w-24 text-sm py-1.5" />
        <button onClick={() => updateStock(r._id)} className="btn-primary text-xs py-1.5 px-3">Save</button>
      </div>
    )},
    { key: 'actions', label: 'Quick Actions', render: (r) => (
      <button onClick={() => markOutOfStock(r._id)} className="text-xs text-red-600 hover:underline font-medium">Mark Out of Stock</button>
    )},
  ];

  return (
    <div>
      <AdminPageHeader title="Stock Management" subtitle="Monitor inventory levels and update stock quantities in real time." breadcrumbs={[{ label: 'Stock' }]} />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Total Products</p><p className="text-2xl font-bold">{products.length}</p></div>
        <div className="admin-stat-card border-l-4 border-amber-400"><p className="text-sm text-gray-500">Low Stock</p><p className="text-2xl font-bold text-amber-600">{lowStock.length}</p></div>
        <div className="admin-stat-card border-l-4 border-red-400"><p className="text-sm text-gray-500">Out of Stock</p><p className="text-2xl font-bold text-red-600">{products.filter((p) => p.stock === 0).length}</p></div>
      </div>

      {lowStock.length > 0 && (
        <div className="card p-5 mb-6 border-l-4 border-red-500 bg-red-50/50">
          <h3 className="font-semibold text-red-800 flex items-center gap-2 mb-3"><FiAlertTriangle /> Low Stock Alerts ({lowStock.length})</h3>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <span key={p._id} className="text-xs bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-full font-medium">{p.name}: {p.stock} left</span>
            ))}
          </div>
        </div>
      )}

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search products..." filters={[{ label: 'stock', value: stockFilter, onChange: setStockFilter, options: [{ value: 'all', label: 'All Stock' }, { value: 'low', label: 'Low Stock' }, { value: 'out', label: 'Out of Stock' }] }]} />

      <AdminTable columns={columns} data={filtered} />
    </div>
  );
};

export default AdminStock;
