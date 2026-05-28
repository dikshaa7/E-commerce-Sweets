import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiSearch, FiFilter } from 'react-icons/fi';
import API, { formatPrice, getImageUrl } from '../../utils/api';
import UserPageHeader from '../../components/user/UserPageHeader';
import StatusBadge from '../../components/user/StatusBadge';
import EmptyState from '../../components/user/EmptyState';
import ConfirmModal from '../../components/user/ConfirmModal';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cancelId, setCancelId] = useState(null);

  const fetchOrders = () => {
    API.get('/orders/my').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || order._id.toLowerCase().includes(q) || order.orderItems.some((i) => i.name?.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  const handleCancel = async () => {
    try {
      await API.put(`/orders/${cancelId}/cancel`);
      toast.success('Order cancelled successfully');
      setCancelId(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div>
      <UserPageHeader
        title="My Orders"
        subtitle="Track, manage, and review all your sweet orders in one place."
        breadcrumbs={[{ label: 'My Account', to: '/account' }, { label: 'Orders' }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: orders.length },
          { label: 'Active', value: orders.filter((o) => !['Delivered', 'Cancelled'].includes(o.orderStatus)).length },
          { label: 'Delivered', value: orders.filter((o) => o.orderStatus === 'Delivered').length },
          { label: 'Cancelled', value: orders.filter((o) => o.orderStatus === 'Cancelled').length },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by order ID or product..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400 shrink-0" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field min-w-[160px]">
            {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FiShoppingBag}
          title="No orders found"
          description={orders.length === 0 ? "You haven't placed any orders yet. Explore our premium sweets collection." : 'Try adjusting your search or filter criteria.'}
          actionLabel="Browse Products"
          actionTo="/products"
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order._id} className="card p-5 md:p-6">
              <div className="flex flex-wrap justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500 mt-0.5">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={order.orderStatus} />
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {order.orderItems.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <img src={getImageUrl(item.image)} alt="" className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.orderItems.length > 4 && (
                  <span className="text-sm text-gray-500 self-center">+{order.orderItems.length - 4} more</span>
                )}
              </div>

              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500">{order.orderItems.length} item(s) • {order.paymentMethod}</p>
                  <p className="text-xl font-bold text-primary-700">{formatPrice(order.totalAmount)}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/account/orders/${order._id}`} className="btn-primary text-sm py-2">View Details</Link>
                  {['Pending', 'Confirmed'].includes(order.orderStatus) && (
                    <button onClick={() => setCancelId(order._id)} className="btn-secondary text-sm py-2 text-red-600 border-red-200 hover:bg-red-50">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!cancelId}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone and stock will be restored."
        confirmLabel="Yes, Cancel Order"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
        danger
      />
    </div>
  );
};

export default Orders;
