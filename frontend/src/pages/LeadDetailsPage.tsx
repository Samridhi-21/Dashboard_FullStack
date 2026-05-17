import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { StatusBadge } from '../components/leads/StatusBadge';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';
import { leadService } from '../services/leadService';
import { Lead } from '../types';
import { formatDate } from '../utils/formatDate';

export const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await leadService.getLead(id);
        setLead(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleDelete = async () => {
    if (!lead || !window.confirm(`Delete lead "${lead.name}"?`)) return;
    try {
      await leadService.deleteLead(lead._id);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const getCreatedByName = (): string => {
    if (!lead?.createdBy) return 'Unknown';
    if (typeof lead.createdBy === 'string') return 'Unknown';
    return lead.createdBy.name;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
        >
          ← Back to Dashboard
        </Link>

        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : lead ? (
          <div className="card">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
                <p className="mt-1 text-slate-600">{lead.email}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase text-slate-500">Source</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{lead.source}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase text-slate-500">Created By</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{getCreatedByName()}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">
                <dt className="text-xs font-medium uppercase text-slate-500">Created At</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {formatDate(lead.createdAt)}
                </dd>
              </div>
            </dl>

            {isAdmin && (
              <div className="mt-8 flex gap-3 border-t border-slate-200 pt-6">
                <button type="button" onClick={handleDelete} className="btn-danger">
                  Delete Lead
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-slate-600">Lead not found</p>
            <Link to="/dashboard" className="btn-primary mt-4 inline-flex">
              Return to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};
