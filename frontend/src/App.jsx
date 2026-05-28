import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

import UserLayout from './pages/user/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/Profile';
import UserOrders from './pages/user/Orders';
import UserOrderDetail from './pages/user/OrderDetail';
import UserAddresses from './pages/user/Addresses';
import MyReviews from './pages/user/MyReviews';
import UserWishlist from './pages/user/Wishlist';
import UserCart from './pages/user/Cart';
import UserCheckout from './pages/user/Checkout';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminBrands from './pages/admin/AdminBrands';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminStock from './pages/admin/AdminStock';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReviews from './pages/admin/AdminReviews';
import AdminOffers from './pages/admin/AdminOffers';
import AdminBanners from './pages/admin/AdminBanners';
import AdminMessages from './pages/admin/AdminMessages';
import AdminProfile from './pages/admin/AdminProfile';
import AdminReports from './pages/admin/AdminReports';

const LegacyOrderRedirect = () => {
  const { id } = useParams();
  return <Navigate to={id ? `/account/orders/${id}` : '/account/orders'} replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="stock" element={<AdminStock />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="/account" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="orders/:id" element={<UserOrderDetail />} />
        <Route path="addresses" element={<UserAddresses />} />
        <Route path="reviews" element={<MyReviews />} />
        <Route path="wishlist" element={<UserWishlist />} />
        <Route path="cart" element={<UserCart />} />
        <Route path="checkout" element={<UserCheckout />} />
      </Route>

      {/* Legacy route redirects */}
      <Route path="/profile" element={<Navigate to="/account/profile" replace />} />
      <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
      <Route path="/orders/:id" element={<LegacyOrderRedirect />} />
      <Route path="/addresses" element={<Navigate to="/account/addresses" replace />} />
      <Route path="/wishlist" element={<Navigate to="/account/wishlist" replace />} />
      <Route path="/cart" element={<Navigate to="/account/cart" replace />} />
      <Route path="/checkout" element={<Navigate to="/account/checkout" replace />} />

      <Route path="*" element={
        <>
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </>
      } />
    </Routes>
  );
}

export default App;
