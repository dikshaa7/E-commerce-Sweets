import { useState, useEffect, useMemo } from 'react';
import { FiStar } from 'react-icons/fi';
import API, { getImageUrl } from '../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTable, { ActionButtons } from '../../components/admin/AdminTable';
import Loader from '../../components/Loader';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [viewReview, setViewReview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => API.get('/reviews/all').then(({ data }) => { setReviews(data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => reviews.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.product?.name?.toLowerCase().includes(q) || r.user?.name?.toLowerCase().includes(q) || r.comment?.toLowerCase().includes(q);
    const matchVis = visibilityFilter === 'all' || (visibilityFilter === 'visible' ? r.isVisible : !r.isVisible);
    return matchSearch && matchVis;
  }), [reviews, search, visibilityFilter]);

  const toggleVisibility = async (id) => {
    await API.put(`/reviews/${id}/toggle`);
    toast.success('Review visibility updated');
    fetch();
  };

  const handleDelete = async () => {
    await API.delete(`/reviews/${deleteId}`);
    toast.success('Review deleted');
    setDeleteId(null);
    fetch();
  };

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'product', label: 'Product', render: (r) => (
      <div className="flex items-center gap-2">
        <img src={getImageUrl(r.product?.image)} alt="" className="w-10 h-10 rounded object-cover" />
        <span className="font-medium line-clamp-1">{r.product?.name}</span>
      </div>
    )},
    { key: 'user', label: 'Customer', render: (r) => (<div><p className="font-medium">{r.user?.name}</p><p className="text-xs text-gray-500">{r.user?.email}</p></div>) },
    { key: 'rating', label: 'Rating', render: (r) => (
      <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <FiStar key={i} size={14} fill={i < r.rating ? 'currentColor' : 'none'} />)}</div>
    )},
    { key: 'comment', label: 'Comment', render: (r) => <span className="line-clamp-2 text-gray-600 max-w-xs">{r.comment || '—'}</span> },
    { key: 'visible', label: 'Visibility', render: (r) => <AdminBadge active={r.isVisible} activeLabel="Visible" inactiveLabel="Hidden" onClick={() => toggleVisibility(r._id)} /> },
    { key: 'date', label: 'Date', render: (r) => <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => <ActionButtons onView={() => setViewReview(r)} onDelete={() => setDeleteId(r._id)} /> },
  ];

  return (
    <div>
      <AdminPageHeader title="Manage Reviews" subtitle="Moderate product reviews — show, hide, or delete inappropriate content." breadcrumbs={[{ label: 'Reviews' }]} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Total Reviews</p><p className="text-2xl font-bold">{reviews.length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Visible</p><p className="text-2xl font-bold text-green-600">{reviews.filter((r) => r.isVisible).length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Hidden</p><p className="text-2xl font-bold text-gray-500">{reviews.filter((r) => !r.isVisible).length}</p></div>
      </div>

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search reviews..." filters={[{ label: 'vis', value: visibilityFilter, onChange: setVisibilityFilter, options: [{ value: 'all', label: 'All' }, { value: 'visible', label: 'Visible' }, { value: 'hidden', label: 'Hidden' }] }]} />

      <AdminTable columns={columns} data={filtered} emptyMessage="No reviews yet" />

      <AdminModal open={!!viewReview} onClose={() => setViewReview(null)} title="Review Details" size="md">
        {viewReview && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <img src={getImageUrl(viewReview.product?.image)} alt="" className="w-20 h-20 rounded-xl object-cover" />
              <div><p className="font-semibold">{viewReview.product?.name}</p><p className="text-sm text-gray-500">by {viewReview.user?.name}</p>
                <div className="flex text-yellow-400 mt-1">{[...Array(viewReview.rating)].map((_, i) => <FiStar key={i} size={16} fill="currentColor" />)}</div>
              </div>
            </div>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{viewReview.comment || 'No comment'}</p>
            <div className="flex gap-2">
              <button onClick={() => { toggleVisibility(viewReview._id); setViewReview(null); }} className="btn-secondary flex-1 text-sm">{viewReview.isVisible ? 'Hide Review' : 'Show Review'}</button>
              <button onClick={() => { setDeleteId(viewReview._id); setViewReview(null); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm">Delete</button>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminConfirmModal open={!!deleteId} title="Delete Review" message="This review will be permanently removed." confirmLabel="Delete Review" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
};

export default AdminReviews;
