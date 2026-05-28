import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiPackage, FiShoppingBag, FiClock, FiCheckCircle,
  FiDollarSign, FiTrendingUp, FiAlertTriangle,
} from 'react-icons/fi';
import API, { formatPrice } from '../../utils/api';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/dashboard/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <Loader fullScreen={false} />;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle={`Welcome back! Here's what's happening with your store today.`}
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <AdminStatCard icon={FiDollarSign} label="Total Sales" value={formatPrice(stats.totalSales)} color="bg-emerald-500" subtext="All time revenue" />
        <AdminStatCard icon={FiShoppingBag} label="Total Orders" value={stats.totalOrders} color="bg-primary-500" subtext={`${stats.dailyOrders} today`} />
        <AdminStatCard icon={FiUsers} label="Total Users" value={stats.totalUsers} color="bg-blue-500" subtext="Registered customers" />
        <AdminStatCard icon={FiPackage} label="Total Products" value={stats.totalProducts} color="bg-purple-500" subtext={`${stats.lowStock?.length || 0} low stock`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <AdminStatCard icon={FiClock} label="Pending Orders" value={stats.pendingOrders} color="bg-amber-500" />
        <AdminStatCard icon={FiCheckCircle} label="Delivered" value={stats.completedOrders} color="bg-green-500" />
        <AdminStatCard icon={FiTrendingUp} label="Monthly Orders" value={stats.monthlyOrders} color="bg-indigo-500" />
        <AdminStatCard icon={FiAlertTriangle} label="Low Stock Items" value={stats.lowStock?.length || 0} color="bg-red-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline font-medium">View All →</Link>
          </div>
          {stats.recentOrders?.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead><tr><th>Customer</th><th>Order ID</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {stats.recentOrders.map((o) => (
                    <tr key={o._id}>
                      <td><p className="font-medium">{o.user?.name}</p><p className="text-xs text-gray-500">{o.user?.email}</p></td>
                      <td className="font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                      <td className="font-semibold text-primary-700">{formatPrice(o.totalAmount)}</td>
                      <td><span className="px-2 py-1 rounded-full text-xs bg-gray-100 font-medium">{o.orderStatus}</span></td>
                      <td className="text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">Low Stock Alert</h2>
              <Link to="/admin/stock" className="text-xs text-primary-600 hover:underline">Manage →</Link>
            </div>
            {stats.lowStock?.length === 0 ? (
              <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">All products are well stocked ✓</p>
            ) : (
              <div className="space-y-2">
                {stats.lowStock.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm font-medium truncate flex-1">{p.name}</p>
                    <span className="text-xs font-bold text-red-600 ml-2">{p.stock} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Best Sellers</h2>
            {stats.bestSelling?.length === 0 ? (
              <p className="text-gray-500 text-sm">No sales data yet</p>
            ) : (
              <div className="space-y-3">
                {stats.bestSelling.map((item, i) => (
                  <div key={item._id || i} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.totalSold} sold</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(item.revenue)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <h2 className="font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/admin/products', label: 'Add Product' },
                { to: '/admin/orders', label: 'View Orders' },
                { to: '/admin/banners', label: 'Manage Banners' },
                { to: '/admin/reports', label: 'View Reports' },
              ].map((a) => (
                <Link key={a.to} to={a.to} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition text-center">{a.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
