import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

export const ActionButtons = ({ onView, onEdit, onDelete, viewLabel = 'View', editLabel = 'Edit', deleteLabel = 'Delete' }) => (
  <div className="flex items-center justify-end gap-1">
    {onView && (
      <button onClick={onView} title={viewLabel} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
        <FiEye size={16} />
      </button>
    )}
    {onEdit && (
      <button onClick={onEdit} title={editLabel} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
        <FiEdit2 size={16} />
      </button>
    )}
    {onDelete && (
      <button onClick={onDelete} title={deleteLabel} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
        <FiTrash2 size={16} />
      </button>
    )}
  </div>
);

const AdminTable = ({ columns, data, keyField = '_id', emptyMessage = 'No records found' }) => (
  <div className="admin-table-wrap">
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={col.className || ''}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={columns.length} className="text-center py-12 text-gray-500">{emptyMessage}</td></tr>
        ) : data.map((row) => (
          <tr key={row[keyField]}>
            {columns.map((col) => (
              <td key={col.key} className={col.className || ''}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminTable;
