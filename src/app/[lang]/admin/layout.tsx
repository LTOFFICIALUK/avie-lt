import type { Metadata } from 'next';
import AdminLayout from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: 'Admin Panel | LiveStreamCoin Platform',
  description: 'Administration and moderation dashboard for the LiveStreamCoin Platform',
};

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
} 