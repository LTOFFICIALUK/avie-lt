import React from "react";
import {
  TrophyOutlined,
  DollarOutlined,
  EyeOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  TeamOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const APGraphics = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-blue-600/5 to-transparent rounded-full blur-3xl scale-150"></div>
      
      {/* Central AP Hub */}
      <div className="relative flex items-center justify-center h-80">
        {/* Main Central Circle with Enhanced Effects */}
        <div className="relative z-20">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border border-purple-400/50 relative">
            <TrophyOutlined className="text-4xl text-white drop-shadow-lg" />
            
            {/* Multiple Pulse Animations */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 animate-pulse opacity-30"></div>
            
            {/* Outer Ring */}
            <div className="absolute -inset-2 rounded-full border border-purple-400/30 animate-spin" style={{animationDuration: '8s'}}></div>
          </div>
        </div>

        {/* Floating Activity Icons with Enhanced Positioning */}
        {/* Viewing Icon */}
        <div className="absolute -top-8 left-12 w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full border border-blue-400/50 flex items-center justify-center animate-bounce backdrop-blur-sm shadow-lg">
          <EyeOutlined className="text-blue-400 text-xl drop-shadow-md" />
          <div className="absolute inset-0 rounded-full bg-blue-400/10 animate-pulse"></div>
        </div>

        {/* Streaming Icon */}
        <div className="absolute top-8 -right-16 w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full border border-purple-400/50 flex items-center justify-center backdrop-blur-sm shadow-lg">
          <PlayCircleOutlined className="text-purple-400 text-xl drop-shadow-md" />
          <div className="absolute inset-0 rounded-full bg-purple-400/10 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Chat Icon */}
        <div className="absolute -bottom-6 -left-12 w-16 h-16 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full border border-green-400/50 flex items-center justify-center animate-pulse backdrop-blur-sm shadow-lg">
          <MessageOutlined className="text-green-400 text-xl drop-shadow-md" />
          <div className="absolute inset-0 rounded-full bg-green-400/10 animate-ping opacity-50"></div>
        </div>

        {/* Rewards Icon */}
        <div className="absolute bottom-12 right-8 w-16 h-16 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full border border-yellow-400/50 flex items-center justify-center backdrop-blur-sm shadow-lg">
          <GiftOutlined className="text-yellow-400 text-xl drop-shadow-md" />
          <div className="absolute inset-0 rounded-full bg-yellow-400/10 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* SOL Token Icon */}
        <div className="absolute -top-12 -right-8 w-14 h-14 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full border border-green-400/50 flex items-center justify-center animate-bounce backdrop-blur-sm shadow-lg">
          <DollarOutlined className="text-green-400 text-lg drop-shadow-md" />
          <div className="absolute inset-0 rounded-full bg-green-400/10 animate-pulse" style={{animationDelay: '0.3s'}}></div>
        </div>

        {/* Community Icon */}
        <div className="absolute -bottom-8 right-16 w-14 h-14 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full border border-indigo-400/50 flex items-center justify-center backdrop-blur-sm shadow-lg">
          <TeamOutlined className="text-indigo-400 text-lg drop-shadow-md" />
          <div className="absolute inset-0 rounded-full bg-indigo-400/10 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Enhanced LIVE Indicator */}
        <div className="absolute top-16 left-16 w-16 h-8 bg-gradient-to-r from-green-500/40 to-emerald-500/40 rounded-full border border-green-400/60 flex items-center justify-center backdrop-blur-sm shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse shadow-sm"></div>
          <span className="text-green-400 text-xs font-bold drop-shadow-sm">LIVE</span>
          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping"></div>
        </div>
      </div>

      {/* Enhanced Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 10}}>
        <defs>
          <linearGradient id="apLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.2" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection lines from center to floating elements with glow effect */}
        <line x1="50%" y1="50%" x2="30%" y2="25%" stroke="url(#apLineGradient)" strokeWidth="2" strokeDasharray="6,4" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="50%" x2="75%" y2="35%" stroke="url(#apLineGradient)" strokeWidth="2" strokeDasharray="6,4" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2.5s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="url(#apLineGradient)" strokeWidth="2" strokeDasharray="6,4" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="url(#apLineGradient)" strokeWidth="2" strokeDasharray="6,4" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2.2s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="50%" x2="75%" y2="20%" stroke="url(#apLineGradient)" strokeWidth="2" strokeDasharray="6,4" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2.8s" repeatCount="indefinite" />
        </line>
        <line x1="50%" y1="50%" x2="75%" y2="85%" stroke="url(#apLineGradient)" strokeWidth="2" strokeDasharray="6,4" filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" values="0;10" dur="2.3s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Additional Atmospheric Effects */}
      <div className="absolute top-10 left-20 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-10 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-20 right-10 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
      <div className="absolute bottom-10 right-20 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
    </div>
  );
};

export default APGraphics;