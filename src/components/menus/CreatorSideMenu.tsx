"use client";
import React from "react";
import {
  ApiOutlined,
  BarChartOutlined,
  DashboardOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import SideMenu from "./SideMenu";
import { usePathname } from "next/navigation";
import MenuListItem from "./MenuListItem";

interface Props {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CreatorMenu = ({ onClose, collapsed = false, onToggleCollapse }: Props) => {
  const pathname = usePathname();

  const dashboardRoutes = [
    {
      label: "Dashboard",
      icon: DashboardOutlined,
      href: "/dashboard",
    },
    {
      label: "Plugins",
      icon: ApiOutlined,
      href: "/dashboard/plugins",
    },
    {
      label: "Analytics",
      icon: BarChartOutlined,
      href: "/dashboard/analytics",
    },
    {
      label: "Settings",
      icon: SettingOutlined,
      href: "/dashboard/settings",
    },
    {
      label: "Go Live",
      icon: VideoCameraOutlined,
      href: "/dashboard/plugins/stream",
    },
  ];

  const contentRoutes = [
    {
      label: "Settings",
      icon: SettingOutlined,
      href: "/dashboard/content/settings",
    },
    {
      label: "Analytics",
      icon: BarChartOutlined,
      href: "/dashboard/content/analytics",
    },
    {
      label: "Playlist",
      icon: PlayCircleOutlined,
      href: "/dashboard/content/playlist",
    },
  ];

  const dashboardMenu = [
    {
      title: "Dashboard",
      children: dashboardRoutes.map((route) => (
        <MenuListItem
          key={route.label}
          href={route.href}
          label={route.label}
          icon={route.icon}
          active={pathname.endsWith(`${route.href}`)}
          collapsed={collapsed}
        />
      )),
    },
    {
      title: "Content",
      children: contentRoutes.map((route) => (
        <MenuListItem
          key={route.label}
          href={route.href}
          label={route.label}
          icon={route.icon}
          active={pathname.endsWith(`${route.href}`)}
          collapsed={collapsed}
        />
      )),
    },
  ];

  return (
    <SideMenu
      onClose={() => {
        onClose && onClose();
      }}
      items={dashboardMenu}
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
    ></SideMenu>
  );
};

export default CreatorMenu;
