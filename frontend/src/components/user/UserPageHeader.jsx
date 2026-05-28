import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const UserPageHeader = ({ title, subtitle, breadcrumbs = [] }) => (
  <div className="mb-6">
    {breadcrumbs.length > 0 && (
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-2 flex-wrap">
        {breadcrumbs.map((item, i) => (
          <span key={item.label} className="flex items-center gap-1">
            {i > 0 && <FiChevronRight size={14} />}
            {item.to ? (
              <Link to={item.to} className="hover:text-primary-600 transition">{item.label}</Link>
            ) : (
              <span className="text-gray-700">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    )}
    <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">{title}</h1>
    {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

export default UserPageHeader;
