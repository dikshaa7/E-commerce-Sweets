import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiUser, FiShoppingBag, FiMapPin, FiHeart, FiShoppingCart,
  FiStar, FiLogOut, FiMenu, FiX, FiChevronLeft, FiCreditCard,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const navItems = [
  { to: '/account', icon: FiGrid, label: 'Overview', end: true },
  { to: '/account/profile', icon: FiUser, label: 'My Profile' },
  { to: '/account/orders', icon: FiShoppingBag, label: 'My Orders' },
  { to: '/account/addresses', icon: FiMapPin, label: 'Addresses' },
  { to: '/account/reviews', icon: FiStar, label: 'My Reviews' },
  { to: '/account/wishlist', icon: FiHeart, label: 'Wishlist' },
  { to: '/account/cart', icon: FiShoppingCart, label: 'Shopping Cart' },
];

const UserLayout = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/40 via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6 transition">
          <FiChevronLeft /> Back to Store
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className={`lg:w-72 shrink-0 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-5 sticky top-6">
              <div className="flex items-center gap-4 pb-5 border-b border-gray-100 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-primary-200">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wide font-semibold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                    Customer
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-primary-700'
                      }`
                    }
                  >
                    <Icon size={18} />
                    {label}
                    {label === 'Shopping Cart' && cartCount > 0 && (
                      <span className="ml-auto bg-white/20 text-current text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
                <Link to="/account/checkout" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <FiCreditCard size={18} /> Checkout
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full">
                  <FiLogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mb-4 flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border rounded-lg px-4 py-2.5 shadow-sm"
            >
              {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              Account Menu
            </button>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
