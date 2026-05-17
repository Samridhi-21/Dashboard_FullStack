import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { LeadSource, LeadStatus } from '../types';

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {}

const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'New',
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: [true, 'Lead source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, source: 1 });
leadSchema.index({ name: 'text', email: 'text' });
leadSchema.index({ createdAt: -1 });

export const Lead: Model<ILeadDocument> = mongoose.model<ILeadDocument>('Lead', leadSchema);

export { LEAD_STATUSES, LEAD_SOURCES };
