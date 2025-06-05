"use client";
import React from "react";
import { Button } from "antd";
import {
  TeamOutlined,
  SendOutlined,
  XOutlined,
  UserOutlined,
  HeartOutlined,
  DiscordOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  FileTextOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";

// Community Graphics Component
const CommunityGraphics = () => {
  return (
    <div className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto mt-8 sm:mt-12 lg:mt-16">
      {/* Central Community Hub */}
      <div className="relative flex items-center justify-center">
        {/* Main Central Circle */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border border-purple-400/30 relative z-10">
          <TeamOutlined className="text-2xl sm:text-3xl lg:text-4xl text-white" />
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 animate-ping opacity-20"></div>
        </div>

        {/* Floating Social Platform Icons */}
        {/* Discord */}
        <div className="absolute -top-6 left-8 sm:-top-8 sm:left-12 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-400/30 flex items-center justify-center animate-bounce">
          <DiscordOutlined className="text-indigo-400 text-base sm:text-lg lg:text-xl" />
        </div>

        {/* Telegram */}
        <div className="absolute top-6 -right-12 sm:top-8 sm:-right-16 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-400/30 flex items-center justify-center">
          <SendOutlined className="text-blue-400 text-base sm:text-lg lg:text-xl" />
        </div>

        {/* X Platform */}
        <div className="absolute -bottom-4 -left-8 sm:-bottom-6 sm:-left-12 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-full border border-gray-400/30 flex items-center justify-center animate-pulse">
          <XOutlined className="text-gray-400 text-base sm:text-lg lg:text-xl" />
        </div>

        {/* Founder X */}
        <div className="absolute bottom-8 right-6 sm:bottom-12 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full border border-amber-400/30 flex items-center justify-center">
          <XOutlined className="text-amber-400 text-base sm:text-lg lg:text-xl" />
        </div>

        {/* Community Members */}
        <div className="absolute -top-8 -right-6 sm:-top-12 sm:-right-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 flex items-center justify-center animate-bounce">
          <UserOutlined className="text-green-400 text-sm sm:text-base lg:text-lg" />
        </div>

        {/* Community Heart */}
        <div className="absolute -bottom-6 right-12 sm:-bottom-8 sm:right-16 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full border border-pink-400/30 flex items-center justify-center">
          <HeartOutlined className="text-pink-400 text-sm sm:text-base lg:text-lg" />
        </div>

        {/* Active Status */}
        <div className="absolute top-12 left-12 sm:top-16 sm:left-16 w-12 h-6 sm:w-14 sm:h-7 lg:w-16 lg:h-8 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full border border-green-400/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
          <span className="text-green-400 text-xs font-bold">LIVE</span>
        </div>
      </div>

      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
        <defs>
          <linearGradient id="communityLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Connection lines from center to floating elements */}
        <line x1="50%" y1="50%" x2="30%" y2="25%" stroke="url(#communityLineGradient)" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="50%" y1="50%" x2="75%" y2="35%" stroke="url(#communityLineGradient)" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="url(#communityLineGradient)" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="url(#communityLineGradient)" strokeWidth="1" strokeDasharray="4,4" />
      </svg>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent rounded-full blur-3xl"></div>
    </div>
  );
};

interface ButtonConfig {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface CommunityHeroProps {
  className?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  title?: string;
  description?: string;
  button1?: ButtonConfig;
  button2?: ButtonConfig;
  showGraphics?: boolean;
}

const CommunityHero: React.FC<CommunityHeroProps> = ({ 
  className = "",
  badgeText = "Join AVIE Community Members",
  badgeIcon = <TeamOutlined className="mr-2 text-white" />,
  title = "Connect. Share. Grow.",
  description = "Join the vibrant AVIE community across multiple platforms. Connect with creators, viewers, and blockchain enthusiasts from around the world.",
  button1,
  button2,
  showGraphics = true
}) => {
  const defaultButton1 = {
    text: "Join Discord",
    icon: <DiscordOutlined />,
    onClick: () => window.open("https://discord.gg/gpWuwPpWxp", '_blank', 'noopener,noreferrer'),
    variant: 'primary' as const
  };

  const defaultButton2 = {
    text: "Join Telegram", 
    icon: <SendOutlined />,
    onClick: () => window.open("https://t.me/+ADEbvu_yTFs1ZTI0", '_blank', 'noopener,noreferrer'),
    variant: 'secondary' as const
  };

  const finalButton1 = button1 || defaultButton1;
  const finalButton2 = button2 || defaultButton2;

  return (
    <section className={`relative min-h-[45vh] lg:min-h-[55vh] xl:min-h-[65vh] 2xl:min-h-[75vh] flex items-center justify-center px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12 xl:py-16 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <div className="mb-1.5 sm:mb-2 lg:mb-3">
          <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-xs font-medium text-purple-300">
            {badgeIcon}
            {badgeText}
          </span>
        </div>
        
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-1.5 sm:mb-2 lg:mb-3 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        
        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 mb-2.5 sm:mb-3 lg:mb-4 max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto leading-snug px-1 sm:px-2 lg:px-4">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 lg:gap-3 justify-center items-center mb-3 sm:mb-4 lg:mb-6">
          <button
            onClick={finalButton1.onClick}
            className={`inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 rounded-lg font-semibold text-xs sm:text-sm lg:text-base xl:text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto ${
              finalButton1.variant === 'primary' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-8 sm:h-9 lg:h-10 xl:h-11 2xl:h-12'
                : 'border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 h-8 sm:h-9 lg:h-10 xl:h-11 2xl:h-12'
            }`}
          >
            {finalButton1.icon}
            <span className="ml-1.5 sm:ml-2">{finalButton1.text}</span>
          </button>
          <button
            onClick={finalButton2.onClick}
            className={`inline-flex items-center justify-center px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 rounded-lg font-semibold text-xs sm:text-sm lg:text-base xl:text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto ${
              finalButton2.variant === 'primary' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-8 sm:h-9 lg:h-10 xl:h-11 2xl:h-12'
                : 'border border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 h-8 sm:h-9 lg:h-10 xl:h-11 2xl:h-12'
            }`}
          >
            {finalButton2.icon}
            <span className="ml-1.5 sm:ml-2">{finalButton2.text}</span>
          </button>
        </div>

        {/* Community Graphics - Only on very large screens */}
        {showGraphics && (
          <div className="hidden 2xl:block mt-6 2xl:mt-8">
            <CommunityGraphics />
          </div>
        )}
        
        {/* Minimal graphics for sm and up (hidden on mobile) */}
        {showGraphics && (
          <div className="hidden sm:block 2xl:hidden mt-2 sm:mt-3 lg:mt-4">
            <div className="relative w-full max-w-xs mx-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg border border-purple-400/30 relative mx-auto">
                <TeamOutlined className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 animate-ping opacity-20"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export { CommunityHero }; 