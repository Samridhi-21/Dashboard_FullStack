import { ApiResponse, Lead, LeadFilters, LeadFormData, PaginationMeta } from '../types';
import { api } from './api';

interface LeadsResponse {
  leads: Lead[];
}

interface LeadResponse {
  lead: Lead;
}

export const leadService = {
  getLeads: async (
    filters: LeadFilters
  ): Promise<{ leads: Lead[]; pagination: PaginationMeta }> => {
    const params: Record<string, string | number> = {
      page: filters.page,
      sort: filters.sort,
    };

    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;

    const response = await api.get<ApiResponse<LeadsResponse>>('/leads', { params });
    return {
      leads: response.data.data.leads,
      pagination: response.data.pagination!,
    };
  },

  getLead: async (id: string): Promise<Lead> => {
    const response = await api.get<ApiResponse<LeadResponse>>(`/leads/${id}`);
    return response.data.data.lead;
  },

  createLead: async (data: LeadFormData): Promise<Lead> => {
    const response = await api.post<ApiResponse<LeadResponse>>('/leads', data);
    return response.data.data.lead;
  },

  updateLead: async (id: string, data: Partial<LeadFormData>): Promise<Lead> => {
    const response = await api.put<ApiResponse<LeadResponse>>(`/leads/${id}`, data);
    return response.data.data.lead;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  exportLeads: async (filters: LeadFilters): Promise<Blob> => {
    const params: Record<string, string> = { sort: filters.sort };
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;

    const response = await api.get('/leads/export', {
      params,
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};
