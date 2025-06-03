import type { Metadata } from 'next';
import ReportsDashboard from '@/components/admin/moderation/ReportsDashboard';

export const metadata: Metadata = {
  title: 'Admin | Content Reports',
  description: 'View and manage reported content across the platform',
};

export default function ReportsPage() {
  return <ReportsDashboard />;
} 