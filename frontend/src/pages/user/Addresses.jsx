import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiMapPin, FiCheck } from 'react-icons/fi';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import UserPageHeader from '../../components/user/UserPageHeader';
import EmptyState from '../../components/user/EmptyState';
import ConfirmModal from '../../components/user/ConfirmModal';
import Loader from '../../components/Loader';

const empty = { fullName: '', mobile: '', street: '', city: '', state: '', pincode: '', isDefault: false };

const INDIAN_STATES = [
  'Andhra Pradesh', 'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu',
  'Delhi', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Punjab',
];

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = () => {
    API.get('/auth/profile').then(({ data }) => {
      setAddresses(data.addresses || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/auth/addresses/${editId}`, form);
        toast.success('Address updated successfully!');
      } else {
        await API.post('/auth/addresses', form);
        toast.success('Address added successfully!');
      }
      setForm(empty);
      setEditId(null);
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDelete = async () => {
    await API.delete(`/auth/addresses/${deleteId}`);
    toast.success('Address deleted');
    setDeleteId(null);
    fetchAddresses();
  };

  const setDefault = async (addr) => {
    await API.put(`/auth/addresses/${addr._id}`, { ...addr, isDefault: true });
    toast.success('Default address updated');
    fetchAddresses();
  };

  const handleEdit = (addr) => {
    setForm({
      fullName: addr.fullName,
      mobile: addr.mobile,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setEditId(addr._id);
    setShowForm(true);
  };

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div>
      <UserPageHeader
        title="My Addresses"
        subtitle="Manage delivery addresses for faster checkout."
        breadcrumbs={[{ label: 'My Account', to: '/account' }, { label: 'Addresses' }]}
      />

      <div className="flex justify-end mb-6">
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> Add New Address
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 border-2 border-primary-100">
          <h2 className="font-semibold text-lg mb-4">{editId ? 'Edit Address' : 'Add New Address'}</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Full Name</label>
              <input type="text" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Mobile Number</label>
              <input type="text" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium block mb-1">Street Address</label>
              <input type="text" required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="input-field" placeholder="House no, Building, Street" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">City</label>
              <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">State</label>
              <select required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field">
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Pincode</label>
              <input type="text" required pattern="[0-9]{6}" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="input-field" />
            </div>
            <label className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
              <span className="text-sm">Set as default delivery address</span>
            </label>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="btn-primary">{editId ? 'Update Address' : 'Save Address'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <EmptyState
          icon={FiMapPin}
          title="No addresses saved"
          description="Add a delivery address to make checkout faster and easier."
          actionLabel="Add Address"
          onAction={() => { setShowForm(true); setForm(empty); }}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className={`card p-5 relative ${addr.isDefault ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}>
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-xs font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <FiCheck size={12} /> Default
                </span>
              )}
              <h3 className="font-semibold text-gray-900">{addr.fullName}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {addr.street}<br />
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-sm text-gray-500 mt-2">📞 {addr.mobile}</p>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr)} className="text-xs btn-secondary py-1.5 px-3">Set Default</button>
                )}
                <button onClick={() => handleEdit(addr)} className="text-xs btn-secondary py-1.5 px-3 flex items-center gap-1"><FiEdit2 size={12} /> Edit</button>
                <button onClick={() => setDeleteId(addr._id)} className="text-xs text-red-600 hover:bg-red-50 py-1.5 px-3 rounded-lg flex items-center gap-1"><FiTrash2 size={12} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Address"
        message="Are you sure you want to delete this address?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
};

export default Addresses;
