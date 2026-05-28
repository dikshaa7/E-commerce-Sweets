import { useState, useEffect, useMemo } from 'react';
import API, { formatPrice, getImageUrl } from '../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import AdminTable, { ActionButtons } from '../../components/admin/AdminTable';
import Loader from '../../components/Loader';

const STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
const statusColors = { Pending: 'bg-amber-100 text-amber-800', Confirmed: 'bg-blue-100 text-blue-800', Packed: 'bg-indigo-100 text-indigo-800', Shipped: 'bg-purple-100 text-purple-800', Delivered: 'bg-emerald-100 text-emerald-800', Cancelled: 'bg-red-100 text-red-800' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => API.get('/orders').then(({ data }) => { setOrders(data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q || o._id.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q) || o.user?.email?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  }), [orders, search, statusFilter]);

  const updateStatus = async (id, orderStatus) => {
    await API.put(`/orders/${id}/status`, { orderStatus });
    toast.success('Order status updated');
    fetch();
    if (selected?._id === id) {
      const { data } = await API.get(`/orders/${id}`);
      setSelected(data);
    }
  };

  const handleCancel = async () => {
    await API.put(`/orders/${cancelId}/cancel`);
    toast.success('Order cancelled');
    setCancelId(null);
    setSelected(null);
    fetch();
  };

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'id', label: 'Order ID', render: (r) => <span className="font-mono text-xs font-semibold">#{r._id.slice(-8).toUpperCase()}</span> },
    { key: 'customer', label: 'Customer', render: (r) => (<div><p className="font-medium">{r.user?.name}</p><p className="text-xs text-gray-500">{r.user?.email}</p></div>) },
    { key: 'items', label: 'Items', render: (r) => `${r.orderItems.length} item(s)` },
    { key: 'total', label: 'Total', render: (r) => <span className="font-bold text-primary-700">{formatPrice(r.totalAmount)}</span> },
    { key: 'payment', label: 'Payment', render: (r) => <span className="text-xs">{r.paymentStatus}</span> },
    { key: 'status', label: 'Order Status', render: (r) => (
      <select value={r.orderStatus} onChange={(e) => updateStatus(r._id, e.target.value)} className="input-field text-xs py-1.5 min-w-[120px]">
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
    { key: 'date', label: 'Date', render: (r) => <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => (
      <ActionButtons onView={() => setSelected(r)} onDelete={!['Delivered', 'Cancelled'].includes(r.orderStatus) ? () => setCancelId(r._id) : undefined} deleteLabel="Cancel" />
    )},
  ];

  return (
    <div>
      <AdminPageHeader title="Manage Orders" subtitle="Track orders, update status, view customer details and ordered products." breadcrumbs={[{ label: 'Orders' }]} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {STATUSES.map((s) => (
          <div key={s} className="admin-stat-card cursor-pointer hover:shadow-md" onClick={() => setStatusFilter(s)}>
            <p className="text-xs text-gray-500">{s}</p>
            <p className="text-xl font-bold">{orders.filter((o) => o.orderStatus === s).length}</p>
          </div>
        ))}
      </div>

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search orders..." filters={[{ label: 'status', value: statusFilter, onChange: setStatusFilter, options: [{ value: 'all', label: 'All Statuses' }, ...STATUSES.map((s) => ({ value: s, label: s }))] }]} />

      <AdminTable columns={columns} data={filtered} />

      <AdminModal open={!!selected} onClose={() => setSelected(null)} title={`Order #${selected?._id?.slice(-8).toUpperCase()}`} size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[selected.orderStatus]}`}>{selected.orderStatus}</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100">{selected.paymentStatus}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl text-sm">
                <h4 className="font-semibold mb-2">Customer</h4>
                <p>{selected.user?.name}</p>
                <p className="text-gray-500">{selected.user?.email}</p>
                <p className="text-gray-500">{selected.user?.mobile}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-sm">
                <h4 className="font-semibold mb-2">Delivery Address</h4>
                <p>{selected.shippingAddress?.fullName}</p>
                <p className="text-gray-500">{selected.shippingAddress?.street}</p>
                <p className="text-gray-500">{selected.shippingAddress?.city}, {selected.shippingAddress?.state} - {selected.shippingAddress?.pincode}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Ordered Products</h4>
              {selected.orderItems.map((item, i) => (
                <div key={i} className="flex gap-3 py-3 border-b last:border-0">
                  <img src={getImageUrl(item.image)} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1"><p className="font-medium">{item.name}</p><p className="text-sm text-gray-500">{item.weight} × {item.quantity}</p></div>
                  <p className="font-semibold">{formatPrice((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <div><p className="text-sm text-gray-500">Payment: {selected.paymentMethod}</p><p className="text-sm text-gray-500">Placed: {new Date(selected.createdAt).toLocaleString()}</p></div>
              <p className="text-2xl font-bold text-primary-700">{formatPrice(selected.totalAmount)}</p>
            </div>
            <div className="flex gap-2">
              <select value={selected.orderStatus} onChange={(e) => updateStatus(selected._id, e.target.value)} className="input-field flex-1">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {!['Delivered', 'Cancelled'].includes(selected.orderStatus) && (
                <button onClick={() => setCancelId(selected._id)} className="btn-secondary text-red-600 border-red-200">Cancel Order</button>
              )}
            </div>
          </div>
        )}
      </AdminModal>

      <AdminConfirmModal open={!!cancelId} title="Cancel Order" message="Stock will be restored. This order will be marked as cancelled." confirmLabel="Cancel Order" onConfirm={handleCancel} onCancel={() => setCancelId(null)} danger />
    </div>
  );
};

export default AdminOrders;
