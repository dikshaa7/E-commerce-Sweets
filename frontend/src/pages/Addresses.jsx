import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import API from '../utils/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const empty = { fullName: '', mobile: '', street: '', city: '', state: '', pincode: '', isDefault: false };

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
        toast.success('Address updated!');
      } else {
        await API.post('/auth/addresses', form);
        toast.success('Address added!');
      }
      setForm(empty);
      setEditId(null);
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    await API.delete(`/auth/addresses/${id}`);
    toast.success('Address deleted');
    fetchAddresses();
  };

  const handleEdit = (addr) => {
    setForm({ fullName: addr.fullName, mobile: addr.mobile, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
    setEditId(addr._id);
    setShowForm(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="section-title mb-0">My Addresses</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }} className="btn-primary text-sm">Add Address</button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">{editId ? 'Edit' : 'Add'} Address</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            {['fullName', 'mobile', 'street', 'city', 'state', 'pincode'].map((f) => (
              <input key={f} type="text" placeholder={f.replace(/([A-Z])/g, ' $1')} required value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="input-field capitalize" />
            ))}
            <label className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
              <span className="text-sm">Set as default</span>
            </label>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="btn-primary">{editId ? 'Update' : 'Save'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? <p className="text-gray-500 text-center py-8">No addresses saved</p> : addresses.map((addr) => (
          <div key={addr._id} className="card p-5 flex justify-between">
            <div>
              {addr.isDefault && <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded mb-2 inline-block">Default</span>}
              <p className="font-medium">{addr.fullName}</p>
              <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="text-sm text-gray-500">{addr.mobile}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(addr)} className="text-primary-600 p-2"><FiEdit2 /></button>
              <button onClick={() => handleDelete(addr._id)} className="text-red-500 p-2"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
