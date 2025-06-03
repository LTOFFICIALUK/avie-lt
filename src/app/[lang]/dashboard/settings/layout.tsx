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

  return <TabSubmenu navigation={navigation}>{children}</TabSubmenu>;
}
