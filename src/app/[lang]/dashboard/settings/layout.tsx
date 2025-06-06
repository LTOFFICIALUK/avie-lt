"use client";
import React from "react";
import { usePathname } from "next/navigation";
import TabSubmenu from "@/components/menus/TabSubmenu";

interface PluginsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: PluginsLayoutProps) {
  const pathname = usePathname();

  // Get the base settings path dynamically (handles locales)
  const basePath = pathname.split("/").slice(0, 2).join("/");

  const navigation = [
    {
      name: "Account",
      href: `${basePath}/dashboard/settings`,
    },
    {
      name: "Subscriptions",
      href: `${basePath}/dashboard/settings/subscriptions`,
    },
    {
      name: "Payouts",
      href: `${basePath}/dashboard/settings/payouts`,
    },
    {
      name: "Privacy & Security",
      href: `${basePath}/dashboard/settings/privacy-security`,
    },
    {
      name: "Content Preferences",
      href: `${basePath}/dashboard/settings/content-preferences`,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb">
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-lg text-gray-400 mb-2">Manage your personal information, preferences, and account security.</p>
      </div>
      
      <TabSubmenu navigation={navigation}>{children}</TabSubmenu>
    </div>
  );
}
