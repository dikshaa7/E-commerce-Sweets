import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiEdit2, FiTrash2 } from 'react-icons/fi';
import API, { getImageUrl } from '../../utils/api';
import toast from 'react-hot-toast';
import UserPageHeader from '../../components/user/UserPageHeader';
import EmptyState from '../../components/user/EmptyState';
import ConfirmModal from '../../components/user/ConfirmModal';
import Loader from '../../components/Loader';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });
  const [deleteId, setDeleteId] = useState(null);

  const fetchReviews = () => {
    API.get('/reviews/my').then(({ data }) => {
      setReviews(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchReviews(); }, []);

  const startEdit = (review) => {
    setEditId(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const saveEdit = async () => {
    try {
      await API.put(`/reviews/${editId}`, editForm);
      toast.success('Review updated!');
      setEditId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    await API.delete(`/reviews/${deleteId}`);
    toast.success('Review deleted');
    setDeleteId(null);
    fetchReviews();
  };

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div>
      <UserPageHeader
        title="My Reviews"
        subtitle="View, edit, or delete your product reviews."
        breadcrumbs={[{ label: 'My Account', to: '/account' }, { label: 'Reviews' }]}
      />

      {reviews.length === 0 ? (
        <EmptyState
          icon={FiStar}
          title="No reviews yet"
          description="Purchase and receive products to share your experience with other customers."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="card p-5">
              <div className="flex gap-4">
                <Link to={`/products/${review.product?._id}`}>
                  <img src={getImageUrl(review.product?.image)} alt="" className="w-16 h-16 rounded-xl object-cover" />
                </Link>
                <div className="flex-1">
                  <Link to={`/products/${review.product?._id}`} className="font-semibold hover:text-primary-600">
                    {review.product?.name}
                  </Link>
                  <div className="flex text-yellow-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} fill={i < review.rating ? 'currentColor' : 'none'} size={14} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(review)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><FiEdit2 size={16} /></button>
                  <button onClick={() => setDeleteId(review._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={16} /></button>
                </div>
              </div>

              {editId === review._id ? (
                <div className="mt-4 pt-4 border-t grid md:grid-cols-4 gap-3">
                  <select value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })} className="input-field text-sm">
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                  <input type="text" value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })} className="input-field text-sm md:col-span-2" />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="btn-primary text-sm py-2 flex-1">Save</button>
                    <button onClick={() => setEditId(null)} className="btn-secondary text-sm py-2">Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded-lg">{review.comment || 'No comment provided.'}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Review"
        message="Are you sure you want to delete this review? This cannot be undone."
        confirmLabel="Delete Review"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
};

export default MyReviews;
