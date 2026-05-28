import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { formatPrice, getEffectivePrice } from '../utils/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [profile, setProfile] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ fullName: '', mobile: '', street: '', city: '', state: '', pincode: '' });
  const [useNew, setUseNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = cart.cart?.items || [];

  useEffect(() => {
    API.get('/auth/profile').then(({ data }) => {
      setProfile(data);
      const defaultAddr = data.addresses?.find((a) => a.isDefault) || data.addresses?.[0];
      if (defaultAddr) setSelectedAddress(defaultAddr._id);
    });
  }, []);

  const total = items.reduce((s, i) => s + getEffectivePrice(i.product) * i.quantity, 0);
  const delivery = total >= 999 ? 0 : 50;
  const grandTotal = total + delivery;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let shippingAddress;
      if (useNew) {
        shippingAddress = newAddress;
      } else {
        const addr = profile.addresses.find((a) => a._id === selectedAddress);
        if (!addr) { toast.error('Please select an address'); setLoading(false); return; }
        shippingAddress = addr;
      }
      const { data } = await API.post('/orders', {
        shippingAddress,
        paymentMethod: 'Cash on Delivery',
      });
      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.cart) return <Loader />;
  if (items.length === 0) return <div className="text-center py-16">Cart is empty</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="section-title">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            {profile?.addresses?.length > 0 && (
              <div className="space-y-3 mb-4">
                {profile.addresses.map((addr) => (
                  <label key={addr._id} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer ${!useNew && selectedAddress === addr._id ? 'border-primary-500 bg-primary-50' : ''}`}>
                    <input type="radio" name="address" checked={!useNew && selectedAddress === addr._id} onChange={() => { setUseNew(false); setSelectedAddress(addr._id); }} />
                    <div>
                      <p className="font-medium">{addr.fullName}</p>
                      <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-sm text-gray-500">{addr.mobile}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <label className="flex items-center gap-2 mb-4">
              <input type="checkbox" checked={useNew} onChange={(e) => setUseNew(e.target.checked)} />
              <span className="text-sm">Use new address</span>
            </label>
            {useNew && (
              <div className="grid md:grid-cols-2 gap-4">
                {['fullName', 'mobile', 'street', 'city', 'state', 'pincode'].map((f) => (
                  <input key={f} type="text" placeholder={f.replace(/([A-Z])/g, ' $1')} required value={newAddress[f]} onChange={(e) => setNewAddress({ ...newAddress, [f]: e.target.value })} className="input-field capitalize" />
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <label className="flex items-center gap-3 p-4 border rounded-lg border-primary-500 bg-primary-50">
              <input type="radio" checked readOnly />
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when your order is delivered</p>
              </div>
            </label>
          </div>
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={item.product._id} className="flex justify-between text-sm py-2 border-b">
              <span>{item.product.name} x{item.quantity}</span>
              <span>{formatPrice(getEffectivePrice(item.product) * item.quantity)}</span>
            </div>
          ))}
          <div className="space-y-2 mt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span><span className="text-primary-700">{formatPrice(grandTotal)}</span>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6 disabled:opacity-50">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
