import { Link } from 'react-router-dom';
import { Lead } from '../../types';
import { formatDate } from '../../utils/formatDate';
import { StatusBadge } from './StatusBadge';

interface LeadsTableProps {
  leads: Lead[];
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadsTable = ({ leads, isAdmin, onEdit, onDelete }: LeadsTableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
            Name
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
            Email
          </th>
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
            Status
          </th>
          <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:table-cell">
            Source
          </th>
          <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 md:table-cell">
            Created
          </th>
          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 bg-white">
        {leads.map((lead) => (
          <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
              {lead.name}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">{lead.email}</td>
            <td className="whitespace-nowrap px-4 py-3">
              <StatusBadge status={lead.status} />
            </td>
            <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-slate-600 sm:table-cell">
              {lead.source}
            </td>
            <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-slate-500 md:table-cell">
              {formatDate(lead.createdAt)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
              <div className="flex justify-end gap-2">
                <Link
                  to={`/leads/${lead._id}`}
                  className="font-medium text-primary-600 hover:text-primary-800"
                >
                  View
                </Link>
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => onEdit(lead)}
                      className="font-medium text-amber-600 hover:text-amber-800"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(lead)}
                      className="font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
