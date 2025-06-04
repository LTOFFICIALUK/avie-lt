"use client";

import {
  BellOutlined,
  DashboardOutlined,
  HomeOutlined,
  MenuOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Avatar, Badge, Button, Dropdown, Skeleton } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import { useSession } from "@/providers/SessionProvider";
import { AuthSheet } from "./auth/AuthSheet";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect, useState } from "react";
import { SearchBar } from "./stream/SearchBar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SearchBarGlobal } from "./menus/SearchBar";

interface TopNavigationProps {
  onOpenSidebar?: () => void;
}


export function TopNavigation({ onOpenSidebar }: TopNavigationProps) {
  const { user, isAuthenticated, isLoading, logout, refresh } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useParams();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const handleLogout = () => {
    logout();
    router.push(`/${lang}/landing`);
  };

  const userMenuItems: MenuProps["items"] = [
    {
      type: "divider",
    },
    {
      key: "home",
      label: <Link href={`/${lang}`}>Home</Link>,
    },
    {
      key: "settings",
      label: <Link href={`/${lang}/dashboard/settings`}>Settings</Link>,
    },
    {
      key: "dashboard",
      label: <Link href={`/${lang}/dashboard`}>Dashboard</Link>,
    },
    {
      key: "profile",
      label: <Link href={`/${lang}/profile`}>Profile</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const handleRefresh = async () => {
    await refresh();
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const UserMenu = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2 ">
          <Skeleton.Button
            active
            size="small"
            className="!w-24 !h-8 !bg-white/5"
          />
          <Skeleton.Avatar active size={32} className="!bg-white/5 w-12 h-12" />
        </div>
      );
    }

    return (
      <>
        {isAuthenticated ? (
          <>
            {/* Mobile search button moved next to notifications */}
            {isSmallScreen && (
              <Button 
                type="text" 
                icon={<SearchOutlined style={{ fontSize: 22 }} />} 
                onClick={() => setShowMobileSearch(true)}
                className="flex items-center justify-center"
                style={{ border: "none", background: "transparent", padding: 0 }}
              />
            )}
            
            {/* Settings Button */}
            <Link href={`/${lang}/dashboard/settings`}>
              <Button 
                type="text" 
                icon={<SettingOutlined style={{ fontSize: 24 }} />} 
                className="flex items-center justify-center text-white hover:bg-[var(--color-gray)]/20 rounded-lg transition-all duration-200"
                style={{ 
                  border: "none", 
                  background: "transparent", 
                  width: 48, 
                  height: 48,
                  padding: 0
                }}
                title="Settings"
              />
            </Link>
            
            {/*<Badge count={5} size="small">
              <BellOutlined style={{ fontSize: 22 }} />
            </Badge> */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Avatar 
                size={48} 
                src={user?.avatarUrl || undefined}
                icon={!user?.avatarUrl && <UserOutlined />}
              >
                {!user?.avatarUrl && user?.displayName?.[0]}
              </Avatar>
            </Dropdown>
          </>
        ) : (
          <AuthSheet />
        )}
      </>
    );
  };

  return (
    <>
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Left side - Menu button */}
        <div className="md:hidden">
          <Button type="text" icon={<MenuOutlined />} onClick={onOpenSidebar} />
        </div>

        {/* Center - Search bar (only on desktop) */}
        <div className="flex-1 flex justify-center">
          {!isSmallScreen && (
            <div className="w-full max-w-[500px]">
              <SearchBarGlobal />
            </div>
          )}
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-5 ml-auto">
          <UserMenu />
        </div>
      </div>

      {/* Mobile search overlay */}
      {isSmallScreen && showMobileSearch && (
        <SearchBarGlobal 
          isSmallScreen={true} 
          onClose={() => setShowMobileSearch(false)} 
          isOverlay={true} 
        />
      )}
    </>
  );
}
