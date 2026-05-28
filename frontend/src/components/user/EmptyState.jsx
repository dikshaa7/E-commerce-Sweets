import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, description, actionLabel, actionTo, onAction }) => (
  <div className="card p-12 text-center">
    {Icon && (
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
        <Icon size={28} />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn-primary inline-block">{actionLabel}</Link>
    )}
    {actionLabel && onAction && (
      <button type="button" onClick={onAction} className="btn-primary">{actionLabel}</button>
    )}
  </div>
);

export default EmptyState;
