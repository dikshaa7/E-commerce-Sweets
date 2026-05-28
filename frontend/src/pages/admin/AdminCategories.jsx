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

const emptyForm = { name: '', description: '', image: '', isActive: true };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
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

  const fetch = () => API.get('/categories').then(({ data }) => { setCategories(data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => categories.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? c.isActive : !c.isActive);
    return matchSearch && matchStatus;
  }), [categories, search, statusFilter]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setFile(null); setModalOpen(true); };
  const openEdit = (c) => { setEditId(c._id); setForm({ name: c.name, description: c.description, image: c.image, isActive: c.isActive }); setFile(null); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      if (editId) await API.put(`/categories/${editId}`, fd);
      else await API.post('/categories', fd);
      toast.success(editId ? 'Category updated' : 'Category created');
      setModalOpen(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await API.delete(`/categories/${deleteId}`); toast.success('Category deleted'); setDeleteId(null); fetch(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'image', label: 'Image', render: (r) => <img src={getImageUrl(r.image)} alt="" className="w-11 h-11 rounded-lg object-cover border" /> },
    { key: 'name', label: 'Category', render: (r) => (<div><p className="font-semibold">{r.name}</p><p className="text-xs text-gray-500 line-clamp-1">{r.description}</p></div>) },
    { key: 'status', label: 'Status', render: (r) => <AdminBadge active={r.isActive} onClick={async () => { await API.put(`/categories/${r._id}/toggle`); fetch(); }} /> },
    { key: 'date', label: 'Created', render: (r) => <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => <ActionButtons onView={() => setViewItem(r)} onEdit={() => openEdit(r)} onDelete={() => setDeleteId(r._id)} /> },
  ];

  return (
    <div>
      <AdminPageHeader title="Manage Categories" subtitle="Organize products into Mithai, Cakes, Chocolates and more." breadcrumbs={[{ label: 'Categories' }]} action={<button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Category</button>} />

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search categories..." filters={[{ label: 'status', value: statusFilter, onChange: setStatusFilter, options: [{ value: 'all', label: 'All' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] }]} />

      <AdminTable columns={columns} data={filtered} />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="admin-form-label">Category Name *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} /></div>
          <div><label className="admin-form-label">Category Image</label><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field" /></div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /><span className="text-sm">Active</span></label>
          <div className="flex gap-3"><button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{editId ? 'Update' : 'Create'}</button><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button></div>
        </form>
      </AdminModal>

      <AdminModal open={!!viewItem} onClose={() => setViewItem(null)} title="Category Details" size="sm">
        {viewItem && (
          <div className="space-y-4">
            <img src={getImageUrl(viewItem.image)} alt="" className="w-full h-40 rounded-xl object-cover" />
            <h3 className="font-bold text-lg">{viewItem.name}</h3>
            <p className="text-gray-600 text-sm">{viewItem.description || 'No description'}</p>
            <AdminBadge active={viewItem.isActive} />
          </div>
        )}
      </AdminModal>

      <AdminConfirmModal open={!!deleteId} title="Delete Category" message="Products in this category will need reassignment." confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger loading={saving} />
    </div>
  );
};

export default AdminCategories;
