"use client";
import React from "react";
import { usePathname } from "next/navigation";
import TabSubmenu from "@/components/menus/TabSubmenu";
import AnalyticsOverview from "./(components)/AnalyticsOverview";

interface AnalyticsLayoutProps {
  children: React.ReactNode;
}

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  const pathname = usePathname();

  // Get the base analytics path dynamically (handles locales)
  const basePath = pathname.split("/").slice(0, 3).join("/");

  const navigation = [
    {
      name: "AP",
      href: `${basePath}/analytics/ap`,
    },
    {
      name: "Stream Stats",
      href: `${basePath}/analytics/stream-stats`,
    },
    {
      name: "Audience",
      href: `${basePath}/analytics/audience`,
    },
    {
      name: "Engagement",
      href: `${basePath}/analytics/engagement`,
    },
    {
      name: "Revenue",
      href: `${basePath}/analytics/revenue`,
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Analytics</h1>
          <p className="text-base sm:text-lg text-gray-400 mb-3 sm:mb-4">See your stats and analytics here in real time</p>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
        </div>
        
        {/* Analytics Overview Cards */}
        <div className="mb-6 sm:mb-8">
          <AnalyticsOverview />
        </div>
        
        {/* Tab Navigation and Content */}
        <div className="w-full">
          <TabSubmenu navigation={navigation}>
            <div className="w-full">
              {children}
            </div>
          </TabSubmenu>
        </div>
      </div>
    </div>
  );
} 