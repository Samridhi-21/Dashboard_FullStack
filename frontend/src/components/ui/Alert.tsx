interface AlertProps {
  type: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
}

const styles = {
  error: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export const Alert = ({ type, message, onClose }: AlertProps) => (
  <div className={`flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
    <p>{message}</p>
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        className="ml-4 shrink-0 font-medium opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        ×
      </button>
    )}
  </div>
);
