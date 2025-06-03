import type { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | LiveStreamCoin Platform',
  description: 'Main administration dashboard for the LiveStreamCoin Platform',
};

export default function AdminPage() {
  return <AdminDashboard />;
} 