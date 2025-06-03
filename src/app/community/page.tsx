"use client";
import React from "react";
import { Navigation } from "../../components/landing/Navigation";
import { Footer } from "../../components/footer/Footer";
import { Button, Typography } from "antd";
import Link from "next/link";
import {
  TeamOutlined,
  MessageOutlined,
  SendOutlined,
  TwitterOutlined,
  XOutlined,
  UserOutlined,
  GlobalOutlined,
  HeartOutlined,
  TrophyOutlined,
  FireOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  StarOutlined,
  CommentOutlined,
  UsergroupAddOutlined,
  CrownOutlined,
  DiscordOutlined,
} from "@ant-design/icons";

const SOCIAL_PLATFORMS = [
  {
    name: "Discord",
    description: "Join our Discord server to chat with thousands of AVIE community members, get real-time updates, and participate in exclusive events.",
    url: "https://discord.gg/gpWuwPpWxp",
    icon: DiscordOutlined,
    bgGradient: "from-indigo-600/20 to-purple-600/20",
    borderColor: "border-indigo-500/30",
    textColor: "text-indigo-400",
    buttonGradient: "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
    features: ["Real-time chat", "Community events", "Technical support", "Exclusive announcements"]
  },
  {
    name: "Telegram",
    description: "Stay connected with our official Telegram community for instant updates, discussions, and direct communication with the team.",
    url: "https://t.me/+ADEbvu_yTFs1ZTI0",
    icon: SendOutlined,
    bgGradient: "from-blue-600/20 to-cyan-600/20",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    buttonGradient: "from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
    features: ["Instant notifications", "Community polls", "Direct team access", "Market discussions"]
  },
  {
    name: "AVIE's X",
    description: "Follow our official platform account for the latest news, product updates, partnerships, and ecosystem developments.",
    url: "https://x.com/aviestreaming",
    icon: XOutlined,
    bgGradient: "from-gray-600/20 to-slate-600/20",
    borderColor: "border-gray-500/30",
    textColor: "text-gray-400",
    buttonGradient: "from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700",
    features: ["Official updates", "Partnership news", "Product launches", "Industry insights"]
  },
  {
    name: "Founder X",
    description: "Follow StreamGuy's personal account for behind-the-scenes insights, vision updates, and direct communication from leadership.",
    url: "https://x.com/LiveStreamCoin",
    icon: XOutlined,
    bgGradient: "from-amber-600/20 to-orange-600/20",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    buttonGradient: "from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
    features: ["Founder insights", "Vision updates", "Personal updates", "Industry thoughts"]
  }
];

const COMMUNITY_HIGHLIGHTS = [
  {
    title: "Periodic AMAs",
    description: "Join our Ask Me Anything sessions with the team",
    icon: CommentOutlined,
    color: "text-purple-400",
    bgGradient: "from-purple-900/20 to-indigo-900/20",
    borderColor: "border-purple-500/30"
  },
  {
    title: "Creator Showcases",
    description: "Featured content creators and their success stories",
    icon: StarOutlined,
    color: "text-yellow-400",
    bgGradient: "from-yellow-900/20 to-orange-900/20",
    borderColor: "border-yellow-500/30"
  },
  {
    title: "Community Rewards",
    description: "Regular rewards with $SOL and $AVIE token prizes",
    icon: TrophyOutlined,
    color: "text-green-400",
    bgGradient: "from-green-900/20 to-emerald-900/20",
    borderColor: "border-green-500/30"
  },
  {
    title: "Technical Updates",
    description: "First access to new features and platform updates",
    icon: ThunderboltOutlined,
    color: "text-blue-400",
    bgGradient: "from-blue-900/20 to-cyan-900/20",
    borderColor: "border-blue-500/30"
  }
];

