"use client";
import React, { useRef } from "react";
import { Navigation } from "../../components/landing/Navigation";
import { Footer } from "../../components/footer/Footer";
import Link from "next/link";
import {
  TrophyOutlined,
  DollarOutlined,
  EyeOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  WalletOutlined,
  RocketOutlined,
  FireOutlined,
  CrownOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { AuthSheet } from "../../components/auth/AuthSheet";

const EARNING_ACTIVITIES = [
  {
    category: "Viewers",
    icon: EyeOutlined,
    color: "text-blue-400",
    bgGradient: "from-blue-900/20 to-cyan-900/20",
    borderColor: "border-blue-500/30",
    activities: [
      { action: "Watching Streams", description: "Earn rewards for active viewing and time spent on the platform", icon: PlayCircleOutlined },
      { action: "Chat Participation", description: "Engage with streamers and community through meaningful interactions", icon: MessageOutlined },
      { action: "Supporting Content", description: "Show appreciation for great content through likes and reactions", icon: HeartOutlined },
      { action: "Following Creators", description: "Build connections and support your favorite streamers", icon: UserOutlined },
      { action: "Community Engagement", description: "Help grow the AVIE community through social interactions", icon: TeamOutlined },
      { action: "Platform Loyalty", description: "Consistent engagement and platform participation", icon: StarOutlined }
    ]
  },
  {
    category: "Creators",
    icon: StarOutlined,
    color: "text-purple-400",
    bgGradient: "from-purple-900/20 to-pink-900/20",
    borderColor: "border-purple-500/30",
    activities: [
      { action: "Live Streaming", description: "Earn rewards for creating live content and entertaining audiences", icon: VideoCameraOutlined },
      { action: "Audience Engagement", description: "Build active communities and meaningful viewer relationships", icon: TeamOutlined },
      { action: "Growing Community", description: "Attract new followers and expand your reach", icon: UserOutlined },
      { action: "Interactive Content", description: "Create engaging experiences that encourage participation", icon: MessageOutlined },
      { action: "Quality Content", description: "Produce high-quality streams that captivate audiences", icon: TrophyOutlined },
      { action: "Consistent Streaming", description: "Maintain regular streaming schedules and platform presence", icon: CalendarOutlined }
    ]
  }
];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Engage on Platform",
    description: "Watch streams, chat, create content, and participate in the AVIE community",
    icon: PlayCircleOutlined,
    color: "text-blue-400"
  },
  {
    title: "Earn AVIE Points",
    description: "Accumulate AP based on your meaningful activities and engagement.",
    icon: TrophyOutlined,
    color: "text-purple-400"
  },
  {
    title: "Bi-Weekly Calculation",
    description: "Points are calculated and distributed transparently every two weeks",
    icon: CalendarOutlined,
    color: "text-green-400"
  },
  {
    title: "Redeem for $SOL",
    description: "Convert your earned AP to Solana tokens directly in your dashboard",
    icon: WalletOutlined,
    color: "text-yellow-400"
  }
];

const REWARD_TIERS = [
  {
    tier: "Bronze",
    multiplier: "1.0x",
    perks: ["Basic AP earning", "Bi-Weekly redemption", "Community access"],
    color: "text-orange-400",
    bgGradient: "from-orange-900/20 to-amber-900/20",
    borderColor: "border-orange-500/30"
  },
  {
    tier: "Silver", 
    multiplier: "1.25x",
    perks: ["Enhanced AP bonus", "Priority support", "Exclusive events"],
    color: "text-gray-300",
    bgGradient: "from-gray-600/20 to-slate-600/20",
    borderColor: "border-gray-500/30"
  },
  {
    tier: "Gold",
    multiplier: "1.5x",
    perks: ["Premium AP bonus", "Early feature access", "VIP community"],
    color: "text-yellow-400",
    bgGradient: "from-yellow-900/20 to-orange-900/20", 
    borderColor: "border-yellow-500/30"
  },
  {
    tier: "Diamond",
    multiplier: "2.0x",
    perks: ["Maximum AP bonus", "Direct team access", "Governance voting"],
    color: "text-cyan-400",
    bgGradient: "from-cyan-900/20 to-blue-900/20",
    borderColor: "border-cyan-500/30"
  }
];

// Hero Graphics Component
const HeroGraphics = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16">
      {/* Central AVIE Points Hub */}
      <div className="relative flex items-center justify-center">
        {/* Main Central Circle */}
        <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border border-purple-400/30 relative z-10">
          <TrophyOutlined className="text-4xl text-white" />
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 animate-ping opacity-20"></div>
        </div>

        {/* Floating Elements Around Central Hub */}
        {/* SOL Token */}
        <div className="absolute -top-8 left-12 w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 flex items-center justify-center animate-bounce">
          <DollarOutlined className="text-green-400 text-xl" />
        </div>

        {/* Viewer Engagement */}
        <div className="absolute top-8 -right-16 w-20 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30 flex items-center justify-center">
          <EyeOutlined className="text-blue-400 mr-1" />
          <span className="text-blue-400 text-sm font-bold">AP</span>
        </div>

        {/* Heart/Engagement */}
        <div className="absolute -bottom-6 -left-12 w-14 h-14 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full border border-pink-400/30 flex items-center justify-center animate-pulse">
          <HeartOutlined className="text-pink-400 text-lg" />
        </div>

        {/* Rewards */}
        <div className="absolute bottom-12 right-8 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-400/30 flex items-center justify-center">
          <GiftOutlined className="text-yellow-400 text-xl" />
        </div>

        {/* Trophy Achievement */}
        <div className="absolute -top-12 -right-8 w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30 flex items-center justify-center animate-bounce">
          <StarOutlined className="text-purple-400 text-lg" />
        </div>

        {/* AVIE Points Indicator */}
        <div className="absolute -bottom-8 right-16 w-18 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-400/30 flex items-center justify-center">
          <TrophyOutlined className="text-indigo-400 mr-1" />
          <span className="text-indigo-400 text-sm font-bold">AP</span>
        </div>

        {/* Engagement Indicator */}
        <div className="absolute top-16 left-16 w-16 h-8 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full border border-green-400/40 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
          <span className="text-green-400 text-xs font-bold">EARN</span>
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

