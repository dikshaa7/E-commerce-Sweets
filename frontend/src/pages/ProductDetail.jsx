import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import API, { getImageUrl, formatPrice, getEffectivePrice } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setLoading(true);
      setProduct(null);
      setReviews([]);

      try {
        const { data } = await API.get(`/products/${id}`);
        if (!cancelled) setProduct(data);
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }

      try {
        const { data } = await API.get(`/reviews/product/${id}`);
        if (!cancelled) setReviews(data);
      } catch {
        try {
          const { data } = await API.get(`/reviews/${id}`);
          if (!cancelled) setReviews(data);
        } catch {
          if (!cancelled) setReviews([]);
        }
      }
    };

    loadProduct();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-16">Product not found</div>;

  const price = getEffectivePrice(product);
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      await API.post('/wishlist', { productId: product._id });
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    try {
      await API.post('/reviews', { productId: id, ...reviewForm });
      toast.success('Review submitted!');
      const { data } = await API.get(`/reviews/product/${id}`);
      setReviews(data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <img src={getImageUrl(product.image)} alt={product.name} className="w-full aspect-square object-cover" />
        </div>
        <div>
          <p className="text-primary-600 font-medium">{product.brand?.name} • {product.category?.name}</p>
          <h1 className="text-3xl font-display font-bold text-gray-900 mt-1 mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < Math.round(avgRating) ? 'currentColor' : 'none'} />)}
            </div>
            <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary-700">{formatPrice(price)}</span>
            {product.discountPrice > 0 && <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>}
          </div>
          <p className="text-sm text-gray-600 mb-4">Weight: <strong>{product.weight}</strong></p>
          <p className={`text-sm font-medium mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-50">-</button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2 hover:bg-gray-50">+</button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2">
                <FiShoppingCart /> Add to Cart
              </button>
              <button onClick={handleWishlist} className="btn-secondary p-2.5"><FiHeart size={20} /></button>
            </div>
          )}

          <div className="border-t pt-6 space-y-3 text-sm">
            <p><strong>Ingredients:</strong> {product.ingredients || 'N/A'}</p>
            <p><strong>Shelf Life:</strong> {product.shelfLife || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
          {reviews.length === 0 ? <p className="text-gray-500">No reviews yet.</p> : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{r.user?.name}</span>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(r.rating)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {user && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Rating</label>
                <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="input-field">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Comment</label>
                <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} className="input-field" rows={4} required />
              </div>
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
