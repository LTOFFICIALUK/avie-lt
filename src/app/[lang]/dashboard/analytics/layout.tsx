"use client";
import React from "react";
import { usePathname } from "next/navigation";
import TabSubmenu from "@/components/menus/TabSubmenu";

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
    <div className="min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <TabSubmenu navigation={navigation}>
          {children}
        </TabSubmenu>
      </div>
    </div>
  );
} 