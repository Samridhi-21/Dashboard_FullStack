import { FilterQuery } from 'mongoose';
import { ILeadDocument, Lead } from '../models/Lead';
import { LeadQueryParams, PaginationMeta } from '../types';
import { AppError } from '../utils/AppError';

const PAGE_LIMIT = 10;

interface CreateLeadInput {
  name: string;
  email: string;
  status?: string;
  source: string;
  createdBy: string;
}

interface UpdateLeadInput {
  name?: string;
  email?: string;
  status?: string;
  source?: string;
}

interface PaginatedLeadsResult {
  leads: ILeadDocument[];
  pagination: PaginationMeta;
}

const buildFilter = (params: LeadQueryParams): FilterQuery<ILeadDocument> => {
  const filter: FilterQuery<ILeadDocument> = {};

  if (params.status) {
    filter.status = params.status;
  }

  if (params.source) {
    filter.source = params.source;
  }

  if (params.search) {
    const searchRegex = new RegExp(params.search, 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

const buildPagination = (page: number, totalRecords: number): PaginationMeta => {
  const totalPages = Math.ceil(totalRecords / PAGE_LIMIT) || 1;
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  return {
    currentPage,
    totalPages,
    totalRecords,
    limit: PAGE_LIMIT,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export const getLeads = async (params: LeadQueryParams): Promise<PaginatedLeadsResult> => {
  const page = params.page ?? 1;
  const skip = (page - 1) * PAGE_LIMIT;
  const filter = buildFilter(params);
  const sortOrder = params.sort === 'oldest' ? 1 : -1;

  const [leads, totalRecords] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(PAGE_LIMIT)
      .populate('createdBy', 'name email'),
    Lead.countDocuments(filter),
  ]);

  const pagination = buildPagination(page, totalRecords);

  return { leads, pagination };
};

export const getAllLeadsForExport = async (params: LeadQueryParams): Promise<ILeadDocument[]> => {
  const filter = buildFilter(params);
  const sortOrder = params.sort === 'oldest' ? 1 : -1;

  return Lead.find(filter).sort({ createdAt: sortOrder }).populate('createdBy', 'name email');
};

export const getLeadById = async (id: string): Promise<ILeadDocument> => {
  const lead = await Lead.findById(id).populate('createdBy', 'name email');
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  return lead;
};

export const createLead = async (input: CreateLeadInput): Promise<ILeadDocument> => {
  const lead = await Lead.create({
    name: input.name,
    email: input.email,
    status: input.status ?? 'New',
    source: input.source,
    createdBy: input.createdBy,
  });

  return lead.populate('createdBy', 'name email');
};

export const updateLead = async (id: string, input: UpdateLeadInput): Promise<ILeadDocument> => {
  const lead = await Lead.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
};

export const deleteLead = async (id: string): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
};
