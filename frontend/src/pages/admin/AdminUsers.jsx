import { useState, useEffect, useMemo } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTable, { ActionButtons } from '../../components/admin/AdminTable';
import Loader from '../../components/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewUser, setViewUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = () => API.get('/auth/users').then(({ data }) => { setUsers(data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.mobile?.includes(q);
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? !u.isBlocked : u.isBlocked);
    return matchSearch && matchStatus;
  }), [users, search, statusFilter]);

  const toggleBlock = async (id) => {
    await API.put(`/auth/users/${id}/toggle-block`);
    toast.success('User status updated');
    fetch();
    if (viewUser?._id === id) {
      const updated = users.find((u) => u._id === id);
      setViewUser(updated ? { ...updated, isBlocked: !updated.isBlocked } : null);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await API.delete(`/auth/users/${deleteId}`); toast.success('User deleted'); setDeleteId(null); setViewUser(null); fetch(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'user', label: 'User', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">{r.name?.charAt(0)}</div>
        <div><p className="font-semibold">{r.name}</p><p className="text-xs text-gray-500">{r.email}</p></div>
      </div>
    )},
    { key: 'mobile', label: 'Mobile', render: (r) => r.mobile },
    { key: 'addresses', label: 'Addresses', render: (r) => r.addresses?.length || 0 },
    { key: 'status', label: 'Status', render: (r) => <AdminBadge active={!r.isBlocked} activeLabel="Active" inactiveLabel="Blocked" onClick={() => toggleBlock(r._id)} /> },
    { key: 'joined', label: 'Joined', render: (r) => <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => <ActionButtons onView={() => setViewUser(r)} onDelete={() => setDeleteId(r._id)} /> },
  ];

  return (
    <div>
      <AdminPageHeader title="Manage Users" subtitle="View customer accounts, block/unblock users, and manage access." breadcrumbs={[{ label: 'Users' }]} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Total Users</p><p className="text-2xl font-bold">{users.length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-green-600">{users.filter((u) => !u.isBlocked).length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Blocked</p><p className="text-2xl font-bold text-red-500">{users.filter((u) => u.isBlocked).length}</p></div>
      </div>

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search by name, email, mobile..." filters={[{ label: 'status', value: statusFilter, onChange: setStatusFilter, options: [{ value: 'all', label: 'All' }, { value: 'active', label: 'Active' }, { value: 'blocked', label: 'Blocked' }] }]} />

      <AdminTable columns={columns} data={filtered} />

      <AdminModal open={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size="md">
        {viewUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">{viewUser.name?.charAt(0)}</div>
              <div><h3 className="font-bold text-lg">{viewUser.name}</h3><AdminBadge active={!viewUser.isBlocked} activeLabel="Active" inactiveLabel="Blocked" /></div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg"><dt className="text-gray-500 text-xs">Email</dt><dd className="font-medium">{viewUser.email}</dd></div>
              <div className="bg-gray-50 p-3 rounded-lg"><dt className="text-gray-500 text-xs">Mobile</dt><dd className="font-medium">{viewUser.mobile}</dd></div>
              <div className="bg-gray-50 p-3 rounded-lg"><dt className="text-gray-500 text-xs">Member Since</dt><dd className="font-medium">{new Date(viewUser.createdAt).toLocaleDateString()}</dd></div>
              <div className="bg-gray-50 p-3 rounded-lg"><dt className="text-gray-500 text-xs">Addresses</dt><dd className="font-medium">{viewUser.addresses?.length || 0}</dd></div>
            </dl>
            {viewUser.addresses?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Saved Addresses</h4>
                {viewUser.addresses.map((a) => (
                  <div key={a._id} className="text-sm p-3 border rounded-lg mb-2">
                    <p className="font-medium">{a.fullName} {a.isDefault && <span className="text-xs text-primary-600">(Default)</span>}</p>
                    <p className="text-gray-500">{a.street}, {a.city}, {a.state} - {a.pincode}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => toggleBlock(viewUser._id)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${viewUser.isBlocked ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}>
                {viewUser.isBlocked ? 'Unblock User' : 'Block User'}
              </button>
              <button onClick={() => { setDeleteId(viewUser._id); setViewUser(null); }} className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-600 text-white">Delete Account</button>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminConfirmModal open={!!deleteId} title="Delete User Account" message="This will permanently delete the user and all associated data. This action cannot be undone." confirmLabel="Delete User" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger loading={saving} />
    </div>
  );
};

export default AdminUsers;
