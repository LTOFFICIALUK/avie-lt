"use client";
import React, { useState, useRef } from "react";
import { Navigation } from "../../components/landing/Navigation";
import { Footer } from "../../components/footer/Footer";
import { Button, Progress, Tag, Modal, Tabs, Typography } from "antd";
import Link from "next/link";
import Image from "next/image";
import {
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  DollarOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  StarOutlined,
  SettingOutlined,
  TeamOutlined,
  EyeOutlined,
  GiftOutlined,
  MessageOutlined,
  ApiOutlined,
  CrownOutlined,
  SafetyOutlined,
  BulbOutlined,
  BarChartOutlined,
  VideoCameraOutlined,
  CommentOutlined,
  LockOutlined,
  AppstoreAddOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
  FireOutlined,
  CloseOutlined,
  MailOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { AuthSheet } from "../../components/auth/AuthSheet";
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register";
import FormVerify2FA from "../../components/auth/FormVerify2FA";
import PasswordReset from "../../components/auth/PasswordReset";

interface RoadmapFeature {
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  icon: any;
  priority: 'high' | 'medium' | 'low';
}

interface RoadmapPhase {
  phase: number;
  title: string;
  subtitle: string;
  timeframe: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  features: RoadmapFeature[];
  bgGradient: string;
  borderColor: string;
  accentColor: string;
}

const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 1,
    title: "AVIE Launch",
    subtitle: "Foundation & Core Features",
    timeframe: "May 2025",
    description: "Launch of the core AVIE platform with essential streaming features, earnings system, and community tools.",
    status: 'completed',
    progress: 100,
    bgGradient: "from-green-900/20 to-emerald-900/20",
    borderColor: "border-green-500/30",
    accentColor: "text-green-400",
    features: [
      {
        name: "Live Streaming & Chat",
        description: "Real-time streaming with interactive chat functionality and viewer engagement tools",
        status: 'completed',
        icon: VideoCameraOutlined,
        priority: 'high'
      },
      {
        name: "Donations",
        description: "Seamless $SOL donation system allowing viewers to support their favorite creators",
        status: 'completed',
        icon: DollarOutlined,
        priority: 'high'
      },
      {
        name: "MultiStream",
        description: "Stream to multiple platforms simultaneously to maximize reach and earnings",
        status: 'completed',
        icon: PlayCircleOutlined,
        priority: 'medium'
      },
      {
        name: "Clipping Tools",
        description: "Use our enhanced clipping tools to create engaging content for your audience and social media pages",
        status: 'completed',
        icon: FireOutlined,
        priority: 'medium'
      },
      {
        name: "Creator & Viewer Earnings",
        description: "Dual earning system where both streamers and viewers earn $SOL tokens",
        status: 'completed',
        icon: StarOutlined,
        priority: 'high'
      },
      {
        name: "AP Rewards System",
        description: "Activity Point rewards system for platform engagement and loyalty",
        status: 'completed',
        icon: TrophyOutlined,
        priority: 'high'
      }
    ]
  },
  {
    phase: 2,
    title: "Major Update",
    subtitle: "Enhanced UX & Advanced Features",
    timeframe: "Jun - Sep 2025",
    description: "Comprehensive platform upgrades focusing on user experience, advanced analytics, and improved engagement tools.",
    status: 'in-progress',
    progress: 65,
    bgGradient: "from-blue-900/20 to-purple-900/20",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-400",
    features: [
      {
        name: "Platform UX Design Upgrade",
        description: "Complete redesign of user interface with modern, intuitive design patterns",
        status: 'in-progress',
        icon: SettingOutlined,
        priority: 'high'
      },
      {
        name: "Character Generator",
        description: "AI-powered avatar and character creation tools for enhanced community building",
        status: 'completed',
        icon: BulbOutlined,
        priority: 'medium'
      },
      {
        name: "Advanced Analytics & AI Integration",
        description: "Comprehensive analytics dashboard with AI-powered insights and recommendations",
        status: 'in-progress',
        icon: BarChartOutlined,
        priority: 'high'
      },
      {
        name: "Improved Chat & Clipping Features",
        description: "Enhanced chat moderation, reactions, and automatic highlight clipping",
        status: 'in-progress',
        icon: CommentOutlined,
        priority: 'medium'
      },
      {
        name: "Governance Participation",
        description: "Community voting and governance participation using $AVIE tokens",
        status: 'planned',
        icon: TeamOutlined,
        priority: 'medium'
      },
      {
        name: "Improved Algorithms",
        description: "Enhanced content discovery and recommendation algorithms",
        status: 'planned',
        icon: ThunderboltOutlined,
        priority: 'high'
      }
    ]
  },
  {
    phase: 3,
    title: "Development",
    subtitle: "Advanced Tools & Ecosystem",
    timeframe: "Sep - Dec 2025",
    description: "Advanced creator tools, tokenization features, and comprehensive API ecosystem for developers and third-party integrations.",
    status: 'planned',
    progress: 15,
    bgGradient: "from-purple-900/20 to-pink-900/20",
    borderColor: "border-purple-500/30",
    accentColor: "text-purple-400",
    features: [
      {
        name: "AI Chat Moderation Tools",
        description: "Advanced AI-powered chat moderation with customizable filters and auto-moderation",
        status: 'planned',
        icon: SafetyOutlined,
        priority: 'high'
      },
      {
        name: "Creator Token Launchpad & Ecosystem",
        description: "Platform for creators to launch their own tokens and build sub-communities",
        status: 'planned',
        icon: CrownOutlined,
        priority: 'high'
      },
      {
        name: "Token Gated Features",
        description: "Exclusive content and features accessible only to token holders",
        status: 'planned',
        icon: LockOutlined,
        priority: 'medium'
      },
      {
        name: "Content Ecosystem & AI Auto Clipping Tools",
        description: "AI-powered content creation tools and automatic highlight generation",
        status: 'planned',
        icon: FireOutlined,
        priority: 'medium'
      },
      {
        name: "Subscription Models & Tiered Benefits",
        description: "Flexible subscription tiers with exclusive perks and benefits",
        status: 'planned',
        icon: UsergroupAddOutlined,
        priority: 'medium'
      },
      {
        name: "API Integration for Developers",
        description: "Comprehensive API suite for third-party developers and integrations",
        status: 'planned',
        icon: ApiOutlined,
        priority: 'low'
      }
    ]
  }
];

