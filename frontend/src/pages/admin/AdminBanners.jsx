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

const emptyForm = { title: '', subtitle: '', link: '/products', order: 0, isActive: true };

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = () => API.get('/banners').then(({ data }) => { setBanners(data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => banners.filter((b) => b.title.toLowerCase().includes(search.toLowerCase())), [banners, search]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setFile(null); setModalOpen(true); };
  const openEdit = (b) => { setEditId(b._id); setForm({ title: b.title, subtitle: b.subtitle, link: b.link, order: b.order, isActive: b.isActive }); setFile(null); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      if (editId) await API.put(`/banners/${editId}`, fd);
      else await API.post('/banners', fd);
      toast.success(editId ? 'Banner updated' : 'Banner created');
      setModalOpen(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await API.delete(`/banners/${deleteId}`); toast.success('Banner deleted'); setDeleteId(null); fetch(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'preview', label: 'Preview', render: (r) => <img src={getImageUrl(r.image)} alt="" className="w-24 h-14 rounded-lg object-cover border" /> },
    { key: 'title', label: 'Banner', render: (r) => (<div><p className="font-semibold">{r.title}</p><p className="text-xs text-gray-500">{r.subtitle}</p></div>) },
    { key: 'link', label: 'Link', render: (r) => <span className="text-xs text-primary-600">{r.link}</span> },
    { key: 'order', label: 'Order', render: (r) => r.order },
    { key: 'status', label: 'Status', render: (r) => <AdminBadge active={r.isActive} onClick={async () => { await API.put(`/banners/${r._id}/toggle`); fetch(); }} /> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => <ActionButtons onView={() => setViewItem(r)} onEdit={() => openEdit(r)} onDelete={() => setDeleteId(r._id)} /> },
  ];

  return (
    <div>
      <AdminPageHeader title="Manage Banners" subtitle="Control homepage hero banners and promotional slides." breadcrumbs={[{ label: 'Banners' }]} action={<button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Banner</button>} />

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search banners..." />

      <AdminTable columns={columns} data={filtered} />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Banner' : 'Add Banner'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="admin-form-label">Title *</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Subtitle</label><input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Banner Image</label><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="input-field" /></div>
          <div><label className="admin-form-label">Link URL</label><input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Display Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input-field" /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Active</label>
          <div className="flex gap-3"><button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{editId ? 'Update' : 'Create'}</button><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button></div>
        </form>
      </AdminModal>

      <AdminModal open={!!viewItem} onClose={() => setViewItem(null)} title="Banner Preview" size="lg">
        {viewItem && (
          <div>
            <img src={getImageUrl(viewItem.image)} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className="text-xl font-bold">{viewItem.title}</h3>
            <p className="text-gray-500">{viewItem.subtitle}</p>
            <button onClick={() => { setViewItem(null); openEdit(viewItem); }} className="btn-primary w-full mt-4 text-sm">Edit Banner</button>
          </div>
        )}
      </AdminModal>

      <AdminConfirmModal open={!!deleteId} title="Delete Banner" message="This banner will be removed from the homepage." confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger loading={saving} />
    </div>
  );
};

export default AdminBanners;
