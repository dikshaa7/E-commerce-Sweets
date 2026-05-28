import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiShield, FiTruck } from 'react-icons/fi';
import API, { formatPrice, getEffectivePrice, getImageUrl } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import UserPageHeader from '../../components/user/UserPageHeader';
import Loader from '../../components/Loader';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const [profile, setProfile] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({ fullName: '', mobile: '', street: '', city: '', state: '', pincode: '' });
  const [useNew, setUseNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const items = cart.cart?.items || [];

  useEffect(() => {
    API.get('/auth/profile').then(({ data }) => {
      setProfile(data);
      if (data.addresses?.length === 0) setUseNew(true);
      else {
        const defaultAddr = data.addresses.find((a) => a.isDefault) || data.addresses[0];
        if (defaultAddr) setSelectedAddress(defaultAddr._id);
      }
    });
  }, []);

  const subtotal = items.reduce((s, i) => s + getEffectivePrice(i.product) * i.quantity, 0);
  const delivery = subtotal >= 999 ? 0 : subtotal > 0 ? 50 : 0;
  const grandTotal = subtotal + delivery;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let shippingAddress;
      if (useNew || !profile?.addresses?.length) {
        shippingAddress = newAddress;
      } else {
        const addr = profile.addresses.find((a) => a._id === selectedAddress);
        if (!addr) {
          toast.error('Please select a delivery address');
          setLoading(false);
          return;
        }
        shippingAddress = addr;
      }
      const { data } = await API.post('/orders', {
        shippingAddress,
        paymentMethod: 'Cash on Delivery',
      });
      await fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/account/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.cart) return <Loader fullScreen={false} />;
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div>
      <UserPageHeader
        title="Checkout"
        subtitle="Review your order and complete your purchase"
        breadcrumbs={[{ label: 'My Account', to: '/account' }, { label: 'Cart', to: '/account/cart' }, { label: 'Checkout' }]}
      />

      <div className="flex gap-2 mb-8">
        {['Address', 'Payment', 'Review'].map((label, i) => (
          <div key={label} className={`flex-1 text-center py-2 rounded-lg text-sm font-medium ${step >= i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiMapPin className="text-primary-600" /> Delivery Address</h2>
            {profile?.addresses?.length > 0 && (
              <div className="space-y-3 mb-4">
                {profile.addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                      !useNew && selectedAddress === addr._id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input type="radio" name="address" checked={!useNew && selectedAddress === addr._id} onChange={() => { setUseNew(false); setSelectedAddress(addr._id); setStep(1); }} />
                    <div>
                      <p className="font-medium">{addr.fullName} {addr.isDefault && <span className="text-xs text-primary-600">(Default)</span>}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-sm text-gray-500">{addr.mobile}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input type="checkbox" checked={useNew} onChange={(e) => setUseNew(e.target.checked)} />
              <span className="text-sm font-medium">Deliver to a new address</span>
            </label>
            {useNew && (
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div><label className="text-xs font-medium text-gray-500 block mb-1">Full Name</label><input type="text" required value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} className="input-field" /></div>
                <div><label className="text-xs font-medium text-gray-500 block mb-1">Mobile</label><input type="text" required value={newAddress.mobile} onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })} className="input-field" /></div>
                <div className="md:col-span-2"><label className="text-xs font-medium text-gray-500 block mb-1">Street</label><input type="text" required value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="input-field" /></div>
                <div><label className="text-xs font-medium text-gray-500 block mb-1">City</label><input type="text" required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="input-field" /></div>
                <div><label className="text-xs font-medium text-gray-500 block mb-1">State</label><input type="text" required value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="input-field" /></div>
                <div><label className="text-xs font-medium text-gray-500 block mb-1">Pincode</label><input type="text" required value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} className="input-field" /></div>
              </div>
            )}
            <button type="button" onClick={() => setStep(2)} className="btn-secondary text-sm mt-4">Continue to Payment</button>
          </div>

          <div className={`card p-6 ${step < 2 ? 'opacity-60' : ''}`}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FiCreditCard className="text-primary-600" /> Payment Method</h2>
            <label className="flex items-center gap-4 p-4 border-2 border-primary-500 bg-primary-50 rounded-xl cursor-pointer">
              <input type="radio" checked readOnly />
              <div>
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay with cash when your order arrives at your doorstep</p>
              </div>
            </label>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg"><FiShield className="text-green-600" /> Secure ordering</div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg"><FiTruck className="text-primary-600" /> Fast delivery</div>
            </div>
          </div>
        </div>

        <div className="card p-6 h-fit sticky top-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex gap-3">
                <img src={getImageUrl(item.product.image)} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(getEffectivePrice(item.product) * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className={delivery === 0 ? 'text-green-600' : ''}>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary-700">{formatPrice(grandTotal)}</span>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6 py-3 disabled:opacity-50">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
          <Link to="/account/cart" className="block text-center text-sm text-gray-500 mt-3 hover:text-primary-600">← Back to Cart</Link>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
