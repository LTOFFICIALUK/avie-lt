"use client";
import { usePathname } from "next/navigation";
import React from "react";
import CreatorMenu from "./CreatorSideMenu";
import ViewerMenu from "./ViewerSideMenu";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onClose?: () => void;
  isMobile?: boolean;
  opened?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const DynamicSideMenu = ({
  onClose,
  isMobile = false,
  opened = true,
  collapsed = false,
  onToggleCollapse,
}: Props) => {
  const pathname = usePathname();

  const shouldShowMenu = !pathname.includes("/landing");

  return (
    <AnimatePresence>
      {shouldShowMenu && opened && (
        <motion.div
          key="side-menu"
          style={{ 
            borderRight: "1px solid var(--color-gray)",
            boxShadow: isMobile ? "0 0 10px rgba(0,0,0,0.5)" : "none",
            zIndex: isMobile ? 1000 : 1
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
          className={
            isMobile 
              ? "fixed inset-y-0 left-0 z-[400]" 
              : ""
          }
        >
          {pathname.includes("/dashboard") ? (
            <CreatorMenu
              onClose={() => {
                onClose && onClose();
              }}
              collapsed={collapsed}
              onToggleCollapse={onToggleCollapse}
            />
          ) : (
            <ViewerMenu
              onClose={() => {
                onClose && onClose();
              }}
              collapsed={collapsed}
              onToggleCollapse={onToggleCollapse}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DynamicSideMenu;