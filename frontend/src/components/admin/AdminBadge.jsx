const AdminBadge = ({ active, activeLabel = 'Active', inactiveLabel = 'Inactive', onClick }) => {
  const cls = active
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : 'bg-red-100 text-red-700 border-red-200';
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      onClick={onClick}
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${cls} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
    >
      {active ? activeLabel : inactiveLabel}
    </Tag>
  );
};

export default AdminBadge;
