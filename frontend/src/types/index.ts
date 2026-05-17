export type UserRole = 'admin' | 'sales';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';

export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export type SortOrder = 'latest' | 'oldest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface CreatedByUser {
  _id: string;
  name: string;
  email: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: CreatedByUser | string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface LeadFilters {
  status: LeadStatus | '';
  source: LeadSource | '';
  search: string;
  sort: SortOrder;
  page: number;
}

export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const STATUS_COLORS: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-amber-100 text-amber-800',
  Qualified: 'bg-emerald-100 text-emerald-800',
  Lost: 'bg-red-100 text-red-800',
};
