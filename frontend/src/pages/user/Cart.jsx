import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { getImageUrl, formatPrice, getEffectivePrice } from '../../utils/api';
import UserPageHeader from '../../components/user/UserPageHeader';
import EmptyState from '../../components/user/EmptyState';
import Loader from '../../components/Loader';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const items = cart.cart?.items || [];

  if (!cart.cart) return <Loader fullScreen={false} />;

  const subtotal = items.reduce((s, i) => s + getEffectivePrice(i.product) * i.quantity, 0);
  const delivery = subtotal >= 999 ? 0 : subtotal > 0 ? 50 : 0;
  const total = subtotal + delivery;

  return (
    <div>
      <UserPageHeader
        title="Shopping Cart"
        subtitle={`${items.length} item(s) in your cart`}
        breadcrumbs={[{ label: 'My Account', to: '/account' }, { label: 'Cart' }]}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={FiShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added any sweets yet. Explore our delicious collection!"
          actionLabel="Continue Shopping"
          actionTo="/products"
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = getEffectivePrice(item.product);
              const outOfStock = !item.product?.isAvailable || item.product?.stock === 0;
              return (
                <div key={item.product._id} className={`card p-4 md:p-5 ${outOfStock ? 'opacity-75' : ''}`}>
                  <div className="flex gap-4">
                    <Link to={`/products/${item.product._id}`}>
                      <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product._id}`} className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">{item.product.name}</Link>
                      <p className="text-sm text-gray-500 mt-0.5">{item.product.weight} • {item.product.brand?.name}</p>
                      <p className="font-bold text-primary-700 mt-2">{formatPrice(price)}</p>
                      {outOfStock && <p className="text-xs text-red-600 font-medium mt-1">Out of stock</p>}
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 hover:text-red-700 p-1" title="Remove">
                        <FiTrash2 size={18} />
                      </button>
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-2 hover:bg-white rounded-l-lg"><FiMinus size={14} /></button>
                        <span className="px-3 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-2 hover:bg-white rounded-r-lg" disabled={item.quantity >= item.product.stock}><FiPlus size={14} /></button>
                      </div>
                      <p className="font-semibold text-gray-900">{formatPrice(price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card p-6 h-fit sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className={delivery === 0 ? 'text-green-600 font-medium' : 'font-medium'}>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
              {subtotal < 999 && subtotal > 0 && (
                <p className="text-xs text-primary-600 bg-primary-50 p-2 rounded-lg">Add {formatPrice(999 - subtotal)} more for free delivery!</p>
              )}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary-700">{formatPrice(total)}</span>
            </div>
            <Link to="/account/checkout" className="btn-primary w-full text-center block mt-6">Proceed to Checkout</Link>
            <Link to="/products" className="block text-center text-sm text-primary-600 mt-3 hover:underline">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
