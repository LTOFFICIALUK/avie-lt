import type { Metadata } from 'next';
import ModerationDashboard from '@/components/admin/moderation/ModerationDashboard';

export const metadata: Metadata = {
  title: 'Admin | Moderation',
  description: 'Manage user moderation actions, bans, timeouts, and warnings.',
};

export default function ModerationPage() {
  return <ModerationDashboard />;
} 