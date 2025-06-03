"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

export default function AnalyticsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the XP page
    router.replace('./analytics/ap');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <Spin size="large" />
    </div>
  );
}
