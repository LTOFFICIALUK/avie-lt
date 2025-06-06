import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="pb-8 sm:pb-12 lg:pb-16">
      {children}
    </div>
  );
};

export default DashboardLayout; 