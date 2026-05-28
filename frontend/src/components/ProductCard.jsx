import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { getImageUrl, formatPrice, getEffectivePrice } from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import API from '../utils/api';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const price = getEffectivePrice(product);
  const hasDiscount = product.discountPrice > 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    setLoading(true);
    try {
      await addToCart(product._id);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    try {
      await API.post('/wishlist', { productId: product._id });
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="card group hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </span>
        )}
        {product.stock <= product.lowStockThreshold && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded">Low Stock</span>
        )}
        {!product.isAvailable || product.stock === 0 ? (
          <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">Out of Stock</span>
        ) : null}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleWishlist} className="p-2 bg-white rounded-full shadow hover:bg-primary-50">
            <FiHeart size={16} />
          </button>
          <button onClick={handleAddToCart} disabled={loading || !product.isAvailable || product.stock === 0} className="p-2 bg-primary-600 text-white rounded-full shadow hover:bg-primary-700 disabled:opacity-50">
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-primary-600 font-medium mb-1">{product.brand?.name}</p>
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.weight} • {product.category?.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-700">{formatPrice(price)}</span>
          {hasDiscount && <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
