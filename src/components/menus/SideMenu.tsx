"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, message } from "antd";
import { CloseOutlined, MenuUnfoldOutlined, MenuFoldOutlined, CopyOutlined } from "@ant-design/icons";
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

  return (
    <nav 
      className={`
        flex flex-col gap-6 h-screen 
        ${collapsed ? 'w-[70px]' : 'w-[280px]'} 
        text-md font-medium p-5 pt-8 
        bg-[var(--background)] text-[var(--text-secondary)] 
        transition-all duration-300 ease-in-out
        overflow-hidden
        relative
      `}
      style={{
        transform: 'scale(0.9)',
        transformOrigin: 'top left'
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

      {/* Contract Address Section */}
      <div className="mt-auto mb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gray)]/20 to-transparent mb-6"></div>
        <div 
          className={`
            text-white text-xs uppercase tracking-wider font-semibold mb-3 px-2 opacity-90
            transition-opacity duration-300 ease-in-out
            ${collapsed ? 'opacity-0 h-0 mb-0' : 'opacity-100 h-auto mb-3'}
            overflow-hidden
          `}
        >
          Avie Streaming CA:
        </div>
        <div 
          onClick={copyToClipboard}
          className={`
            cursor-pointer 
            ${collapsed ? 'p-3' : 'p-4'} 
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
      </div>
    </nav>
  );
};

export default SideMenu;