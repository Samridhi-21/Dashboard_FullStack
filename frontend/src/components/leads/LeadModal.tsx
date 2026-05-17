import { Lead, LeadFormData } from '../../types';
import { LeadForm } from './LeadForm';

interface LeadModalProps {
  isOpen: boolean;
  title: string;
  lead?: Lead;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
}

export const LeadModal = ({
  isOpen,
  title,
  lead,
  onClose,
  onSubmit,
  isSubmitting,
  submitLabel,
}: LeadModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
        <LeadForm
          defaultValues={
            lead
              ? {
                  name: lead.name,
                  email: lead.email,
                  status: lead.status,
                  source: lead.source,
                }
              : undefined
          }
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitLabel={submitLabel}
        />
      </div>
    </div>
  );
};
