"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";

interface Props {
  children: React.ReactNode;
  navigation: { name: string; href: string }[];
}

const TabSubmenu = ({ children, navigation }: Props) => {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Check if screen is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile(); // Initial check
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);
  
  // Extract the last part of the URL for comparison
  const getLastPathSegment = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    return segments[segments.length - 1];
  };
  
  const currentPathSegment = getLastPathSegment(pathname);
  
  // Find the current active tab
  const activeTab = navigation.find(
    item => getLastPathSegment(item.href) === currentPathSegment
  );

  // Handle dropdown menu click
  const handleMenuClick = () => {
    setDropdownOpen(false);
  };

  // Dropdown menu for mobile
  const dropdownMenu = (
    <Menu>
      {navigation.map((item) => {
        const itemPathSegment = getLastPathSegment(item.href);
        const isActive = currentPathSegment === itemPathSegment;
        
        return (
          <Menu.Item 
            key={item.name}
            className={isActive ? 'bg-gray-800 text-[var(--color-brand)]' : ''}
          >
            <Link href={item.href}>{item.name}</Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <div>
      {/* Navigation */}
      <div className="border-b border-[var(--color-gray)]">
        {/* Mobile dropdown navigation */}
        <div className="md:hidden p-2">
          <Dropdown 
            overlay={dropdownMenu} 
            open={dropdownOpen}
            onOpenChange={(open) => setDropdownOpen(open)}
            trigger={['click']}
          >
            <Button 
              className="w-full flex justify-between items-center bg-gray-800 border-gray-700" 
              onClick={(e) => e.preventDefault()}
            >
              <span>{activeTab?.name || "Navigation"}</span>
              {dropdownOpen ? <UpOutlined /> : <DownOutlined />}
            </Button>
          </Dropdown>
        </div>
        
        {/* Desktop tabs navigation */}
        <nav className="hidden md:block mx-auto overflow-x-auto">
          <div className="flex items-center gap-6 min-w-max py-1" ref={tabsRef}>
            {navigation.map((item) => {
              const itemPathSegment = getLastPathSegment(item.href);
              const isActive = currentPathSegment === itemPathSegment;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-1 py-2.5 text-base font-medium transition-colors relative whitespace-nowrap",
                    isActive
                      ? "text-[var(--color-brand)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[var(--color-brand)]"
                      : "text-white !hover:text-white"
                  )}
                  style={{ 
                    color: isActive ? 'var(--color-brand)' : 'white'
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Content */}
      <main className="mx-auto px-4 py-6 h-full">{children}</main>
    </div>
  );
};

export default TabSubmenu;
