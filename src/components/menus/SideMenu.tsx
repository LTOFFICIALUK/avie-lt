"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, message } from "antd";
import { CloseOutlined, MenuUnfoldOutlined, MenuFoldOutlined, CopyOutlined, XOutlined, DiscordOutlined, SendOutlined } from "@ant-design/icons";
import TabSwitcher from "./TabSwitcher";

// Define a proper type for menu items
interface MenuItem {
  title: string;
  children: React.ReactNode;
}

interface Props {
  items: MenuItem[];
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const SideMenu = ({ items, onClose, collapsed = false, onToggleCollapse }: Props) => {
  const { lang } = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isLargeScreen = !isMobile && !isTablet;

  const contractAddress = "9eF4iX4BzeKnvJ7gSw5L725jk48zJw2m66NFxHHvpump"; 

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      message.success('Contract address copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      message.error('Failed to copy address');
    }
  };

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const socialLinks = [
    {
      name: "X",
      icon: XOutlined,
      url: "https://x.com/aviestreaming",
      bgColor: "bg-gradient-to-br from-gray-600 to-slate-600",
      hoverColor: "hover:from-gray-700 hover:to-slate-700",
      borderColor: "border-gray-500/30"
    },
    {
      name: "Discord",
      icon: DiscordOutlined,
      url: "https://discord.com/invite/gpWuwPpWxp",
      bgColor: "bg-gradient-to-br from-indigo-600 to-purple-600",
      hoverColor: "hover:from-indigo-700 hover:to-purple-700",
      borderColor: "border-indigo-500/30"
    },
    {
      name: "Telegram",
      icon: SendOutlined,
      url: "https://t.me/+ADEbvu_yTFs1ZTI0",
      bgColor: "bg-gradient-to-br from-blue-600 to-cyan-600",
      hoverColor: "hover:from-blue-700 hover:to-cyan-700",
      borderColor: "border-blue-500/30"
    }
  ];