const APRewardsPage = () => {
  const authSheetRef = useRef<HTMLDivElement>(null);

  const handleJoinNow = () => {
    // Trigger the AuthSheet modal by programmatically clicking the button
    if (authSheetRef.current) {
      const button = authSheetRef.current.querySelector('button');
      if (button) {
        button.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <Navigation />

      <main className="overflow-x-hidden pt-12 md:pt-14 lg:pt-16 relative">
        {/* Extended Background Gradients for entire page */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
        
        {/* Background Pattern for entire page */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center max-w-6xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-sm font-medium text-purple-300 mb-6">
                <TrophyOutlined className="mr-2" />
                Earn While You Engage
              </span>
            </div>
            
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              AVIE Points System
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Turn your engagement into earnings. Watch, stream, chat, and earn{" "}
              <span className="text-purple-400 font-bold">AVIE Points (AP)</span> that convert directly to{" "}
              <span className="text-green-400 font-bold">$SOL</span> tokens bi-weekly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={handleJoinNow}
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105"
              >
                <RocketOutlined className="mr-2" />
                Start Earning Now
              </button>
            </div>

            {/* Hero Graphics */}
            <HeroGraphics />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How AVIE Points Work
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Simple, transparent, and rewarding. Earn AP through platform engagement and redeem for real value.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center">
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}>
                      <step.icon className="text-2xl text-white" />
                    </div>
                    <div className="text-sm font-bold text-purple-400 mb-2">STEP {index + 1}</div>
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Dynamic connecting line */}
                  {index < HOW_IT_WORKS_STEPS.length - 1 && (
                    <>
                      {/* Horizontal line for large screens (4 columns) */}
                      <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 transform translate-x-4 z-0" 
                           style={{ width: 'calc(100% + 2rem)' }} />
                      
                      {/* Vertical line for medium screens (2 columns) - between pairs */}
                      {index % 2 === 0 && index < HOW_IT_WORKS_STEPS.length - 2 && (
                        <div className="hidden md:block lg:hidden absolute top-full left-1/2 w-px h-8 bg-gradient-to-b from-purple-600 to-purple-400 transform -translate-x-1/2 mt-4 z-0" />
                      )}
                      
                      {/* Horizontal line for medium screens (2 columns) - within pairs */}
                      {index % 2 === 0 && index < HOW_IT_WORKS_STEPS.length - 1 && (
                        <div className="hidden md:block lg:hidden absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 transform translate-x-4 z-0"
                             style={{ width: 'calc(100% + 2rem)' }} />
                      )}
                      
                      {/* Vertical line for mobile (1 column) */}
                      <div className="block md:hidden absolute top-full left-1/2 w-px h-8 bg-gradient-to-b from-purple-600 to-purple-400 transform -translate-x-1/2 mt-4 z-0" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Earning Activities */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ways to Earn AVIE Points
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Multiple earning opportunities for both viewers and creators through meaningful engagement
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {EARNING_ACTIVITIES.map((category, categoryIndex) => (
                <div key={categoryIndex} className={`bg-gradient-to-br ${category.bgGradient} border ${category.borderColor} rounded-2xl p-8 backdrop-blur-sm`}>
                  <div className="flex items-center mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 ${category.color} mr-4`}>
                      <category.icon className="text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">For {category.category}</h3>
                      <p className={`${category.color} font-medium`}>Earn AP through meaningful engagement</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {category.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex items-center p-4 rounded-lg bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
                        <div className={`p-2 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 ${category.color} mr-4`}>
                          <activity.icon className="text-lg" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{activity.action}</h4>
                          <p className="text-gray-400 text-sm">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reward Tiers */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Reward Tiers & Multipliers
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Unlock higher earning potential as you engage more with the platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {REWARD_TIERS.map((tier, index) => (
                <div key={index} className={`bg-gradient-to-br ${tier.bgGradient} border ${tier.borderColor} rounded-2xl p-6 text-center hover:border-opacity-75 transition-all duration-300 backdrop-blur-sm`}>
                  <div className={`text-2xl font-bold ${tier.color} mb-2`}>{tier.tier}</div>
                  <div className="text-gray-400 text-sm mb-4">
                    {tier.tier} Tier Member
                  </div>
                  
                  <div className={`text-3xl font-bold ${tier.color} mb-4`}>
                    {tier.multiplier}
                  </div>
                  
                  <div className="space-y-2">
                    {tier.perks.map((perk, perkIndex) => (
                      <div key={perkIndex} className="flex items-center text-sm text-gray-300">
                        <CheckCircleOutlined className="text-green-400 mr-2 text-xs" />
                        {perk}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why AVIE Points?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                A revolutionary reward system designed for the modern streaming economy
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
                <DollarOutlined className="text-4xl text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Real Value</h3>
                <p className="text-gray-300">Convert AP directly to $SOL tokens with transparent exchange rates</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
                <ClockCircleOutlined className="text-4xl text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Bi-Weekly Payouts</h3>
                <p className="text-gray-300">Automatic distribution every two weeks with transparent calculations</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
                <SafetyOutlined className="text-4xl text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Secure & Fair</h3>
                <p className="text-gray-300">Anti-bot protection and fair distribution algorithms ensure legitimate earnings</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-700/30 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users already earning $SOL through the AVIE Points system. 
                Your engagement has never been more valuable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleJoinNow}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  <RocketOutlined className="mr-2" />
                  Start Earning Today
                </button>
                <Link href="/dashboard">
                  <button className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 font-semibold text-lg transition-all duration-300">
                    <TrophyOutlined className="mr-2" />
                    View Dashboard
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
    </div>
  );
};

export default APRewardsPage;
