import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiPackage, FiStar } from 'react-icons/fi';
import API, { getImageUrl, formatPrice } from '../../utils/api';
import UserPageHeader from '../../components/user/UserPageHeader';
import StatusBadge from '../../components/user/StatusBadge';
import OrderTimeline from '../../components/user/OrderTimeline';
import ConfirmModal from '../../components/user/ConfirmModal';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [showCancel, setShowCancel] = useState(false);
  const [reviewForms, setReviewForms] = useState({});

  const fetchOrder = () => API.get(`/orders/${id}`).then(({ data }) => setOrder(data));

  useEffect(() => { fetchOrder(); }, [id]);

  const handleCancel = async () => {
    try {
      await API.put(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      setShowCancel(false);
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const submitReview = async (productId) => {
    const form = reviewForms[productId];
    if (!form?.rating) return;
    try {
      await API.post('/reviews', {
        productId,
        orderId: id,
        rating: form.rating,
        comment: form.comment || '',
      });
      toast.success('Review submitted!');
      setReviewForms((prev) => ({ ...prev, [productId]: { rating: 5, comment: '', submitted: true } }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (!order) return <Loader fullScreen={false} />;

  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);
  const canReview = order.orderStatus === 'Delivered';

  return (
    <div>
      <UserPageHeader
        title={`Order #${order._id.slice(-8).toUpperCase()}`}
        subtitle={`Placed on ${new Date(order.createdAt).toLocaleString()}`}
        breadcrumbs={[
          { label: 'My Account', to: '/account' },
          { label: 'Orders', to: '/account/orders' },
          { label: `#${order._id.slice(-8).toUpperCase()}` },
        ]}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <StatusBadge status={order.orderStatus} />
        <StatusBadge status={order.paymentStatus} type="payment" />
        {canCancel && (
          <button onClick={() => setShowCancel(true)} className="ml-auto text-sm text-red-600 hover:underline font-medium">
            Cancel Order
          </button>
        )}
      </div>

      <div className="card p-6 mb-6">
        <h3 className="font-semibold mb-4">Order Tracking</h3>
        <OrderTimeline status={order.orderStatus} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><FiMapPin size={18} className="text-primary-600" /> Delivery Address</h3>
          <div className="text-sm space-y-1">
            <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600">{order.shippingAddress.street}</p>
            <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p className="text-gray-500 mt-2">Phone: {order.shippingAddress.mobile}</p>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><FiCreditCard size={18} className="text-primary-600" /> Payment Summary</h3>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-gray-500">Payment Method</dt><dd className="font-medium">{order.paymentMethod}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Payment Status</dt><dd><StatusBadge status={order.paymentStatus} type="payment" /></dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Items</dt><dd>{order.orderItems.length}</dd></div>
            <div className="flex justify-between pt-2 border-t font-bold text-base">
              <dt>Total Amount</dt>
              <dd className="text-primary-700">{formatPrice(order.totalAmount)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-5 flex items-center gap-2"><FiPackage size={18} className="text-primary-600" /> Order Items</h3>
        <div className="space-y-5">
          {order.orderItems.map((item, i) => {
            const unitPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
            const productId = item.product?._id || item.product;
            const form = reviewForms[productId] || { rating: 5, comment: '' };
            return (
              <div key={i} className="pb-5 border-b last:border-0 last:pb-0">
                <div className="flex gap-4">
                  <Link to={`/products/${productId}`}>
                    <img src={getImageUrl(item.image)} alt={item.name} className="w-20 h-20 rounded-xl object-cover border" />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/products/${productId}`} className="font-semibold hover:text-primary-600">{item.name}</Link>
                    <p className="text-sm text-gray-500 mt-0.5">{item.weight} × {item.quantity}</p>
                    <p className="font-semibold text-primary-700 mt-1">{formatPrice(unitPrice * item.quantity)}</p>
                  </div>
                </div>

                {canReview && !form.submitted && (
                  <div className="mt-4 p-4 bg-primary-50/50 rounded-xl border border-primary-100">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2"><FiStar size={14} /> Write a review for this product</p>
                    <div className="grid md:grid-cols-4 gap-3">
                      <select
                        value={form.rating}
                        onChange={(e) => setReviewForms({ ...reviewForms, [productId]: { ...form, rating: Number(e.target.value) } })}
                        className="input-field text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                      </select>
                      <input
                        type="text"
                        placeholder="Write your review..."
                        value={form.comment}
                        onChange={(e) => setReviewForms({ ...reviewForms, [productId]: { ...form, comment: e.target.value } })}
                        className="input-field text-sm md:col-span-2"
                      />
                      <button type="button" onClick={() => submitReview(productId)} className="btn-primary text-sm py-2">Submit Review</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <Link to="/account/orders" className="text-primary-600 text-sm hover:underline">← Back to all orders</Link>
      </div>

      <ConfirmModal
        open={showCancel}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        confirmLabel="Cancel Order"
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
        danger
      />
    </div>
  );
};

export default OrderDetail;