// Community Graphics Component
const CommunityGraphics = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16">
      {/* Central Community Hub */}
      <div className="relative flex items-center justify-center">
        {/* Main Central Circle */}
        <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border border-purple-400/30 relative z-10">
          <TeamOutlined className="text-4xl text-white" />
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 animate-ping opacity-20"></div>
        </div>

        {/* Floating Social Platform Icons */}
        {/* Discord */}
        <div className="absolute -top-8 left-12 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-400/30 flex items-center justify-center animate-bounce">
          <DiscordOutlined className="text-indigo-400 text-xl" />
        </div>

        {/* Telegram */}
        <div className="absolute top-8 -right-16 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-400/30 flex items-center justify-center">
          <SendOutlined className="text-blue-400 text-xl" />
        </div>

        {/* X Platform */}
        <div className="absolute -bottom-6 -left-12 w-16 h-16 bg-gradient-to-br from-gray-500/20 to-slate-500/20 rounded-full border border-gray-400/30 flex items-center justify-center animate-pulse">
          <XOutlined className="text-gray-400 text-xl" />
        </div>

        {/* Founder X */}
        <div className="absolute bottom-12 right-8 w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full border border-amber-400/30 flex items-center justify-center">
          <XOutlined className="text-amber-400 text-xl" />
        </div>

        {/* Community Members */}
        <div className="absolute -top-12 -right-8 w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 flex items-center justify-center animate-bounce">
          <UserOutlined className="text-green-400 text-lg" />
        </div>

        {/* Community Heart */}
        <div className="absolute -bottom-8 right-16 w-14 h-14 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full border border-pink-400/30 flex items-center justify-center">
          <HeartOutlined className="text-pink-400 text-lg" />
        </div>

        {/* Active Status */}
        <div className="absolute top-16 left-16 w-16 h-8 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full border border-green-400/40 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
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

const CommunityPage = () => {
  const handleJoinCommunity = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Navigation */}
      <Navigation />

      <main className="overflow-x-hidden pt-12 md:pt-14 lg:pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-6xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-sm font-medium text-purple-300 mb-6">
                <TeamOutlined className="mr-2 text-white" />
                Join AVIE Community Members
              </span>
            </div>
            
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Connect. Share. Grow.
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join the vibrant <span className="text-[var(--color-brand)] font-bold">AVIE</span> community across multiple platforms. 
              Connect with creators, viewers, and blockchain enthusiasts from around the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                type="primary" 
                size="large"
                icon={<DiscordOutlined />}
                className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 hover:from-purple-700 hover:to-blue-700 h-12 px-6 text-lg font-semibold"
                onClick={() => handleJoinCommunity("https://discord.gg/gpWuwPpWxp")}
              >
                Join Discord
              </Button>
              <Button 
                size="large"
                icon={<SendOutlined />}
                className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 h-12 px-6 text-lg"
                onClick={() => handleJoinCommunity("https://t.me/+ADEbvu_yTFs1ZTI0")}
              >
                Join Telegram
              </Button>
            </div>

            {/* Community Graphics */}
            <CommunityGraphics />
          </div>
        </section>

        {/* Social Platforms Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our Social Platforms
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Connect with us across all major social platforms for updates, discussions, and community events
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {SOCIAL_PLATFORMS.map((platform, index) => (
                <div key={index} className={`p-8 rounded-2xl bg-gradient-to-br ${platform.bgGradient} border ${platform.borderColor} hover:border-opacity-75 transition-all duration-300 group`}>
                  <div className="flex items-start space-x-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 ${platform.textColor} group-hover:scale-110 transition-transform duration-300`}>
                      <platform.icon className="text-3xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-white">{platform.name}</h3>
                      </div>
                      <p className="text-gray-300 mb-6 leading-relaxed">{platform.description}</p>
                      
                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {platform.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <div className={`w-2 h-2 ${platform.textColor.replace('text-', 'bg-')} rounded-full mr-2`} />
                            <span className="text-sm text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        type="primary" 
                        size="large"
                        icon={<platform.icon />}
                        className={`bg-gradient-to-r ${platform.buttonGradient} border-0 h-12 px-6 text-lg font-semibold w-full sm:w-auto`}
                        onClick={() => handleJoinCommunity(platform.url)}
                      >
                        Join {platform.name}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Highlights Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Community Highlights
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Experience exclusive events, contests, and opportunities available only to our community members
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {COMMUNITY_HIGHLIGHTS.map((highlight, index) => (
                <div key={index} className={`p-6 rounded-2xl bg-gradient-to-br ${highlight.bgGradient} border ${highlight.borderColor} hover:border-opacity-75 transition-all duration-300`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 ${highlight.color}`}>
                      <highlight.icon className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{highlight.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{highlight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-700/30">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Connect with our growing community of streamers, viewers, and blockchain enthusiasts. 
                Be part of the future of decentralized streaming.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<DiscordOutlined />}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 hover:from-indigo-700 hover:to-purple-700 h-12 px-8 text-lg font-semibold"
                  onClick={() => handleJoinCommunity("https://discord.gg/gpWuwPpWxp")}
                >
                  Join Discord Now
                </Button>
                <Button 
                  size="large"
                  icon={<SendOutlined />}
                  className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 h-12 px-8 text-lg"
                  onClick={() => handleJoinCommunity("https://t.me/+ADEbvu_yTFs1ZTI0")}
                >
                  Join Telegram
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CommunityPage;
