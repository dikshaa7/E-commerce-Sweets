import { useState, useEffect, useMemo } from 'react';
import API, { formatPrice } from '../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminModal from '../../components/admin/AdminModal';
import AdminTable, { ActionButtons } from '../../components/admin/AdminTable';
import Loader from '../../components/Loader';

const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed', 'Refunded'];

const AdminPayments = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [viewOrder, setViewOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => API.get('/orders').then(({ data }) => { setOrders(data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.user?.name?.toLowerCase().includes(q) || o._id.toLowerCase().includes(q);
    const matchPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;
    return matchSearch && matchPayment;
  }), [orders, search, paymentFilter]);

  const updatePayment = async (id, paymentStatus) => {
    await API.put(`/orders/${id}/payment`, { paymentStatus });
    toast.success('Payment status updated');
    fetch();
  };

  const codOrders = orders.filter((o) => o.paymentMethod === 'Cash on Delivery');
  const pendingPayments = orders.filter((o) => o.paymentStatus === 'Pending');
  const totalCollected = orders.filter((o) => o.paymentStatus === 'Paid').reduce((s, o) => s + o.totalAmount, 0);

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'id', label: 'Order', render: (r) => <span className="font-mono text-xs">#{r._id.slice(-8).toUpperCase()}</span> },
    { key: 'customer', label: 'Customer', render: (r) => r.user?.name },
    { key: 'method', label: 'Method', render: (r) => <span className="text-xs bg-gray-100 px-2 py-1 rounded">{r.paymentMethod}</span> },
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-semibold">{formatPrice(r.totalAmount)}</span> },
    { key: 'orderStatus', label: 'Order Status', render: (r) => <span className="text-xs">{r.orderStatus}</span> },
    { key: 'payment', label: 'Payment Status', render: (r) => (
      <select value={r.paymentStatus} onChange={(e) => updatePayment(r._id, e.target.value)} className="input-field text-xs py-1.5">
        {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
    { key: 'date', label: 'Date', render: (r) => <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => <ActionButtons onView={() => setViewOrder(r)} /> },
  ];

  return (
    <div>
      <AdminPageHeader title="Manage Payments" subtitle="Track COD payments and manually update payment status." breadcrumbs={[{ label: 'Payments' }]} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold">{orders.length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">COD Orders</p><p className="text-2xl font-bold">{codOrders.length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Pending Payments</p><p className="text-2xl font-bold text-amber-600">{pendingPayments.length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Collected</p><p className="text-2xl font-bold text-green-600">{formatPrice(totalCollected)}</p></div>
      </div>

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search payments..." filters={[{ label: 'payment', value: paymentFilter, onChange: setPaymentFilter, options: [{ value: 'all', label: 'All' }, ...PAYMENT_STATUSES.map((s) => ({ value: s, label: s }))] }]} />

      <AdminTable columns={columns} data={filtered} />

      <AdminModal open={!!viewOrder} onClose={() => setViewOrder(null)} title="Payment Details" size="md">
        {viewOrder && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b"><dt className="text-gray-500">Order ID</dt><dd className="font-mono">#{viewOrder._id.slice(-8).toUpperCase()}</dd></div>
            <div className="flex justify-between py-2 border-b"><dt className="text-gray-500">Customer</dt><dd>{viewOrder.user?.name}</dd></div>
            <div className="flex justify-between py-2 border-b"><dt className="text-gray-500">Method</dt><dd>{viewOrder.paymentMethod}</dd></div>
            <div className="flex justify-between py-2 border-b"><dt className="text-gray-500">Order Status</dt><dd>{viewOrder.orderStatus}</dd></div>
            <div className="flex justify-between py-2 border-b"><dt className="text-gray-500">Payment Status</dt><dd className="font-semibold">{viewOrder.paymentStatus}</dd></div>
            <div className="flex justify-between py-2"><dt className="text-gray-500">Amount</dt><dd className="text-xl font-bold text-primary-700">{formatPrice(viewOrder.totalAmount)}</dd></div>
            <select value={viewOrder.paymentStatus} onChange={(e) => { updatePayment(viewOrder._id, e.target.value); setViewOrder({ ...viewOrder, paymentStatus: e.target.value }); }} className="input-field mt-2">
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </dl>
        )}
      </AdminModal>
    </div>
  );
};

export default AdminPayments;
