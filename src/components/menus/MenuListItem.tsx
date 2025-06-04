"use client";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { Tooltip } from "antd";

interface Props {
  href: string;
  label: string;
  active: boolean;
  icon: React.ForwardRefExoticComponent<
    Omit<AntdIconProps, "ref"> & React.RefAttributes<HTMLSpanElement>
  >;
  collapsed?: boolean;
  badge?: string;
}

const MenuListItem = ({ href, label, active, icon: Icon, collapsed = false, badge }: Props) => {
  const params = useParams();
  const locale = params?.lang as string;

  const content = (
    <Link
      className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4'} ${
        active ? "!text-[var(--color-gray)]" : "!hover:text-white !text-white"
      } w-full h-full overflow-hidden relative`}
      href={`/${locale}${href}`}
    >
      <div className={`flex items-center justify-center flex-shrink-0 ${collapsed ? 'w-5 h-5' : 'w-5 h-5'}`}>
        <Icon style={{ fontSize: collapsed ? '18px' : '18px' }} />
      </div>
      <p 
        className={`
          font-medium text-sm whitespace-nowrap
          transition-opacity duration-300 ease-in-out
          ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
          ${badge && !collapsed ? 'pr-20' : ''}
          overflow-hidden
        `}
      >
        {label}
      </p>
      
      {/* Badge/Pill Overlay */}
      {badge && !collapsed && (
        <span 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs font-semibold rounded-full text-black whitespace-nowrap shadow-sm border border-opacity-20"
          style={{
            backgroundColor: 'var(--color-brand)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            fontSize: '9px',
            lineHeight: '1.2',
            letterSpacing: '0.025em',
            textTransform: 'uppercase' as const,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <li
      className={`
        rounded-xl 
        ${collapsed ? 'py-3 px-2 w-12 mx-auto' : 'py-3.5 px-4'} 
        transition-all
        duration-300
        ease-in-out
        ${
          active
            ? "bg-[var(--color-brand)] text-[var(--color-gray)] shadow-lg shadow-[var(--color-brand)]/20 border border-[var(--color-brand)]/30"
            : "hover:bg-[var(--color-gray)]/80 hover:text-white text-[var(--text-secondary)] hover:shadow-md hover:shadow-black/10 border border-transparent hover:border-[var(--color-gray)]/20"
        }
        backdrop-blur-sm
        overflow-hidden
        relative
      `}
    >
      {collapsed ? (
        <Tooltip title={badge ? `${label} (${badge})` : label} placement="right">
          {content}
        </Tooltip>
      ) : (
        content
      )}
    </li>
  );
};

export default MenuListItem;
