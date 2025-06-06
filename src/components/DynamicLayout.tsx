"use client";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import DynamicSideMenu from "./menus/DynamicSideMenu";
import { TopNavigation } from "./TopNavigation";
import BreadcrumbsNav from "./BreadcrumbsNav";
import { ToastProvider } from "@/providers/ToastProvider";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";

const DynamicLayout = ({ children }: any) => {
  const pathname = usePathname();
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Auto-collapse on desktop, but not needed on mobile as we'll use overlay there
  useEffect(() => {
    if (!isMobile) {
      setIsCollapsed(false); // Start expanded on desktop
    }
  }, [isMobile]);
  
  // Check if we're on a stream page, landing page, dashboard page, or main navigation pages
  const isStreamPage = pathname.includes("/streams/");
  const isLandingPage = pathname.includes("/landing");
  const isDashboardPage = pathname.includes("/dashboard");
  const isMainNavPage = pathname.includes("/trending") || pathname.includes("/following") || pathname.includes("/previously-watched");

  const toggleSidebarOpened = () => {
    setIsSidebarOpened(!isSidebarOpened);
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isLandingPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <div className="flex overflow-hidden max-w-[100vw] w-full">
        {/* Mobile sidebar as overlay */}
        {isMobile && (
          <>
            <AnimatePresence>
              {isSidebarOpened && (
                <motion.div 
                  className="fixed inset-0 bg-black/70 z-[350]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpened(false)}
                />
              )}
            </AnimatePresence>
            <DynamicSideMenu
              opened={isSidebarOpened}
              isMobile={true}
              collapsed={false} // Never collapsed on mobile
              onToggleCollapse={toggleCollapsed}
              onClose={() => {
                toggleSidebarOpened();
              }}
            />
          </>
        )}

        {/* Desktop sidebar */}
        {!isMobile && (
          <DynamicSideMenu 
            opened={true} 
            isMobile={false}
            collapsed={isCollapsed}
            onToggleCollapse={toggleCollapsed}
          />
        )}
        
        <div className="flex-1 overflow-hidden">
          <TopNavigation
            onOpenSidebar={() => {
              toggleSidebarOpened();
            }}
          />
          <main className={`flex flex-col gap-12 ${isStreamPage ? '' : 'sm:max-w-[1300px]'} mx-auto sm:px-4 ${isStreamPage ? 'lg:p-0' : ''} max-w-full overflow-hidden`}>
            {!isStreamPage && !isDashboardPage && !isMainNavPage && <BreadcrumbsNav />}
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default DynamicLayout;