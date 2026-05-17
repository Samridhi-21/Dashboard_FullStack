import { LEAD_SOURCES, LEAD_STATUSES, LeadFilters as Filters, SortOrder } from '../../types';

interface LeadFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string | number) => void;
  onSearchChange: (value: string) => void;
  searchInput: string;
}

export const LeadFiltersBar = ({
  filters,
  onFilterChange,
  onSearchChange,
  searchInput,
}: LeadFiltersProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div>
      <label htmlFor="search" className="label-field">
        Search
      </label>
      <input
        id="search"
        type="text"
        placeholder="Search by name or email..."
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input-field"
      />
    </div>

    <div>
      <label htmlFor="status" className="label-field">
        Status
      </label>
      <select
        id="status"
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="input-field"
      >
        <option value="">All Statuses</option>
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
      <select
        id="source"
        value={filters.source}
        onChange={(e) => onFilterChange('source', e.target.value)}
        className="input-field"
      >
        <option value="">All Sources</option>
        {LEAD_SOURCES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="sort" className="label-field">
        Sort By
      </label>
      <select
        id="sort"
        value={filters.sort}
        onChange={(e) => onFilterChange('sort', e.target.value as SortOrder)}
        className="input-field"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  </div>
);
