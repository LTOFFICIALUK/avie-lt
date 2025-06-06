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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Analytics</h1>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
      </div>
      
      <div className="flex items-center justify-center h-32 sm:h-48 lg:h-64">
        <Spin size="large" />
      </div>
    </div>
  );
}
