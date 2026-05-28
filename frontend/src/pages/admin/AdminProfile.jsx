import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiSave, FiShield } from 'react-icons/fi';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Loader from '../../components/Loader';

const AdminProfile = () => {
  const { updateUser, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/auth/profile').then(({ data }) => {
      setProfile(data);
      setForm({ name: data.name, email: data.email });
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data);
      setProfile((p) => ({ ...p, ...data }));
      toast.success('Profile updated successfully');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await API.put('/auth/change-password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (!profile) return <Loader fullScreen={false} />;

  return (
    <div>
      <AdminPageHeader title="Admin Profile" subtitle="Manage your administrator account and security settings." breadcrumbs={[{ label: 'Profile' }]} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center lg:col-span-1">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-xl">
            {profile.name?.charAt(0)?.toUpperCase()}
          </div>
          <h2 className="font-bold text-lg mt-4">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary-700 bg-primary-100 px-3 py-1 rounded-full">
            <FiShield size={12} /> Administrator
          </span>
          <div className="mt-6 pt-6 border-t text-left space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2"><FiUser size={14} /> Admin since {new Date(profile.createdAt).toLocaleDateString()}</p>
            <p className="flex items-center gap-2"><FiMail size={14} /> {profile.email}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><FiUser size={18} className="text-primary-600" /> Account Information</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div><label className="admin-form-label">Full Name</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
              <div><label className="admin-form-label">Email Address</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50"><FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4"><FiLock size={18} className="text-primary-600" /> Change Password</h3>
            <form onSubmit={handlePassword} className="space-y-4">
              <div><label className="admin-form-label">Current Password</label><input type="password" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="input-field" /></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="admin-form-label">New Password</label><input type="password" required minLength={6} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input-field" /></div>
                <div><label className="admin-form-label">Confirm Password</label><input type="password" required value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="input-field" /></div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">Update Password</button>
            </form>
          </div>

          <div className="card p-5 bg-slate-50 border-dashed">
            <p className="text-sm text-gray-600"><strong>Logged in as:</strong> {user?.email}</p>
            <p className="text-xs text-gray-500 mt-1">Default credentials: Diksha@gmail.com / Diksha123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
