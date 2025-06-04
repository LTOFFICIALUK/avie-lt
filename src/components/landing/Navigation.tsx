"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthSheet } from "../auth/AuthSheet";

const NAVIGATION_LINKS = [
  { label: "Home", href: "/" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Whitepaper", href: "/whitepaper" },
  { label: "AP Reward System", href: "/AP-reward-system" },
  { label: "Community", href: "/community" },
];

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Premium Background with Blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-black/90 to-gray-900/95 backdrop-blur-xl border-b border-purple-500/20"></div>
        
        <div className="relative z-10 w-full max-w-8xl mx-auto">
          <div className="flex items-center justify-between h-12 md:h-14 lg:h-16 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
            
            {/* Mobile: Menu Button (Left) */}
            <div className="md:hidden flex-shrink-0">
              <button 
                onClick={handleToggleMobileMenu}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-md transition-all duration-200 border border-gray-700/50 hover:border-purple-500/30"
                aria-label="Toggle menu"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Logo - Left side - Responsive sizing */}
            <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
              <div className="flex-shrink-0">
                <Link href="/" legacyBehavior>
                  <a className="block">
                    <Image
                      src="/icons/avie-logo.png"
                      alt="AVIE Platform Logo"
                      height={20}
                      width={40}
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 sm:hidden"
                    />
                    <Image
                      src="/icons/avie-logo.png"
                      alt="AVIE Platform Logo"
                      height={24}
                      width={48}
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 hidden sm:block md:hidden"
                    />
                    <Image
                      src="/icons/avie-logo.png"
                      alt="AVIE Platform Logo"
                      height={28}
                      width={56}
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 hidden md:block lg:hidden"
                    />
                    <Image
                      src="/icons/avie-logo.png"
                      alt="AVIE Platform Logo"
                      height={32}
                      width={64}
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 hidden lg:block xl:hidden"
                    />
                    <Image
                      src="/icons/avie-logo.png"
                      alt="AVIE Platform Logo"
                      height={36}
                      width={72}
                      className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 hidden xl:block"
                    />
                  </a>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation Links - Absolutely centered with responsive sizing */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-1 lg:space-x-2 xl:space-x-4 2xl:space-x-6">
              {NAVIGATION_LINKS.map((link, index) => (
                <Link key={index} href={link.href} legacyBehavior>
                  <a
                    className="relative whitespace-nowrap px-2 md:px-2.5 lg:px-3 xl:px-4 2xl:px-5 py-1 md:py-1.5 lg:py-2 text-white hover:text-white font-bold text-xs md:text-xs lg:text-sm xl:text-sm 2xl:text-base transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-blue-600/10 border border-transparent hover:border-purple-500/20 group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Button - Right side with responsive sizing */}
            <div className="hidden md:block flex-shrink-0">
              <div className="auth-button-wrapper">
                <AuthSheet />
              </div>
            </div>

            {/* Mobile: Empty space for balance */}
            <div className="md:hidden w-6 sm:w-8 flex-shrink-0"></div>
          </div>
        </div>

        {/* Enhanced Custom CSS for AuthSheet styling - Fully responsive */}
        <style jsx global>{`
          .auth-button-wrapper .ant-btn {
            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%) !important;
            border: 1px solid rgba(124, 58, 237, 0.3) !important;
            color: white !important;
            font-weight: 600 !important;
            font-size: 10px !important;
            height: 20px !important;
            padding: 0 8px !important;
            border-radius: 6px !important;
            box-shadow: 0 1px 4px rgba(124, 58, 237, 0.15) !important;
            transition: all 0.3s ease !important;
            white-space: nowrap !important;
          }
          
          /* Small mobile */
          @media (min-width: 640px) {
            .auth-button-wrapper .ant-btn {
              font-size: 11px !important;
              height: 22px !important;
              padding: 0 10px !important;
              border-radius: 7px !important;
            }
          }
          
          /* Medium screens */
          @media (min-width: 768px) {
            .auth-button-wrapper .ant-btn {
              font-size: 12px !important;
              height: 26px !important;
              padding: 0 14px !important;
              border-radius: 8px !important;
              box-shadow: 0 2px 6px rgba(124, 58, 237, 0.15) !important;
            }
          }
          
          /* Large screens */
          @media (min-width: 1024px) {
            .auth-button-wrapper .ant-btn {
              font-size: 13px !important;
              height: 28px !important;
              padding: 0 16px !important;
              border-radius: 9px !important;
              box-shadow: 0 2px 8px rgba(124, 58, 237, 0.2) !important;
            }
          }
          
          /* Extra large screens */
          @media (min-width: 1280px) {
            .auth-button-wrapper .ant-btn {
              font-size: 14px !important;
              height: 32px !important;
              padding: 0 18px !important;
              border-radius: 10px !important;
            }
          }
          
          /* 2XL screens */
          @media (min-width: 1536px) {
            .auth-button-wrapper .ant-btn {
              font-size: 15px !important;
              height: 34px !important;
              padding: 0 20px !important;
            }
          }
          
          .auth-button-wrapper .ant-btn:hover {
            background: linear-gradient(135deg, #8b5cf6 0%, #60a5fa 100%) !important;
            border-color: rgba(139, 92, 246, 0.5) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25) !important;
          }
          
          @media (min-width: 1024px) {
            .auth-button-wrapper .ant-btn:hover {
              transform: translateY(-2px) !important;
              box-shadow: 0 6px 15px rgba(124, 58, 237, 0.3) !important;
            }
          }
          
          .auth-button-wrapper .ant-btn:active {
            transform: translateY(0) !important;
            box-shadow: 0 1px 4px rgba(124, 58, 237, 0.15) !important;
          }

          /* Mobile Menu Button in Menu */
          .mobile-auth-wrapper .ant-btn {
            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%) !important;
            border: 1px solid rgba(124, 58, 237, 0.3) !important;
            color: white !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            height: 32px !important;
            width: 100% !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.15) !important;
            transition: all 0.3s ease !important;
            white-space: nowrap !important;
          }
          
          .mobile-auth-wrapper .ant-btn:hover {
            background: linear-gradient(135deg, #8b5cf6 0%, #60a5fa 100%) !important;
            border-color: rgba(139, 92, 246, 0.5) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25) !important;
          }
        `}</style>
      </nav>

      {/* Mobile Menu Overlay - Only shows on mobile */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={handleCloseMobileMenu}
          ></div>
          
          {/* Mobile Menu - Scaled down */}
          <div className="fixed top-12 left-0 right-0 z-50 md:hidden">
            <div className="bg-gradient-to-b from-gray-900/98 to-black/95 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl mx-3 rounded-b-xl">
              <div className="px-4 py-4 space-y-2">
                {/* Navigation Links */}
                {NAVIGATION_LINKS.map((link, index) => (
                  <Link key={index} href={link.href} legacyBehavior>
                    <a
                      onClick={handleCloseMobileMenu}
                      className="block px-4 py-2.5 text-gray-300 hover:text-white font-medium text-sm transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-blue-600/10 border border-transparent hover:border-purple-500/20"
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
                
                {/* Divider */}
                <div className="border-t border-gray-700/50 my-3"></div>
                
                {/* Auth Button in Mobile Menu */}
                <div className="mobile-auth-wrapper">
                  <AuthSheet />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export { Navigation }; 