  return (
    <nav 
      className={`
        flex flex-col gap-4 h-screen 
        ${collapsed ? 'w-[70px]' : 'w-[280px]'} 
        text-md font-medium pl-6 pr-0 py-6
        bg-[var(--background)] text-[var(--text-secondary)] 
        transition-all duration-300 ease-in-out
        overflow-hidden
        relative
      `}
      style={{
        transform: 'scale(0.9)',
        transformOrigin: 'top left',
        height: 'calc(100vh + 80px)'
      }}
    >
      {/* Full height border */}
      <div 
        className="absolute top-0 right-0 w-px h-screen bg-gray-600/40"
        style={{
          transform: 'translateX(calc(100% / 0.9))',
          transformOrigin: 'top left'
        }}
      />
      
      <div className="mb-2 flex justify-between items-center min-h-[40px]">
        <div 
          className={`
            transition-opacity duration-300 ease-in-out
            ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-[120px]'}
          `}
        >
          {!collapsed && (
            <Link href={`/${lang}`}>
              <Image
                src="/icons/avie-logo.png"
                width={120}
                height={40}
                alt="Avie Logo"
              />
            </Link>
          )}
        </div>
        <div className="flex items-center flex-shrink-0">
          {/* Only show collapse button on large screens */}
          {isLargeScreen && onToggleCollapse && (
            <Button
              type="text"
              onClick={onToggleCollapse}
              className="text-white hover:bg-[var(--color-gray)]/20 rounded-lg transition-all duration-200"
              title={collapsed ? "Expand menu" : "Collapse menu"}
              style={{ fontSize: '18px' }}
            >
              {collapsed ? <MenuUnfoldOutlined style={{ fontSize: '18px' }} /> : <MenuFoldOutlined style={{ fontSize: '18px' }} />}
            </Button>
          )}
          {isMobile && (
            <Button
              type="text"
              onClick={() => {
                onClose && onClose();
              }}
              className="text-white hover:bg-[var(--color-gray)]/20 rounded-lg transition-all duration-200"
            >
              <CloseOutlined />
            </Button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="mb-0">
        <TabSwitcher collapsed={collapsed} />
      </div>

      {items.map((item, index) => (
        <div key={item.title} className="flex flex-col">
          {/* Add divider line above Clips, Categories, and Content sections */}
          {(item.title === "Clips" || item.title === "Categories" || item.title === "Content") && (
            <div className="h-px bg-gray-600/40 mb-6"></div>
          )}
          <div 
            className={`
              text-white font-semibold text-sm uppercase tracking-wider mb-4 px-2 opacity-90
              transition-opacity duration-300 ease-in-out
              ${collapsed ? 'opacity-0 h-0 mb-0' : 'opacity-100 h-auto mb-4'}
              overflow-hidden
            `}
          >
            {item.title}
          </div>
          <ul className={`flex flex-col ${collapsed ? 'items-center' : ''} gap-2 mb-0`}>
            <>{item.children}</>
          </ul>
          {index < items.length - 1 && (
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gray)]/20 to-transparent mb-0"></div>
          )}
        </div>
      ))}

      {/* Contract Address and Social Media Section */}
      <div className="mt-auto pb-2 pt-20">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gray)]/20 to-transparent mb-4"></div>
        <div 
          className={`
            text-white text-xs uppercase tracking-wider font-semibold mb-2 px-2 opacity-90
            transition-opacity duration-300 ease-in-out
            ${collapsed ? 'opacity-0 h-0 mb-0' : 'opacity-100 h-auto mb-2'}
            overflow-hidden
          `}
        >
          Avie Streaming CA:
        </div>
        <div 
          onClick={copyToClipboard}
          className={`
            cursor-pointer 
            ${collapsed ? 'p-3' : 'p-3'} 
            bg-[var(--color-primary)] 
            hover:bg-[var(--color-primary-hover)] 
            rounded-xl 
            transition-all 
            duration-300
            ease-in-out
            border 
            border-[var(--color-border)]
            hover:shadow-lg 
            hover:shadow-[var(--color-primary)]/10
            active:scale-95
            ${collapsed ? 'flex justify-center' : ''}
            overflow-hidden
            mb-3
          `}
          title={collapsed ? `Copy CA: ${contractAddress}` : "Click to copy contract address"}
        >
          {collapsed ? (
            <CopyOutlined className="text-white text-lg" />
          ) : (
            <div className="flex items-center justify-between">
              <div 
                className={`
                  text-white text-xs font-mono 
                  transition-opacity duration-300 ease-in-out
                  ${collapsed ? 'opacity-0' : 'opacity-100'}
                  overflow-hidden
                `}
              >
                {contractAddress.length > 20 ? 
                  `${contractAddress.slice(0, 6)}...${contractAddress.slice(-6)}` : 
                  contractAddress
                }
              </div>
              <CopyOutlined 
                className={`
                  text-white ml-2 opacity-70 hover:opacity-100 
                  transition-opacity duration-200
                  ${collapsed ? 'opacity-0' : 'opacity-100'}
                `} 
              />
            </div>
          )}
        </div>

        {/* Social Media Links */}
        <div>
          <div className={`flex ${collapsed ? 'flex-col' : 'flex-row'} gap-2`}>
            {socialLinks.map((social) => (
              <button
                key={social.name}
                onClick={() => handleSocialClick(social.url)}
                className={`
                  ${collapsed ? 'w-12 h-12' : 'w-12 h-12 flex-1'}
                  ${social.bgColor}
                  ${social.hoverColor}
                  border
                  ${social.borderColor}
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-white
                  transition-all
                  duration-300
                  hover:shadow-lg
                  hover:scale-105
                  active:scale-95
                `}
                title={`Follow us on ${social.name}`}
              >
                <social.icon className="text-lg" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideMenu;