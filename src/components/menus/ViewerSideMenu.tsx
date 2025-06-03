"use client";
import {
  BarChartOutlined,
  CameraOutlined,
  CommentOutlined,
  HistoryOutlined,
  HomeOutlined,
  RiseOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  UserOutlined,
  ScissorOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import React from "react";
import MenuListItem from "./MenuListItem";
import { useParams, usePathname } from "next/navigation";
import SideMenu from "./SideMenu";

interface Props {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ViewerMenu = ({ onClose, collapsed = false, onToggleCollapse }: Props) => {
  const pathname = usePathname();
  const params = useParams();

  const lang = params?.lang as string;

  const homeRoutes = [
    {
      label: "Feed",
      icon: HomeOutlined,
      href: "/",
    },
    {
      label: "Trending",
      icon: RiseOutlined,
      href: "/trending",
    },
    {
      label: "Following",
      icon: UserOutlined,
      href: "/following",
    },
    {
      label: "Previously watched",
      icon: HistoryOutlined,
      href: "/previously-watched",
    },
  ];

  const clipsRoutes = [
    {
      label: "My Clips",
      icon: ScissorOutlined,
      href: "/clips",
    },
    {
      label: "Discover Clips",
      icon: GlobalOutlined,
      href: "/clips/discover",
    },
  ];

  const categoriesRoutes = [
    {
      label: "Categories",
      icon: UnorderedListOutlined,
      href: "/streams/categories",
    },
  ];

  const homeMenu = [
    {
      title: "Home",
      children: homeRoutes.map((route) => (
        <MenuListItem
          key={route.label}
          href={route.href}
          label={route.label}
          icon={route.icon}
          active={
            pathname.endsWith(`${route.href}`) ||
            (pathname.endsWith(lang) && route.href === "/")
          }
          collapsed={collapsed}
        />
      )),
    },
    {
      title: "Clips",
      children: clipsRoutes.map((route) => (
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
      title: "Categories",
      children: categoriesRoutes.map((route) => (
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
      items={homeMenu}
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
    ></SideMenu>
  );
};

export default ViewerMenu;
