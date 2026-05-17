import { useForm } from 'react-hook-form';
import { LEAD_SOURCES, LEAD_STATUSES, LeadFormData } from '../../types';

interface LeadFormProps {
  defaultValues?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const LeadForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="label-field">
          Name
        </label>
        <input
          id="name"
          type="text"
          className={`input-field ${errors.name ? 'border-red-500' : ''}`}
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="label-field">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`input-field ${errors.email ? 'border-red-500' : ''}`}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="label-field">
            Status
          </label>
          <select id="status" className="input-field" {...register('status', { required: true })}>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="source" className="label-field">
            Source
          </label>
          <select id="source" className="input-field" {...register('source', { required: true })}>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
