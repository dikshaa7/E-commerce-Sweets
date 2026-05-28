import { useState, useEffect, useMemo } from 'react';
import { FiMail } from 'react-icons/fi';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminModal from '../../components/admin/AdminModal';
import AdminConfirmModal from '../../components/admin/AdminConfirmModal';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminTable, { ActionButtons } from '../../components/admin/AdminTable';
import Loader from '../../components/Loader';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  const [viewMsg, setViewMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => API.get('/contact').then(({ data }) => { setMessages(data); setLoading(false); });
  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => messages.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    const matchRead = readFilter === 'all' || (readFilter === 'read' ? m.isRead : !m.isRead);
    return matchSearch && matchRead;
  }), [messages, search, readFilter]);

  const toggleRead = async (id) => {
    await API.put(`/contact/${id}/toggle-read`);
    toast.success('Message status updated');
    fetch();
  };

  const openMessage = async (msg) => {
    setViewMsg(msg);
    if (!msg.isRead) {
      await API.put(`/contact/${msg._id}/toggle-read`);
      fetch();
    }
  };

  const handleDelete = async () => {
    await API.delete(`/contact/${deleteId}`);
    toast.success('Message deleted');
    setDeleteId(null);
    fetch();
  };

  const unread = messages.filter((m) => !m.isRead).length;

  if (loading) return <Loader fullScreen={false} />;

  const columns = [
    { key: 'from', label: 'From', render: (r) => (<div><p className={`font-medium ${!r.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{r.name}</p><p className="text-xs text-gray-500">{r.email}</p></div>) },
    { key: 'subject', label: 'Subject', render: (r) => <span className={!r.isRead ? 'font-semibold' : ''}>{r.subject}</span> },
    { key: 'preview', label: 'Message', render: (r) => <span className="line-clamp-1 text-gray-500 max-w-xs">{r.message}</span> },
    { key: 'status', label: 'Status', render: (r) => <AdminBadge active={r.isRead} activeLabel="Read" inactiveLabel="Unread" onClick={() => toggleRead(r._id)} /> },
    { key: 'date', label: 'Date', render: (r) => <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</span> },
    { key: 'actions', label: 'Actions', className: 'text-right', render: (r) => <ActionButtons onView={() => openMessage(r)} onDelete={() => setDeleteId(r._id)} /> },
  ];

  return (
    <div>
      <AdminPageHeader title="Contact Messages" subtitle="View and respond to customer inquiries from the contact form." breadcrumbs={[{ label: 'Messages' }]} action={unread > 0 ? <span className="bg-red-500 text-white text-sm px-3 py-1.5 rounded-full font-medium">{unread} unread</span> : null} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Total Messages</p><p className="text-2xl font-bold">{messages.length}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Unread</p><p className="text-2xl font-bold text-red-500">{unread}</p></div>
        <div className="admin-stat-card"><p className="text-sm text-gray-500">Read</p><p className="text-2xl font-bold text-green-600">{messages.length - unread}</p></div>
      </div>

      <AdminSearchFilter search={search} onSearchChange={setSearch} placeholder="Search messages..." filters={[{ label: 'read', value: readFilter, onChange: setReadFilter, options: [{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'read', label: 'Read' }] }]} />

      <AdminTable columns={columns} data={filtered} emptyMessage="No contact messages" />

      <AdminModal open={!!viewMsg} onClose={() => setViewMsg(null)} title={viewMsg?.subject} subtitle={`From ${viewMsg?.name} (${viewMsg?.email})`} size="md">
        {viewMsg && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center"><FiMail /></div>
              <div><p className="font-semibold">{viewMsg.name}</p><p className="text-sm text-gray-500">{viewMsg.email}</p><p className="text-xs text-gray-400">{new Date(viewMsg.createdAt).toLocaleString()}</p></div>
            </div>
            <div className="bg-white border rounded-xl p-5 text-gray-700 leading-relaxed">{viewMsg.message}</div>
            <div className="flex gap-2">
              <button onClick={() => { toggleRead(viewMsg._id); setViewMsg(null); }} className="btn-secondary flex-1 text-sm">{viewMsg.isRead ? 'Mark Unread' : 'Mark Read'}</button>
              <button onClick={() => { setDeleteId(viewMsg._id); setViewMsg(null); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm">Delete</button>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminConfirmModal open={!!deleteId} title="Delete Message" message="This message will be permanently deleted." confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} danger />
    </div>
  );
};

export default AdminMessages;
