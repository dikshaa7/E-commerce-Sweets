import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiShoppingBag, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import API, { formatPrice } from '../../utils/api';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import Loader from '../../components/Loader';

const AdminReports = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/dashboard/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <Loader fullScreen={false} />;

  const orderRate = stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;

  return (
    <div>
      <AdminPageHeader title="Reports & Analytics" subtitle="Business intelligence — sales performance, best sellers, and inventory alerts." breadcrumbs={[{ label: 'Reports' }]} />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <AdminStatCard icon={FiDollarSign} label="Total Revenue" value={formatPrice(stats.totalSales)} color="bg-emerald-500" subtext="Excluding cancelled" />
        <AdminStatCard icon={FiShoppingBag} label="Daily Orders" value={stats.dailyOrders} color="bg-blue-500" subtext="Orders today" />
        <AdminStatCard icon={FiTrendingUp} label="Monthly Orders" value={stats.monthlyOrders} color="bg-indigo-500" subtext="This month" />
        <AdminStatCard icon={FiAlertTriangle} label="Low Stock" value={stats.lowStock?.length || 0} color="bg-red-500" subtext="Needs attention" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Sales Overview</h2>
          <div className="space-y-4">
            {[
              { label: 'Total Orders', value: stats.totalOrders, pct: 100 },
              { label: 'Pending Orders', value: stats.pendingOrders, pct: stats.totalOrders ? (stats.pendingOrders / stats.totalOrders) * 100 : 0, color: 'bg-amber-500' },
              { label: 'Delivered Orders', value: stats.completedOrders, pct: orderRate, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{item.label}</span><span className="font-semibold">{item.value}</span></div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color || 'bg-primary-500'}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Store Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers },
              { label: 'Total Products', value: stats.totalProducts },
              { label: 'Completion Rate', value: `${orderRate}%` },
              { label: 'Avg Order Value', value: stats.totalOrders ? formatPrice(stats.totalSales / stats.totalOrders) : '₹0' },
            ].map((m) => (
              <div key={m.label} className="bg-slate-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-gray-900">{m.value}</p>
                <p className="text-xs text-gray-500 mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-900">Best Selling Products</h2>
            <Link to="/admin/products" className="text-xs text-primary-600 hover:underline">View Products →</Link>
          </div>
          {stats.bestSelling?.length === 0 ? <p className="text-gray-500 text-sm text-center py-8">No sales data available</p> : (
            <div className="space-y-3">
              {stats.bestSelling.map((item, i) => (
                <div key={item._id || i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <span className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
                  <div className="flex-1 min-w-0"><p className="font-medium truncate">{item.name}</p><p className="text-xs text-gray-500">{item.totalSold} units sold</p></div>
                  <p className="font-bold text-primary-700">{formatPrice(item.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-900">Low Stock Products</h2>
            <Link to="/admin/stock" className="text-xs text-primary-600 hover:underline">Manage Stock →</Link>
          </div>
          {stats.lowStock?.length === 0 ? <p className="text-green-600 text-sm bg-green-50 p-4 rounded-xl text-center">All inventory levels are healthy ✓</p> : (
            <div className="space-y-2">
              {stats.lowStock.map((p) => (
                <div key={p._id} className="flex justify-between items-center p-3 border border-red-100 bg-red-50/50 rounded-xl">
                  <div><p className="font-medium text-sm">{p.name}</p><p className="text-xs text-gray-500">{p.brand?.name}</p></div>
                  <span className="text-red-600 font-bold text-sm">{p.stock} units</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
