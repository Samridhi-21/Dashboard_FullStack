import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Lead } from '../models/Lead';

dotenv.config();

const seed = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB for seeding');

  await User.deleteMany({});
  await Lead.deleteMany({});

  const adminPassword = await bcrypt.hash('admin123', 12);
  const salesPassword = await bcrypt.hash('sales123', 12);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartleads.com',
    password: adminPassword,
    role: 'admin',
  });

  const salesUser = await User.create({
    name: 'Sales User',
    email: 'sales@smartleads.com',
    password: salesPassword,
    role: 'sales',
  });

  const sampleLeads = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', status: 'Qualified' as const, source: 'Instagram' as const },
    { name: 'Priya Patel', email: 'priya@example.com', status: 'New' as const, source: 'Website' as const },
    { name: 'Amit Kumar', email: 'amit@example.com', status: 'Contacted' as const, source: 'Referral' as const },
    { name: 'Sneha Reddy', email: 'sneha@example.com', status: 'Lost' as const, source: 'Website' as const },
    { name: 'Vikram Singh', email: 'vikram@example.com', status: 'Qualified' as const, source: 'Instagram' as const },
    { name: 'Anita Desai', email: 'anita@example.com', status: 'New' as const, source: 'Referral' as const },
    { name: 'Karan Mehta', email: 'karan@example.com', status: 'Contacted' as const, source: 'Website' as const },
    { name: 'Divya Nair', email: 'divya@example.com', status: 'New' as const, source: 'Instagram' as const },
    { name: 'Rohan Gupta', email: 'rohan@example.com', status: 'Qualified' as const, source: 'Referral' as const },
    { name: 'Meera Joshi', email: 'meera@example.com', status: 'Contacted' as const, source: 'Website' as const },
    { name: 'Arjun Iyer', email: 'arjun@example.com', status: 'New' as const, source: 'Instagram' as const },
    { name: 'Lakshmi Rao', email: 'lakshmi@example.com', status: 'Lost' as const, source: 'Referral' as const },
  ];

  for (const lead of sampleLeads) {
    await Lead.create({
      ...lead,
      createdBy: Math.random() > 0.5 ? admin._id : salesUser._id,
    });
  }

  console.log('Seed completed successfully');
  console.log('Admin: admin@smartleads.com / admin123');
  console.log('Sales: sales@smartleads.com / sales123');

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
