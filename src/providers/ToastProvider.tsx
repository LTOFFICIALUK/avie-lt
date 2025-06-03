"use client";

import React, { createContext, useContext, useMemo } from "react";
import { message, notification, App } from "antd";
import { CheckCircleFilled, InfoCircleFilled, CloseCircleFilled, WarningFilled } from '@ant-design/icons';
import type { IconType } from 'antd/es/notification/interface';

// Define the toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Define the toast position based on screen size
type ToastPosition = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';

interface ToastOptions {
  duration?: number;
  position?: ToastPosition;
  onClick?: () => void;
  onClose?: () => void;
}

interface ToastContextType {
  // Toast notifications (larger, more detailed)
  success: (content: React.ReactNode, title?: string, options?: ToastOptions) => void;
  error: (content: React.ReactNode, title?: string, options?: ToastOptions) => void;
  info: (content: React.ReactNode, title?: string, options?: ToastOptions) => void;
  warning: (content: React.ReactNode, title?: string, options?: ToastOptions) => void;
  
  // Simple message toasts (smaller, less intrusive)
  message: {
    success: (content: React.ReactNode, duration?: number) => void;
    error: (content: React.ReactNode, duration?: number) => void;
    info: (content: React.ReactNode, duration?: number) => void;
    warning: (content: React.ReactNode, duration?: number) => void;
    loading: (content: React.ReactNode, duration?: number) => void;
  };
  
  // Close all toasts
  closeAll: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Get responsive position based on screen width
const getResponsivePosition = (position?: ToastPosition): ToastPosition => {
  // On client side, check window width
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    
    // Default positions based on screen size
    if (!position) {
      // Mobile - bottom center
      if (width < 640) return 'bottom';
      // Tablet - bottom right
      if (width < 1024) return 'bottomRight';
      // Desktop - bottom right
      return 'bottomRight';
    }
  }
  
  // Return the specified position or default to bottomRight
  return position || 'bottomRight';
};

// Get icon based on toast type
const getIconForType = (type: ToastType): React.ReactNode => {
  switch (type) {
    case 'success':
      return <CheckCircleFilled style={{ color: 'var(--color-brand)' }} />;
    case 'error':
      return <CloseCircleFilled style={{ color: '#ff4d4f' }} />;
    case 'warning':
      return <WarningFilled style={{ color: '#faad14' }} />;
    case 'info':
    default:
      return <InfoCircleFilled style={{ color: 'var(--color-accent)' }} />;
  }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  // Create toast methods
  const toastMethods = useMemo(() => {
    // Create a method for each toast type
    const createToast = (type: ToastType) => {
      return (content: React.ReactNode, title?: string, options?: ToastOptions) => {
        const position = getResponsivePosition(options?.position);
        const icon = getIconForType(type) as IconType;
        
        notification[type]({
          message: title || type.charAt(0).toUpperCase() + type.slice(1),
          description: content,
          placement: position,
          duration: options?.duration || 4.5,
          icon,
          onClick: options?.onClick,
          onClose: options?.onClose,
          style: {
            borderRadius: '8px',
            boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            backgroundColor: 'var(--color-gray)',
          }
        });
      };
    };
    
    // Create message methods
    const messageToast = {
      success: (content: React.ReactNode, duration?: number) => {
        message.success({
          content,
          duration: duration || 3,
          icon: <CheckCircleFilled style={{ color: 'var(--color-brand)' }} />
        });
      },
      error: (content: React.ReactNode, duration?: number) => {
        message.error({
          content,
          duration: duration || 3,
          icon: <CloseCircleFilled style={{ color: '#ff4d4f' }} />
        });
      },
      info: (content: React.ReactNode, duration?: number) => {
        message.info({
          content,
          duration: duration || 3,
          icon: <InfoCircleFilled style={{ color: 'var(--color-accent)' }} />
        });
      },
      warning: (content: React.ReactNode, duration?: number) => {
        message.warning({
          content,
          duration: duration || 3,
          icon: <WarningFilled style={{ color: '#faad14' }} />
        });
      },
      loading: (content: React.ReactNode, duration?: number) => {
        message.loading({
          content,
          duration: duration || 3
        });
      }
    };
    
    return {
      success: createToast('success'),
      error: createToast('error'),
      info: createToast('info'),
      warning: createToast('warning'),
      message: messageToast,
      closeAll: () => {
        notification.destroy();
        message.destroy();
      }
    };
  }, []);

  return (
    <App>
      <ToastContext.Provider value={toastMethods}>
        {children}
      </ToastContext.Provider>
    </App>
  );
}

// Custom hook for using the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
}; 