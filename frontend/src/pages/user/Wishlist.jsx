import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import API, { getImageUrl, formatPrice, getEffectivePrice } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import UserPageHeader from '../../components/user/UserPageHeader';
import EmptyState from '../../components/user/EmptyState';
import Loader from '../../components/Loader';

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

  const moveToCart = async (product) => {
    if (!product.isAvailable || product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    try {
      await addToCart(product._id);
      await API.delete(`/wishlist/${product._id}`);
      toast.success('Moved to cart!');
      fetchWishlist();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const moveAllToCart = async () => {
    const available = wishlist.products.filter((p) => p.isAvailable && p.stock > 0);
    if (available.length === 0) {
      toast.error('No available products in wishlist');
      return;
    }
    for (const p of available) {
      await addToCart(p._id);
      await API.delete(`/wishlist/${p._id}`);
    }
    toast.success(`${available.length} item(s) moved to cart`);
    fetchWishlist();
  };

  if (!wishlist) return <Loader fullScreen={false} />;

  return (
    <div>
      <UserPageHeader
        title="My Wishlist"
        subtitle={`${wishlist.products.length} saved item(s)`}
        breadcrumbs={[{ label: 'My Account', to: '/account' }, { label: 'Wishlist' }]}
      />

      {wishlist.products.length > 0 && (
        <div className="flex justify-end mb-4">
          <button onClick={moveAllToCart} className="btn-secondary text-sm py-2">Move All to Cart</button>
        </div>
      )}

      {wishlist.products.length === 0 ? (
        <EmptyState
          icon={FiHeart}
          title="Your wishlist is empty"
          description="Save your favorite sweets here and buy them whenever you're ready."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {wishlist.products.map((p) => {
            const outOfStock = !p.isAvailable || p.stock === 0;
            return (
              <div key={p._id} className="card p-4 flex gap-4">
                <Link to={`/products/${p._id}`} className="shrink-0">
                  <img src={getImageUrl(p.image)} alt={p.name} className="w-28 h-28 object-cover rounded-xl" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${p._id}`} className="font-semibold hover:text-primary-600 line-clamp-2">{p.name}</Link>
                  <p className="text-xs text-primary-600 mt-1">{p.brand?.name}</p>
                  <p className="text-sm text-gray-500">{p.weight}</p>
                  <p className="font-bold text-primary-700 mt-2">{formatPrice(getEffectivePrice(p))}</p>
                  {outOfStock ? (
                    <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                  ) : (
                    <span className="text-xs text-green-600">In Stock ({p.stock})</span>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => moveToCart(p)} disabled={outOfStock} className="text-sm btn-primary py-1.5 px-3 flex items-center gap-1 disabled:opacity-50">
                      <FiShoppingCart size={14} /> Add to Cart
                    </button>
                    <button onClick={() => removeItem(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={16} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
