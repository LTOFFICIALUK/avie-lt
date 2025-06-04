"use client";
import { DashboardOutlined, HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

interface Props {
  collapsed?: boolean;
}

const TabSwitcher = ({ collapsed = false }: Props) => {
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.lang as string;

  const isDashboard = pathname.includes("/dashboard");

  const tabs = [
    {
      key: "home",
      label: "Home", 
      icon: HomeOutlined,
      href: `/${locale}`,
      active: !isDashboard,
    },
    {
      key: "dashboard",
      label: "Dashboard",
      icon: DashboardOutlined, 
      href: `/${locale}/dashboard`,
      active: isDashboard,
    },
  ];

  if (collapsed) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`
                flex items-center justify-center
                w-12 h-12 mx-auto
                rounded-xl
                transition-all duration-300 ease-in-out
                border backdrop-blur-sm
                ${
                  tab.active
                    ? "border-[#84eef5]/50 shadow-lg shadow-[#84eef5]/30"
                    : "hover:bg-[var(--color-gray)]/80 hover:text-white text-[var(--text-secondary)] hover:shadow-md hover:shadow-black/10 border-transparent hover:border-[var(--color-gray)]/20"
                }
              `}
              title={tab.label}
              style={{ 
                backgroundColor: tab.active ? '#84eef5' : 'transparent',
                color: tab.active ? '#000000' : undefined
              }}
            >
              <Icon 
                style={{ 
                  fontSize: '18px', 
                  color: tab.active ? '#000000' : undefined 
                }} 
              />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        className="
          flex items-center
          bg-[var(--color-primary)]/50
          backdrop-blur-sm
          rounded-xl
          p-1
          border border-[var(--color-border)]
          overflow-hidden
        "
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`
                flex items-center justify-center gap-2
                flex-1
                py-3 px-4
                rounded-lg
                transition-all duration-300 ease-in-out
                font-medium text-sm
                overflow-hidden
                relative
                text-center
                border
                ${
                  tab.active
                    ? "border-[#84eef5]/20 shadow-md shadow-[#84eef5]/30"
                    : "hover:bg-[var(--color-gray)]/30 hover:text-white text-[var(--text-secondary)] border-transparent"
                }
              `}
              style={{ 
                backgroundColor: tab.active ? '#84eef5' : 'transparent',
                color: tab.active ? '#000000' : undefined
              }}
            >
              <Icon 
                style={{ 
                  fontSize: '16px', 
                  color: tab.active ? '#000000' : undefined 
                }} 
              />
              <span 
                className="whitespace-nowrap font-semibold"
                style={{ color: tab.active ? '#000000' : undefined }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TabSwitcher; 