import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import API, { getImageUrl, formatPrice, getEffectivePrice } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const { addToCart } = useCart();

  const fetchWishlist = () => API.get('/wishlist').then(({ data }) => setWishlist(data));

  useEffect(() => { fetchWishlist(); }, []);

  const removeItem = async (productId) => {
    await API.delete(`/wishlist/${productId}`);
    toast.success('Removed from wishlist');
    fetchWishlist();
  };

  const moveToCart = async (productId) => {
    try {
      await addToCart(productId);
      await API.delete(`/wishlist/${productId}`);
      toast.success('Moved to cart!');
      fetchWishlist();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (!wishlist) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-title">My Wishlist</h1>
      {wishlist.products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">Your wishlist is empty</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.products.map((p) => (
            <div key={p._id} className="card p-4 flex gap-4">
              <Link to={`/products/${p._id}`}>
                <img src={getImageUrl(p.image)} alt={p.name} className="w-24 h-24 object-cover rounded-lg" />
              </Link>
              <div className="flex-1">
                <Link to={`/products/${p._id}`} className="font-semibold hover:text-primary-600">{p.name}</Link>
                <p className="text-sm text-gray-500">{p.weight}</p>
                <p className="font-bold text-primary-700 mt-1">{formatPrice(getEffectivePrice(p))}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => moveToCart(p._id)} className="text-sm btn-primary py-1.5 px-3 flex items-center gap-1"><FiShoppingCart size={14} /> Add to Cart</button>
                  <button onClick={() => removeItem(p._id)} className="text-red-500 hover:text-red-700 p-1.5"><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
