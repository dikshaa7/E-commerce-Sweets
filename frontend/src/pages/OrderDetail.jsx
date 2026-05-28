import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API, { getImageUrl, formatPrice } from '../utils/api';
import Loader from '../components/Loader';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Packed: 'bg-indigo-100 text-indigo-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  if (!order) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-primary-600 text-sm hover:underline mb-4 inline-block">← Back to Orders</Link>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p className="text-sm text-gray-500 mt-1">{order.shippingAddress.mobile}</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Payment Info</h3>
          <p>Method: {order.paymentMethod}</p>
          <p>Status: <span className="font-medium">{order.paymentStatus}</span></p>
          <p className="text-xl font-bold text-primary-700 mt-2">{formatPrice(order.totalAmount)}</p>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-4">Order Items</h3>
        {order.orderItems.map((item, i) => (
          <div key={i} className="flex gap-4 py-3 border-b last:border-0">
            <img src={getImageUrl(item.image)} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.weight} x {item.quantity}</p>
            </div>
            <p className="font-semibold">{formatPrice((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetail;
