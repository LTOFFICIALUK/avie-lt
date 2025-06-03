'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  SettingOutlined, 
  UserOutlined, 
  DashboardOutlined,
  BarChartOutlined,
  TeamOutlined,
  StopOutlined,
  MenuOutlined,
  FlagOutlined
} from '@ant-design/icons';
import Image from 'next/image';
import { Button } from 'antd';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/en/admin',
      icon: <DashboardOutlined />,
      active: pathname === '/en/admin'
    },
    {
      label: 'Moderation',
      href: '/en/admin/moderation',
      icon: <StopOutlined />,
      active: pathname?.includes('/en/admin/moderation')
    },
    {
      label: 'Reports',
      href: '/en/admin/reports',
      icon: <FlagOutlined />,
      active: pathname?.includes('/en/admin/reports')
    },
    {
      label: 'Users',
      href: '/en/admin/users',
      icon: <TeamOutlined />,
      active: pathname?.includes('/en/admin/users')
    },
    {
      label: 'Analytics',
      href: '/en/admin/analytics',
      icon: <BarChartOutlined />,
      active: pathname?.includes('/en/admin/analytics')
    },
    {
      label: 'Settings',
      href: '/en/admin/settings',
      icon: <SettingOutlined />,
      active: pathname?.includes('/en/admin/settings')
    }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          icon={<MenuOutlined />} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[var(--color-gray)]"
        />
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 
          fixed top-0 left-0 z-40 h-full w-64 
          bg-[var(--background)] border-r border-[var(--color-gray)]
          transition-transform duration-300 ease-in-out lg:sticky
        `}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Logo */}
          <div className="p-4 border-b border-[var(--color-gray)]">
            <Link href="/">
              <Image
                src="/icons/avie-logo.png"
                width={100}
                height={40}
                alt="Avie Logo"
              />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-md text-sm
                      ${item.active 
                        ? 'bg-[var(--color-gray)] text-white' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--color-gray)] hover:text-white'
                      }
                      transition-colors
                    `}
                  >
                    <span className="text-[var(--color-brand)]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-[var(--color-gray)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-gray)] flex items-center justify-center">
                <UserOutlined className="text-[var(--color-brand)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin Panel</p>
                <p className="text-xs text-[var(--text-secondary)]">Moderation Tools</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6">
        {children}
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout; 