const STATUS_CONFIG = {
  completed: {
    color: 'success',
    icon: CheckCircleOutlined,
    text: 'Completed',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30'
  },
  'in-progress': {
    color: 'processing',
    icon: ClockCircleOutlined,
    text: 'In Progress',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30'
  },
  planned: {
    color: 'default',
    icon: CalendarOutlined,
    text: 'Planned',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500/30'
  }
};

const PRIORITY_CONFIG = {
  high: { color: 'red', text: 'High Priority' },
  medium: { color: 'orange', text: 'Medium Priority' },
  low: { color: 'blue', text: 'Low Priority' }
};

// Hero Graphics Component
const HeroGraphics = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-20">
      {/* Central Streaming Hub */}
      <div className="relative flex items-center justify-center">
        {/* Main Central Circle */}
        <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border border-purple-400/30 relative z-10">
          <VideoCameraOutlined className="text-4xl text-white" />
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 animate-ping opacity-20"></div>
        </div>

        {/* Floating Elements Around Central Hub */}
        {/* SOL Token */}
        <div className="absolute -top-8 left-12 w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 flex items-center justify-center animate-bounce">
          <DollarOutlined className="text-green-400 text-xl" />
        </div>

        {/* Viewer Count */}
        <div className="absolute top-8 -right-16 w-20 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30 flex items-center justify-center">
          <EyeOutlined className="text-blue-400 mr-1" />
          <span className="text-blue-400 text-sm font-bold">1.2K</span>
        </div>

        {/* Heart/Likes */}
        <div className="absolute -bottom-6 -left-12 w-14 h-14 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full border border-pink-400/30 flex items-center justify-center animate-pulse">
          <HeartOutlined className="text-pink-400 text-lg" />
        </div>

        {/* Gift/Rewards */}
        <div className="absolute bottom-12 right-8 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-400/30 flex items-center justify-center">
          <GiftOutlined className="text-yellow-400 text-xl" />
        </div>

        {/* Trophy */}
        <div className="absolute -top-12 -right-8 w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30 flex items-center justify-center animate-bounce">
          <TrophyOutlined className="text-purple-400 text-lg" />
        </div>

        {/* AVIE Token */}
        <div className="absolute -bottom-8 right-16 w-18 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-400/30 flex items-center justify-center">
          <StarOutlined className="text-indigo-400 mr-1" />
          <span className="text-indigo-400 text-sm font-bold">AVIE</span>
        </div>

        {/* Live Indicator */}
        <div className="absolute top-16 left-16 w-16 h-8 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-full border border-red-400/40 flex items-center justify-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
          <span className="text-red-400 text-xs font-bold">LIVE</span>
        </div>
      </div>

      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Connection lines from center to floating elements */}
        <line x1="50%" y1="50%" x2="30%" y2="25%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="50%" y1="50%" x2="75%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="4,4" />
      </svg>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent rounded-full blur-3xl"></div>
    </div>
  );
};

