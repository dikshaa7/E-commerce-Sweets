import { FiSearch } from 'react-icons/fi';

const AdminSearchFilter = ({ search, onSearchChange, placeholder = 'Search...', filters = [] }) => (
  <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3">
    <div className="relative flex-1">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10"
      />
    </div>
    {filters.map((f) => (
      <select key={f.label} value={f.value} onChange={(e) => f.onChange(e.target.value)} className="input-field md:w-48">
        {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ))}
  </div>
);

export default AdminSearchFilter;
