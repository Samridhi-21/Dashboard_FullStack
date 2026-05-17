import { LeadStatus, STATUS_COLORS } from '../../types';

interface StatusBadgeProps {
  status: LeadStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[status]}`}
  >
    {status}
  </span>
);
