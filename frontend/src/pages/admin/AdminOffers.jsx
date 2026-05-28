import { useState, useEffect, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTable, { ActionButtons } from '../../components/admin/AdminTable';
import Loader from '../../components/Loader';

const emptyForm = { title: '', description: '', discountPercent: '', product: '', category: '', isFestivalOffer: false, isActive: true };

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    Promise.all([API.get('/offers'), API.get('/products?limit=200'), API.get('/categories')]).then(([o, p, c]) => {
      setOffers(o.data); setProducts(p.data.products); setCategories(c.data); setLoading(false);
    });
  };
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => offers.filter((o) => o.title.toLowerCase().includes(search.toLowerCase())), [offers, search]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (o) => {
    setEditId(o._id);
    setForm({ title: o.title, description: o.description, discountPercent: o.discountPercent, product: o.product?._id || '', category: o.category?._id || '', isFestivalOffer: o.isFestivalOffer, isActive: o.isActive });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, discountPercent: Number(form.discountPercent), product: form.product || undefined, category: form.category || undefined };
    try {
      if (editId) await API.put(`/offers/${editId}`, payload);
      else await API.post('/offers', payload);
      toast.success(editId ? 'Offer updated' : 'Offer created');
      setModalOpen(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await API.delete(`/offers/${deleteId}`); toast.success('Offer removed'); setDeleteId(null); fetch(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'title', label: 'Offer', render: (r) => (<div><p className="font-semibold">{r.title}</p><p className="text-xs text-gray-500 line-clamp-1">{r.description}</p></div>) },
    { key: 'discount', label: 'Discount', render: (r) => <span className="font-bold text-primary-700">{r.discountPercent}% OFF</span> },
    { key: 'target', label: 'Applies To', render: (r) => r.product?.name || r.category?.name || 'General' },
    { key: 'type', label: 'Type', render: (r) => r.isFestivalOffer ? <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">Festival</span> : <span className="text-xs text-gray-500">Regular</span> },
    { key: 'status', label: 'Status', render: (r) => <AdminBadge active={r.isActive} /> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => <ActionButtons onEdit={() => openEdit(r)} onDelete={() => setDeleteId(r._id)} /> },
  ];

  return (
    <div>
      <AdminPageHeader title="Manage Offers & Discounts" subtitle="Create festival offers and product/category discounts." breadcrumbs={[{ label: 'Offers' }]} action={<button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus size={16} /> Add Offer</button>} />

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search offers..." />

      <AdminTable columns={columns} data={filtered} emptyMessage="No offers created yet" />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Offer' : 'Create Offer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="admin-form-label">Offer Title *</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Discount Percentage *</label><input type="number" required min="1" max="100" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} className="input-field" /></div>
          <div><label className="admin-form-label">Apply to Product</label><select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="input-field"><option value="">None</option>{products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}</select></div>
          <div><label className="admin-form-label">Apply to Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field"><option value="">None</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
          <div><label className="admin-form-label">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} /></div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFestivalOffer} onChange={(e) => setForm({ ...form, isFestivalOffer: e.target.checked })} />Festival Offer</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Active</label>
          </div>
          <div className="flex gap-3"><button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{editId ? 'Update Offer' : 'Create Offer'}</button><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button></div>
        </form>
      </AdminModal>

      <AdminConfirmModal open={!!deleteId} title="Remove Offer" message="Discount will be removed from linked products." confirmLabel="Remove Offer" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger loading={saving} />
    </div>
  );
};

export default AdminOffers;