// Roadmap Graphics Component
const RoadmapGraphics = ({ activePhase, setActivePhase }: { activePhase: number; setActivePhase: (phase: number) => void }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16">
      <div className="relative flex items-center justify-center gap-4">
        {/* Phase 1 */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setActivePhase(0)}
            className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl border border-green-400/30 cursor-pointer relative"
          >
            <CheckCircleOutlined className="text-3xl text-white" />
            {/* Sequential pulse animation - Phase 1 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 opacity-20" 
                 style={{ animation: 'sequentialPulse 4.5s infinite' }}></div>
          </button>
          <div className="mt-4 text-center">
            <div className="text-sm font-bold text-green-400">PHASE 1</div>
            <div className="text-xs text-gray-400">COMPLETED</div>
          </div>
        </div>

        {/* Connection Line 1 */}
        <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>

        {/* Phase 2 */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setActivePhase(1)}
            className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border border-blue-400/30 cursor-pointer relative"
          >
            <ClockCircleOutlined className="text-3xl text-white" />
            {/* Sequential pulse animation - Phase 2 (delayed) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 opacity-20" 
                 style={{ animation: 'sequentialPulse 4.5s infinite 1.5s' }}></div>
          </button>
          <div className="mt-4 text-center">
            <div className="text-sm font-bold text-blue-400">PHASE 2</div>
            <div className="text-xs text-gray-400">IN PROGRESS</div>
          </div>
        </div>

        {/* Connection Line 2 */}
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 relative opacity-50">
          <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full"></div>
        </div>

        {/* Phase 3 */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setActivePhase(2)}
            className="w-24 h-24 bg-gradient-to-br from-purple-600/50 to-pink-600/50 rounded-full flex items-center justify-center shadow-2xl border border-purple-400/30 cursor-pointer relative"
          >
            <CalendarOutlined className="text-3xl text-purple-300" />
            {/* Sequential pulse animation - Phase 3 (more delayed) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-20" 
                 style={{ animation: 'sequentialPulse 4.5s infinite 3s' }}></div>
          </button>
          <div className="mt-4 text-center">
            <div className="text-sm font-bold text-purple-400">PHASE 3</div>
            <div className="text-xs text-gray-400">PLANNED</div>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent rounded-full blur-3xl"></div>
      
      {/* Custom CSS for sequential pulse animation */}
      <style jsx>{`
        @keyframes sequentialPulse {
          0%, 66.67%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          33.33% {
            transform: scale(1.4);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

const RoadmapContent = ({ activePhase, setActivePhase }: { activePhase: number; setActivePhase: (phase: number) => void }) => {
  const phase = ROADMAP_PHASES[activePhase];

  return (
    <section className="pt-0 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Phase Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 p-2 rounded-2xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/30 backdrop-blur-sm">
            {ROADMAP_PHASES.map((phaseItem, index) => (
              <button
                key={index}
                onClick={() => setActivePhase(index)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activePhase === index
                    ? `bg-gradient-to-r ${phaseItem.bgGradient.replace('/20', '')} ${phaseItem.accentColor} border ${phaseItem.borderColor} shadow-lg scale-105`
                    : 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 border border-transparent hover:border-gray-600/30'
                }`}
                aria-label={`Switch to ${phaseItem.title}`}
                tabIndex={0}
              >
                Phase {phaseItem.phase}
              </button>
            ))}
          </div>
        </div>

        {/* Phase Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{phase.title}</h2>
          <h3 className={`text-xl md:text-2xl font-semibold ${phase.accentColor} mb-4`}>{phase.subtitle}</h3>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-6">{phase.description}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phase.features.map((feature, featureIndex) => (
            <div key={featureIndex} className={`p-6 rounded-2xl bg-gradient-to-br ${phase.bgGradient} border ${phase.borderColor} hover:border-opacity-75 transition-all duration-300 group`}>
              <div className="flex items-start mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 ${phase.accentColor} group-hover:scale-110 transition-transform duration-300`}>
                  {React.createElement(feature.icon, { className: "text-2xl" })}
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">{feature.name}</h4>
              <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RoadmapPage = () => {
  const [activePhase, setActivePhase] = useState(0);
  const authSheetRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    // Trigger the AuthSheet modal by programmatically clicking the button
    if (authSheetRef.current) {
      const button = authSheetRef.current.querySelector('button');
      if (button) {
        button.click();
      }
    }
  };

  return (
    <>
      {/* Navigation */}
      <Navigation />

      <main className="overflow-x-hidden pt-12 md:pt-14 lg:pt-16 relative">
        {/* Extended Background for entire page */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
        
        {/* Background Pattern for entire page */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
          <div className="relative z-10 text-center max-w-6xl mx-auto -mt-20">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-sm font-medium text-purple-300 mb-6">
                <RocketOutlined className="mr-2" />
                AVIE 2025 Development Roadmap
              </span>
            </div>
            
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Building the Future of Streaming
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive roadmap outlines the exciting features and improvements coming to the{" "}
              <span className="text-[var(--color-brand)] font-bold">AVIE</span> platform throughout 2025.
            </p>

            {/* Hero Graphics */}
            <HeroGraphics />
          </div>
        </section>

        {/* Visual Separator */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent h-px"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent h-px translate-y-1"></div>
        </div>

        {/* Phases Introduction Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Development Phases
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Follow our journey through three major development phases, each bringing revolutionary features to the AVIE ecosystem.
            </p>
            
            {/* Interactive Roadmap Graphics */}
            <RoadmapGraphics activePhase={activePhase} setActivePhase={setActivePhase} />
          </div>
        </section>

        {/* Visual Separator */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent h-px"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent h-px translate-y-1"></div>
        </div>

        {/* Phase Content Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/10 via-gray-800/5 to-gray-900/10">
          <RoadmapContent activePhase={activePhase} setActivePhase={setActivePhase} />
        </section>

        {/* Visual Separator */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent h-px"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent h-px translate-y-1"></div>
        </div>

        {/* CTA Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-700/30 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the Journey
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Be part of AVIE's evolution. Follow our progress, provide feedback, and help shape the future of decentralized streaming.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 hover:from-purple-700 hover:to-blue-700 h-12 px-8 text-lg font-semibold rounded-full text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-label="Get Started"
                  tabIndex={0}
                >
                  <RocketOutlined /> Get Started
                </button>
                <Link href="/community">
                  <button
                    type="button"
                    className="border border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 h-12 px-8 text-lg rounded-full flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    aria-label="Join Community"
                    tabIndex={0}
                  >
                    <MessageOutlined /> Join Community
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Hidden AuthSheet for programmatic triggering */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
        <div ref={authSheetRef}>
          <AuthSheet />
        </div>
      </div>
    </>
  );
};

export default RoadmapPage;
