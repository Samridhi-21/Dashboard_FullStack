import { Response } from 'express';
import * as leadService from '../services/leadService';
import { AuthenticatedRequest, LeadQueryParams, LeadSource, LeadStatus, SortOrder } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';

const getParamId = (id: string | string[]): string => {
  return Array.isArray(id) ? id[0] : id;
};

const parseQueryParams = (query: AuthenticatedRequest['query']): LeadQueryParams => ({
  status: query.status as LeadStatus | undefined,
  source: query.source as LeadSource | undefined,
  search: query.search as string | undefined,
  sort: (query.sort as SortOrder) ?? 'latest',
  page: query.page ? parseInt(String(query.page), 10) : 1,
});

export const getLeads = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = parseQueryParams(req.query);
  const { leads, pagination } = await leadService.getLeads(params);
  sendSuccess(res, 200, 'Leads retrieved successfully', { leads }, pagination);
});

export const exportLeads = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const params = parseQueryParams(req.query);
  const leads = await leadService.getAllLeadsForExport(params);

  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    `"${lead.name.replace(/"/g, '""')}"`,
    `"${lead.email.replace(/"/g, '""')}"`,
    lead.status,
    lead.source,
    new Date(lead.createdAt).toISOString(),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
  res.status(200).send(csv);
});

export const getLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const lead = await leadService.getLeadById(getParamId(req.params.id));
  sendSuccess(res, 200, 'Lead retrieved successfully', { lead });
});

export const createLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, status, source } = req.body as {
    name: string;
    email: string;
    status?: string;
    source: string;
  };

  const lead = await leadService.createLead({
    name,
    email,
    status,
    source,
    createdBy: req.user!.userId,
  });

  sendSuccess(res, 201, 'Lead created successfully', { lead });
});

export const updateLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, status, source } = req.body as {
    name?: string;
    email?: string;
    status?: string;
    source?: string;
  };

  const lead = await leadService.updateLead(getParamId(req.params.id), {
    name,
    email,
    status,
    source,
  });
  sendSuccess(res, 200, 'Lead updated successfully', { lead });
});

export const deleteLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  await leadService.deleteLead(getParamId(req.params.id));
  sendSuccess(res, 200, 'Lead deleted successfully', { deleted: true });
});
