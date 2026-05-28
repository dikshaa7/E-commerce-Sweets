import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiMapPin, FiStar, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import API, { formatPrice } from '../../utils/api';
import UserPageHeader from '../../components/user/UserPageHeader';
import StatusBadge from '../../components/user/StatusBadge';
import Loader from '../../components/Loader';

const StatCard = ({ icon: Icon, label, value, color, to }) => (
  <Link to={to} className="card p-5 hover:shadow-md transition group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} group-hover:scale-105 transition`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </Link>
);

const UserDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/user/dashboard').then(({ data: res }) => setData(res));
  }, []);

  if (!data) return <Loader fullScreen={false} />;

  const { user, stats, recentOrders } = data;

  return (
    <div>
      <UserPageHeader
        title={`Welcome back, ${user.name?.split(' ')[0]}!`}
        subtitle="Manage your account, track orders, and update your preferences from one place."
        breadcrumbs={[{ label: 'My Account', to: '/account' }, { label: 'Overview' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={FiShoppingBag} label="Total Orders" value={stats.totalOrders} color="bg-blue-500" to="/account/orders" />
        <StatCard icon={FiTrendingUp} label="Active Orders" value={stats.activeOrders} color="bg-amber-500" to="/account/orders" />
        <StatCard icon={FiHeart} label="Wishlist Items" value={stats.wishlistCount} color="bg-pink-500" to="/account/wishlist" />
        <StatCard icon={FiMapPin} label="Saved Addresses" value={stats.addressCount} color="bg-indigo-500" to="/account/addresses" />
        <StatCard icon={FiStar} label="My Reviews" value={stats.reviewCount} color="bg-yellow-500" to="/account/reviews" />
        <StatCard icon={FiShoppingCart} label="Cart Items" value={stats.cartCount} color="bg-primary-500" to="/account/cart" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/account/orders" className="text-sm text-primary-600 hover:underline">View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p className="mb-4">You haven't placed any orders yet.</p>
              <Link to="/products" className="btn-primary text-sm">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link key={order._id} to={`/account/orders/${order._id}`} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} item(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-700">{formatPrice(order.totalAmount)}</p>
                    <div className="mt-1"><StatusBadge status={order.orderStatus} /></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
            <p className="text-primary-100 text-sm">Total Spent</p>
            <p className="text-3xl font-bold mt-1">{formatPrice(stats.totalSpent)}</p>
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-white/20 text-sm">
              <div><p className="text-primary-200">Delivered</p><p className="font-semibold">{stats.deliveredOrders}</p></div>
              <div><p className="text-primary-200">Pending</p><p className="font-semibold">{stats.pendingOrders}</p></div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Account Details</h3>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-gray-500">Full Name</dt><dd className="font-medium">{user.name}</dd></div>
              <div><dt className="text-gray-500">Email</dt><dd className="font-medium">{user.email}</dd></div>
              <div><dt className="text-gray-500">Mobile</dt><dd className="font-medium">{user.mobile}</dd></div>
              <div><dt className="text-gray-500">Member Since</dt><dd className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</dd></div>
            </dl>
            <Link to="/account/profile" className="btn-secondary w-full text-center block mt-5 text-sm py-2">Edit Profile</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
