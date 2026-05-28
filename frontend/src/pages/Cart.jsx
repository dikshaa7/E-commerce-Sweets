import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getImageUrl, formatPrice, getEffectivePrice } from '../utils/api';
import Loader from '../components/Loader';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const items = cart.cart?.items || [];

  if (!cart.cart) return <Loader />;

  const total = items.reduce((s, i) => {
    const p = getEffectivePrice(i.product);
    return s + p * i.quantity;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-title">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = getEffectivePrice(item.product);
              return (
                <div key={item.product._id} className="card p-4 flex gap-4">
                  <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <Link to={`/products/${item.product._id}`} className="font-semibold hover:text-primary-600">{item.product.name}</Link>
                    <p className="text-sm text-gray-500">{item.product.weight}</p>
                    <p className="font-bold text-primary-700 mt-1">{formatPrice(price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                    <div className="flex items-center border rounded-lg">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-2 hover:bg-gray-50"><FiMinus size={14} /></button>
                      <span className="px-3">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-2 hover:bg-gray-50"><FiPlus size={14} /></button>
                    </div>
                    <p className="font-semibold">{formatPrice(price * item.quantity)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span className="text-green-600">{total >= 999 ? 'FREE' : formatPrice(50)}</span></div>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-primary-700">{formatPrice(total >= 999 ? total : total + 50)}</span>
            </div>
            <Link to="/checkout" className="btn-primary w-full text-center block">Proceed to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
