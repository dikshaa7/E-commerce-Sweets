const AdminStatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <div className="admin-stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </div>
);

export default AdminStatCard;
