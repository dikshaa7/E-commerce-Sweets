import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="bg-primary-700 text-white text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          Free delivery on orders above ₹999 | Cash on Delivery Available
        </div>
      </div>
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-3xl">🍬</span>
            <div>
              <h1 className="text-xl font-display font-bold text-primary-700 leading-tight">Indian Sweet Savories</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Premium Indian Sweets</p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search sweets, brands, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-primary-600 transition">Home</Link>
            <Link to="/products" className="hover:text-primary-600 transition">Shop</Link>
            <Link to="/contact" className="hover:text-primary-600 transition">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/account/wishlist" className="p-2 hover:bg-gray-100 rounded-full relative" title="Wishlist">
                  <FiHeart size={20} />
                </Link>
                <Link to="/account/cart" className="p-2 hover:bg-gray-100 rounded-full relative" title="Cart">
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <Link to="/account" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full">
                    <FiUser size={20} />
                    <span className="hidden sm:inline text-sm">{user.name?.split(' ')[0]}</span>
                  </Link>
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                    <div className="px-4 py-2 border-b mb-1">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/account" className="block px-4 py-2 hover:bg-primary-50 text-sm font-medium text-primary-700">My Account</Link>
                    <Link to="/account/orders" className="block px-4 py-2 hover:bg-gray-50 text-sm">My Orders</Link>
                    <Link to="/account/profile" className="block px-4 py-2 hover:bg-gray-50 text-sm">Profile Settings</Link>
                    <Link to="/account/addresses" className="block px-4 py-2 hover:bg-gray-50 text-sm">Addresses</Link>
                    <Link to="/account/wishlist" className="block px-4 py-2 hover:bg-gray-50 text-sm">Wishlist</Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 border-t mt-1">Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </>
            )}
            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4 space-y-3">
            <form onSubmit={handleSearch}>
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field" />
            </form>
            <Link to="/" className="block py-2" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" className="block py-2" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/contact" className="block py-2" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
