import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const AdminPageHeader = ({ title, subtitle, breadcrumbs = [], action }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
    <div>
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-gray-500 mb-2 flex-wrap">
          <Link to="/admin" className="hover:text-primary-600">Admin</Link>
          {breadcrumbs.map((item) => (
            <span key={item.label} className="flex items-center gap-1">
              <FiChevronRight size={14} />
              {item.to ? <Link to={item.to} className="hover:text-primary-600">{item.label}</Link> : <span className="text-gray-700">{item.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default AdminPageHeader;
