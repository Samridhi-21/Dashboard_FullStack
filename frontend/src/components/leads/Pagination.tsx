import { PaginationMeta } from '../../types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { currentPage, totalPages, totalRecords, hasNextPage, hasPrevPage } = pagination;

  if (totalRecords === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-4 sm:flex-row">
      <p className="text-sm text-slate-600">
        Showing page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span> ({totalRecords} total leads)
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="btn-secondary"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};
