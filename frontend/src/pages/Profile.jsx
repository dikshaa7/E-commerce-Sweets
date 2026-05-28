import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  useEffect(() => {
    API.get('/auth/profile').then(({ data }) => {
      setProfile(data);
      setForm({ name: data.name, email: data.email, mobile: data.mobile });
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await API.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (!profile) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="section-title">My Profile</h1>
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Name" required />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="Email" required />
          <input type="text" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="input-field" placeholder="Mobile" required />
          <button type="submit" className="btn-primary">Update Profile</button>
        </form>
      </div>
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-4">
          <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="input-field" placeholder="Current Password" required />
          <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input-field" placeholder="New Password" required />
          <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="input-field" placeholder="Confirm Password" required />
          <button type="submit" className="btn-primary">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
