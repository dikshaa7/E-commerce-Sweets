import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { formatPrice } from '../utils/api';
import Loader from '../components/Loader';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Packed: 'bg-indigo-100 text-indigo-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  const cancelOrder = async (id) => {
    if (!confirm('Cancel this order?')) return;
    await API.put(`/orders/${id}/cancel`);
    const { data } = await API.get('/orders/my');
    setOrders(data);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">No orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm">{order.orderItems.length} item(s)</p>
                  <p className="font-bold text-primary-700">{formatPrice(order.totalAmount)}</p>
                  <p className="text-xs text-gray-500">Payment: {order.paymentStatus}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/orders/${order._id}`} className="btn-secondary text-sm py-2">View Details</Link>
                  {['Pending', 'Confirmed'].includes(order.orderStatus) && (
                    <button onClick={() => cancelOrder(order._id)} className="text-sm text-red-600 hover:underline py-2">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
