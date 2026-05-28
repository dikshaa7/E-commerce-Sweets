import { useState, useEffect, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import API, { getImageUrl, formatPrice } from '../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTable, { ActionButtons } from '../../components/admin/AdminTable';
import Loader from '../../components/Loader';

const emptyForm = {
  name: '', brand: '', category: '', price: '', discountPrice: '', weight: '500g',
  stock: '', description: '', ingredients: '', shelfLife: '', isAvailable: true,
  isPopular: false, isLatest: false, lowStockThreshold: 10,
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAll = () => {
    Promise.all([API.get('/products?limit=200'), API.get('/brands'), API.get('/categories')]).then(([p, b, c]) => {
      setProducts(p.data.products);
      setBrands(b.data);
      setCategories(c.data);
      setLoading(false);
    });
  };
  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.brand?.name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || (statusFilter === 'available' ? p.isAvailable : !p.isAvailable);
    return matchSearch && matchStatus;
  }), [products, search, statusFilter]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setFile(null); setModalOpen(true); };
  const openEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name, brand: p.brand?._id, category: p.category?._id, price: p.price,
      discountPrice: p.discountPrice, weight: p.weight, stock: p.stock, description: p.description,
      ingredients: p.ingredients, shelfLife: p.shelfLife, isAvailable: p.isAvailable,
      isPopular: p.isPopular, isLatest: p.isLatest, lowStockThreshold: p.lowStockThreshold || 10,
    });
    setFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      if (editId) await API.put(`/products/${editId}`, fd);
      else await API.post('/products', fd);
      toast.success(editId ? 'Product updated' : 'Product created');
      setModalOpen(false);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await API.delete(`/products/${deleteId}`); toast.success('Product deleted'); setDeleteId(null); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'img', label: 'Product', render: (r) => (
      <div className="flex items-center gap-3">
        <img src={getImageUrl(r.image)} alt="" className="w-12 h-12 rounded-lg object-cover border" />
        <div><p className="font-semibold line-clamp-1">{r.name}</p><p className="text-xs text-gray-500">{r.weight}</p></div>
      </div>
    )},
    { key: 'brand', label: 'Brand / Category', render: (r) => <div className="text-xs"><p>{r.brand?.name}</p><p className="text-gray-500">{r.category?.name}</p></div> },
    { key: 'price', label: 'Price', render: (r) => (
      <div><p className="font-semibold text-primary-700">{formatPrice(r.discountPrice > 0 ? r.discountPrice : r.price)}</p>{r.discountPrice > 0 && <p className="text-xs line-through text-gray-400">{formatPrice(r.price)}</p>}</div>
    )},
    { key: 'stock', label: 'Stock', render: (r) => <span className={`font-semibold ${r.stock <= r.lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>{r.stock}</span> },
    { key: 'status', label: 'Status', render: (r) => <AdminBadge active={r.isAvailable} activeLabel="Available" inactiveLabel="Unavailable" onClick={async () => { await API.put(`/products/${r._id}/toggle`); fetchAll(); }} /> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => <ActionButtons onView={() => setViewItem(r)} onEdit={() => openEdit(r)} onDelete={() => setDeleteId(r._id)} /> },
  ];

  return (
    <div>
      <AdminPageHeader title="Manage Products" subtitle="Full product catalog management with pricing, stock, and visibility." breadcrumbs={[{ label: 'Products' }]} action={<button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Product</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{products.length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Available</p><p className="text-2xl font-bold text-green-600">{products.filter((p) => p.isAvailable).length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Low Stock</p><p className="text-2xl font-bold text-red-500">{products.filter((p) => p.stock <= p.lowStockThreshold).length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">On Discount</p><p className="text-2xl font-bold text-primary-600">{products.filter((p) => p.discountPrice > 0).length}</p></div>
      </div>

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search products..." filters={[{ label: 'status', value: statusFilter, onChange: setStatusFilter, options: [{ value: 'all', label: 'All' }, { value: 'available', label: 'Available' }, { value: 'unavailable', label: 'Unavailable' }] }]} />

      <AdminTable columns={columns} data={filtered} />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><label className="admin-form-label">Product Name *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Brand *</label><select required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field"><option value="">Select</option>{brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
          <div><label className="admin-form-label">Category *</label><select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field"><option value="">Select</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
          <div><label className="admin-form-label">Price (₹) *</label><input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Discount Price (₹)</label><input type="number" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Weight</label><select value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="input-field"><option value="250g">250g</option><option value="500g">500g</option><option value="1kg">1kg</option></select></div>
          <div><label className="admin-form-label">Stock *</label><input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Low Stock Threshold</label><input type="number" min="1" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Product Image</label><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field" /></div>
          <div className="md:col-span-2"><label className="admin-form-label">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} /></div>
          <div><label className="admin-form-label">Ingredients</label><input type="text" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Shelf Life</label><input type="text" value={form.shelfLife} onChange={(e) => setForm({ ...form, shelfLife: e.target.value })} className="input-field" /></div>
          <div className="md:col-span-2 flex flex-wrap gap-4">
            {[['isAvailable', 'Available'], ['isPopular', 'Popular'], ['isLatest', 'Latest']].map(([k, l]) => (
              <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} />{l}</label>
            ))}
          </div>
          <div className="md:col-span-2 flex gap-3"><button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{editId ? 'Update Product' : 'Create Product'}</button><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button></div>
        </form>
      </AdminModal>

      <AdminModal open={!!viewItem} onClose={() => setViewItem(null)} title="Product Details" size="lg">
        {viewItem && (
          <div className="grid md:grid-cols-2 gap-6">
            <img src={getImageUrl(viewItem.image)} alt="" className="w-full aspect-square object-cover rounded-xl border" />
            <div className="space-y-3 text-sm">
              <h3 className="text-xl font-bold">{viewItem.name}</h3>
              <p className="text-gray-600">{viewItem.description}</p>
              <dl className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded"><dt className="text-gray-500 text-xs">Brand</dt><dd className="font-medium">{viewItem.brand?.name}</dd></div>
                <div className="bg-gray-50 p-2 rounded"><dt className="text-gray-500 text-xs">Category</dt><dd className="font-medium">{viewItem.category?.name}</dd></div>
                <div className="bg-gray-50 p-2 rounded"><dt className="text-gray-500 text-xs">Price</dt><dd className="font-medium">{formatPrice(viewItem.price)}</dd></div>
                <div className="bg-gray-50 p-2 rounded"><dt className="text-gray-500 text-xs">Stock</dt><dd className="font-medium">{viewItem.stock}</dd></div>
              </dl>
              <p><strong>Ingredients:</strong> {viewItem.ingredients || 'N/A'}</p>
              <p><strong>Shelf Life:</strong> {viewItem.shelfLife || 'N/A'}</p>
              <button onClick={() => { setViewItem(null); openEdit(viewItem); }} className="btn-primary w-full text-sm mt-2">Edit Product</button>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminConfirmModal open={!!deleteId} title="Delete Product" message="This product will be permanently removed from the catalog." confirmLabel="Delete Product" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger loading={saving} />
    </div>
  );
};

export default AdminProducts;
