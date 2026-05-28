const StatusBadge = ({ status, type = 'order' }) => {
  const colors = type === 'payment'
    ? {
        Pending: 'bg-yellow-100 text-yellow-800',
        Paid: 'bg-green-100 text-green-800',
        Failed: 'bg-red-100 text-red-800',
        Refunded: 'bg-gray-100 text-gray-800',
      }
    : {
        Pending: 'bg-amber-100 text-amber-800',
        Confirmed: 'bg-blue-100 text-blue-800',
        Packed: 'bg-indigo-100 text-indigo-800',
        Shipped: 'bg-purple-100 text-purple-800',
        Delivered: 'bg-emerald-100 text-emerald-800',
        Cancelled: 'bg-red-100 text-red-800',
      };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
