"use client";
import React from "react";
import { Navigation } from "../../components/landing/Navigation";
import { Footer } from "../../components/footer/Footer";
import { Typography } from "antd";
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
  CheckCircleOutlined,
} from "@ant-design/icons";
import { CommunityHero } from "../../components/landing/CommunityHero";

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

const CommunityPage = () => {
  const handleJoinCommunity = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
        <CommunityHero />

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
                <div key={index} className={`p-8 rounded-2xl bg-gradient-to-br ${platform.bgGradient} border ${platform.borderColor} hover:border-opacity-75 transition-all duration-300 group backdrop-blur-sm`}>
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
                            <span className={`mr-3 flex-shrink-0 text-lg font-bold ${
                              platform.name === 'Discord' ? 'text-indigo-400' :
                              platform.name === 'Telegram' ? 'text-blue-400' :
                              platform.name === "AVIE's X" ? 'text-gray-400' :
                              platform.name === 'Founder X' ? 'text-amber-400' :
                              'text-purple-400'
                            }`}>•</span>
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handleJoinCommunity(platform.url)}
                        className={`inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r ${platform.buttonGradient} text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto`}
                      >
                        <platform.icon className="mr-2" />
                        Join {platform.name}
                      </button>
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
                <div key={index} className={`p-6 rounded-2xl bg-gradient-to-br ${highlight.bgGradient} border ${highlight.borderColor} hover:border-opacity-75 transition-all duration-300 backdrop-blur-sm`}>
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
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-700/30 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Connect with our growing community of streamers, viewers, and blockchain enthusiasts. 
                Be part of the future of decentralized streaming.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleJoinCommunity("https://discord.gg/gpWuwPpWxp")}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  <DiscordOutlined className="mr-2" />
                  Join Discord Now
                </button>
                <button
                  onClick={() => handleJoinCommunity("https://t.me/+ADEbvu_yTFs1ZTI0")}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 font-semibold text-lg transition-all duration-300"
                >
                  <SendOutlined className="mr-2" />
                  Join Telegram
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityPage;
