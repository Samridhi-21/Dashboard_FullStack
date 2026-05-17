import { useCallback, useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { LeadModal } from '../components/leads/LeadModal';
import { LeadsTable } from '../components/leads/LeadsTable';
import { Pagination } from '../components/leads/Pagination';
import { Alert } from '../components/ui/Alert';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { getErrorMessage } from '../services/api';
import { leadService } from '../services/leadService';
import { Lead, LeadFilters, LeadFormData, PaginationMeta } from '../types';
import { downloadBlob } from '../utils/downloadCsv';

const initialFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
};

export const DashboardPage = () => {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const queryFilters: LeadFilters = {
        ...filters,
        search: debouncedSearch,
        page: filters.page,
      };
      const result = await leadService.getLeads(queryFilters);
      setLeads(result.leads);
      setPagination(result.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const handleFilterChange = (key: keyof LeadFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? (value as number) : 1,
    }));
  };

  const handleCreate = () => {
    setEditingLead(undefined);
    setModalOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleDelete = async (lead: Lead) => {
    if (!window.confirm(`Delete lead "${lead.name}"?`)) return;
    try {
      await leadService.deleteLead(lead._id);
      fetchLeads();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      if (editingLead) {
        await leadService.updateLead(editingLead._id, data);
      } else {
        await leadService.createLead(data);
      }
      setModalOpen(false);
      fetchLeads();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await leadService.exportLeads({
        ...filters,
        search: debouncedSearch,
      });
      downloadBlob(blob, 'leads-export.csv');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leads Dashboard</h1>
            <p className="mt-1 text-slate-600">Manage and track your sales leads</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="btn-secondary"
            >
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
            <button type="button" onClick={handleCreate} className="btn-primary">
              + Add Lead
            </button>
          </div>
        </div>

        <div className="card mb-6">
          <LeadFiltersBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearchChange={setSearchInput}
            searchInput={searchInput}
          />
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <div className="card">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : leads.length === 0 ? (
            <EmptyState
              title="No leads found"
              description="Try adjusting your filters or add a new lead to get started."
              action={
                <button type="button" onClick={handleCreate} className="btn-primary">
                  Add Lead
                </button>
              }
            />
          ) : (
            <>
              <LeadsTable
                leads={leads}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {pagination && (
                <div className="mt-6">
                  <Pagination
                    pagination={pagination}
                    onPageChange={(page) => handleFilterChange('page', page)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <LeadModal
        isOpen={modalOpen}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
        lead={editingLead}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={editingLead ? 'Update Lead' : 'Create Lead'}
      />
    </div>
  );
};
