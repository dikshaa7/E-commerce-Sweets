import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid, FiTag, FiLayers, FiPackage, FiArchive, FiUsers, FiShoppingBag,
  FiCreditCard, FiStar, FiPercent, FiImage, FiMail, FiBarChart2, FiUser,
  FiLogOut, FiMenu, FiX, FiExternalLink, FiChevronLeft,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navGroups = [
  {
    title: 'Overview',
    items: [{ to: '/admin', icon: FiGrid, label: 'Dashboard', end: true }],
  },
  {
    title: 'Catalog',
    items: [
      { to: '/admin/brands', icon: FiTag, label: 'Brands' },
      { to: '/admin/categories', icon: FiLayers, label: 'Categories' },
      { to: '/admin/products', icon: FiPackage, label: 'Products' },
      { to: '/admin/stock', icon: FiArchive, label: 'Stock' },
    ],
  },
  {
    title: 'Sales',
    items: [
      { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
      { to: '/admin/payments', icon: FiCreditCard, label: 'Payments' },
    ],
  },
  {
    title: 'Customers',
    items: [
      { to: '/admin/users', icon: FiUsers, label: 'Users' },
      { to: '/admin/reviews', icon: FiStar, label: 'Reviews' },
      { to: '/admin/messages', icon: FiMail, label: 'Messages' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { to: '/admin/offers', icon: FiPercent, label: 'Offers' },
      { to: '/admin/banners', icon: FiImage, label: 'Banners' },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
      { to: '/admin/profile', icon: FiUser, label: 'Profile' },
    ],
  },
];

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/brands': 'Brands',
  '/admin/categories': 'Categories',
  '/admin/products': 'Products',
  '/admin/stock': 'Stock Management',
  '/admin/users': 'Users',
  '/admin/orders': 'Orders',
  '/admin/payments': 'Payments',
  '/admin/reviews': 'Reviews',
  '/admin/offers': 'Offers',
  '/admin/banners': 'Banners',
  '/admin/messages': 'Messages',
  '/admin/reports': 'Reports',
  '/admin/profile': 'Admin Profile',
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = pageTitles[location.pathname] || 'Admin Panel';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-lg shadow-lg">🍬</div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Indian Sweet Savories</h1>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest">Admin Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={17} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/80 space-y-1">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            <FiExternalLink size={15} /> View Store
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full px-3 py-2 rounded-lg hover:bg-red-950/30 transition">
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3.5 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
          <button className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400 hidden sm:block">Administration</p>
            <h2 className="text-lg font-semibold text-gray-900 truncate">{pageTitle}</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="hidden md:flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition">
              <FiChevronLeft size={14} /> Store
            </Link>
            <div className="h-8 w-px bg-gray-200 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
