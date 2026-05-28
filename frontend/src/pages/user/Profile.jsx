import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import UserPageHeader from '../../components/user/UserPageHeader';
import Loader from '../../components/Loader';

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/auth/profile').then(({ data }) => {
      setProfile(data);
      setForm({ name: data.name, email: data.email, mobile: data.mobile });
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data);
      setProfile((p) => ({ ...p, ...data }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <Loader fullScreen={false} />;

  return (
    <div>
      <UserPageHeader
        title="My Profile"
        subtitle="Update your personal information and account security settings."
        breadcrumbs={[{ label: 'My Account', to: '/account' }, { label: 'Profile' }]}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center lg:col-span-1">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            {profile.name?.charAt(0)?.toUpperCase()}
          </div>
          <h2 className="font-semibold text-lg mt-4">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <div className="mt-6 pt-6 border-t text-left space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600"><FiPhone size={16} /> {profile.mobile}</div>
            <div className="flex items-center gap-3 text-gray-600"><FiMail size={16} /> {profile.email}</div>
            <div className="flex items-center gap-3 text-gray-600"><FiUser size={16} /> Member since {new Date(profile.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2"><FiUser size={18} /> Personal Information</h3>
            <p className="text-sm text-gray-500 mb-5">Keep your contact details up to date for smooth order delivery.</p>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Email Address</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Mobile Number</label>
                  <input type="text" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="input-field" required />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                <FiSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2"><FiLock size={18} /> Change Password</h3>
            <p className="text-sm text-gray-500 mb-5">Use a strong password to keep your account secure.</p>
            <form onSubmit={handlePassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
                <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="input-field" required />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                  <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input-field" required minLength={6} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
                  <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="input-field" required />
                </div>
              </div>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
