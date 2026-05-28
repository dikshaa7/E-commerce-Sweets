import { useState, useEffect, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import API, { getImageUrl } from '../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTable, { ActionButtons } from '../../components/admin/AdminTable';
import Loader from '../../components/Loader';

const emptyForm = { name: '', logo: '', isActive: true };

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = () => API.get('/brands').then(({ data }) => { setBrands(data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => brands.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? b.isActive : !b.isActive);
    return matchSearch && matchStatus;
  }), [brands, search, statusFilter]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setFile(null); setModalOpen(true); };
  const openEdit = (b) => { setEditId(b._id); setForm({ name: b.name, logo: b.logo, isActive: b.isActive }); setFile(null); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('isActive', form.isActive);
    if (file) fd.append('logo', file);
    else if (form.logo) fd.append('logo', form.logo);
    try {
      if (editId) await API.put(`/brands/${editId}`, fd);
      else await API.post('/brands', fd);
      toast.success(editId ? 'Brand updated successfully' : 'Brand created successfully');
      setModalOpen(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await API.delete(`/brands/${deleteId}`);
      toast.success('Brand deleted');
      setDeleteId(null);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    await API.put(`/brands/${id}/toggle`);
    toast.success('Status updated');
    fetch();
  };

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'logo', label: 'Logo', render: (r) => <img src={getImageUrl(r.logo)} alt="" className="w-11 h-11 rounded-lg object-cover border" /> },
    { key: 'name', label: 'Brand Name', render: (r) => <span className="font-semibold text-gray-900">{r.name}</span> },
    { key: 'status', label: 'Status', render: (r) => <AdminBadge active={r.isActive} onClick={() => handleToggle(r._id)} /> },
    { key: 'created', label: 'Created', render: (r) => <span className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => (
      <ActionButtons onView={() => setViewItem(r)} onEdit={() => openEdit(r)} onDelete={() => setDeleteId(r._id)} />
    )},
  ];

  return (
    <div>
      <AdminPageHeader
        title="Manage Brands"
        subtitle="Create and manage sweet brand partners for your catalog."
        breadcrumbs={[{ label: 'Brands' }]}
        action={<button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Brand</button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Total Brands</p><p className="text-2xl font-bold">{brands.length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-green-600">{brands.filter((b) => b.isActive).length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Inactive</p><p className="text-2xl font-bold text-red-500">{brands.filter((b) => !b.isActive).length}</p></div>
      </div>

      <AdminSearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search brands..."
        filters={[{ label: 'status', value: statusFilter, onChange: setStatusFilter, options: [{ value: 'all', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] }]}
      />

      <AdminTable columns={columns} data={filtered} emptyMessage="No brands found" />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Brand' : 'Add New Brand'} subtitle="Fill in the brand details below">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="admin-form-label">Brand Name *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Logo Image</label><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field" /></div>
          <div><label className="admin-form-label">Or Logo URL</label><input type="text" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="input-field" placeholder="https://..." /></div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /><span className="text-sm">Active (visible to customers)</span></label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Saving...' : editId ? 'Update Brand' : 'Create Brand'}</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={!!viewItem} onClose={() => setViewItem(null)} title="Brand Details" size="sm">
        {viewItem && (
          <div className="space-y-4">
            <img src={getImageUrl(viewItem.logo)} alt="" className="w-24 h-24 rounded-xl object-cover border mx-auto" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b"><dt className="text-gray-500">Name</dt><dd className="font-semibold">{viewItem.name}</dd></div>
              <div className="flex justify-between py-2 border-b"><dt className="text-gray-500">Status</dt><dd><AdminBadge active={viewItem.isActive} /></dd></div>
              <div className="flex justify-between py-2"><dt className="text-gray-500">Created</dt><dd>{new Date(viewItem.createdAt).toLocaleString()}</dd></div>
            </dl>
            <button onClick={() => { setViewItem(null); openEdit(viewItem); }} className="btn-primary w-full text-sm">Edit Brand</button>
          </div>
        )}
      </AdminModal>

      <AdminConfirmModal open={!!deleteId} title="Delete Brand" message="This will permanently delete the brand. Products linked to this brand may be affected." confirmLabel="Delete Brand" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger loading={saving} />
    </div>
  );
};

export default AdminBrands;
