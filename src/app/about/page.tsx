"use client";
import React, { useRef } from "react";
import { Navigation } from "../../components/landing/Navigation";
import { Footer } from "../../components/footer/Footer";
import Link from "next/link";
import {
  RocketOutlined,
  ThunderboltOutlined,
  StarOutlined,
  TeamOutlined,
  DollarOutlined,
  TrophyOutlined,
  HeartOutlined,
  BulbOutlined,
  EyeOutlined,
  FireOutlined,
  VideoCameraOutlined,
  CrownOutlined,
  CalendarOutlined,
  MessageOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
  SafetyOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { AuthSheet } from "../../components/auth/AuthSheet";
import { CommunityHero } from "../../components/landing/CommunityHero";

const CORE_VALUES = [
  {
    title: "Creator Empowerment",
    description: "We believe creators should have full control over their content, earnings, and community without traditional platform limitations.",
    icon: CrownOutlined,
    gradient: "from-purple-600 to-blue-600"
  },
  {
    title: "Community First",
    description: "Our platform is built by the community, for the community. Every decision considers the impact on both creators and viewers.",
    icon: TeamOutlined,
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    title: "Transparent Economics",
    description: "Clear, fair, and transparent earning mechanisms that benefit everyone in the ecosystem without hidden fees or complex terms.",
    icon: DollarOutlined,
    gradient: "from-green-600 to-emerald-600"
  },
  {
    title: "Innovation Through Crypto",
    description: "Leveraging blockchain technology to create new possibilities for content creation, monetization, and community engagement.",
    icon: ThunderboltOutlined,
    gradient: "from-yellow-500 to-red-600"
  }
];

const PLATFORM_FEATURES = [
  {
    title: "Dual Earning System",
    description: "Both creators and viewers earn $SOL tokens through various platform activities, creating a sustainable ecosystem for everyone.",
    icon: StarOutlined
  },
  {
    title: "MultiStream Technology",
    description: "Stream to multiple platforms simultaneously, maximizing reach and potential earnings across different audiences.",
    icon: VideoCameraOutlined
  },
  {
    title: "Advanced Clipping Tools",
    description: "Create engaging highlights and clips with our enhanced tools, perfect for social media and community sharing.",
    icon: FireOutlined
  },
  {
    title: "AP Rewards System",
    description: "Activity Points reward system that incentivizes engagement and loyalty within the AVIE community.",
    icon: TrophyOutlined
  },
  {
    title: "Community Governance",
    description: "Token holders participate in platform decisions, ensuring the community has a voice in AVIE's future development.",
    icon: UsergroupAddOutlined
  },
  {
    title: "AI-Powered Features",
    description: "Advanced AI integration for content discovery, moderation, and personalized user experiences.",
    icon: BulbOutlined
  }
];

const JOURNEY_MILESTONES = [
  {
    date: "November 2024",
    title: "Community Explosion",
    description: "20,000+ believers join the movement, validating the vision for a new creator economy.",
    icon: BulbOutlined
  },
  {
    date: "December 2024",
    title: "The Vision Ignites",
    description: "A breakthrough vision for combining streaming and cryptocurrency creates immediate community excitement.",
    icon: TeamOutlined
  },
  {
    date: "January - May 2025",
    title: "Development Sprint",
    description: "7 months of intensive development, building the foundation for revolutionary streaming technology.",
    icon: RocketOutlined
  },
  {
    date: "June 2025",
    title: "AVIE Platform Launch",
    description: "The official launch of AVIE on Solana, bringing the vision to life for creators and viewers worldwide.",
    icon: StarOutlined
  }
];

const AboutPage = () => {
  const authSheetRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    if (authSheetRef.current) {
      const button = authSheetRef.current.querySelector('button');
      if (button) {
        button.click();
      }
    }
  };

  const handleRoadmap = () => {
    window.location.href = '/roadmap';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <Navigation />

      <main className="overflow-x-hidden pt-12 md:pt-14 lg:pt-16 relative">
        {/* Extended Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <CommunityHero 
          badgeText="Revolutionizing the Creator Economy"
          badgeIcon={<HeartOutlined className="mr-2 text-white" />}
          title="About AVIE"
          description="Born from a vision to transform streaming through cryptocurrency, AVIE empowers creators and viewers with unprecedented earning opportunities and community ownership."
          button1={{
            text: "View Roadmap",
            icon: <CalendarOutlined />,
            onClick: handleRoadmap,
            variant: 'primary'
          }}
          button2={{
            text: "Get Started",
            icon: <RocketOutlined />,
            onClick: handleGetStarted,
            variant: 'secondary'
          }}
        />

        {/* Origin Story Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Our Origin Story
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
                The journey from vision to revolutionary platform
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
              <div className="space-y-4 sm:space-y-6">
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/30">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">The Vision</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    In November 2024, a breakthrough vision emerged at the crossroads of streaming and cryptocurrency. 
                    This wasn't just another platform idea—it was a complete reimagining of how creators and their 
                    communities could interact, earn, and thrive together.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    The vision was immediately shared with anyone willing to listen, and the response was explosive. 
                    Within hours, over 20,000 holders had joined—not just as token holders, but as true believers 
                    in a new age creator economy.
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/30">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">The Journey</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Fueled by this incredible community response, development began immediately. Seven months of 
                    intensive building, iterating, and refining led to today—the launch of AVIE, our Solana-based 
                    streaming platform.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    AVIE isn't just another streaming platform. It's designed to empower not only creators but their 
                    supporters as well, creating a sustainable ecosystem where everyone benefits from participation 
                    and engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                The AVIE Journey
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
                From vision to reality in record time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {JOURNEY_MILESTONES.map((milestone, index) => (
                <div key={index} className="relative">
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 group h-full">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                        {React.createElement(milestone.icon, { className: "text-xl" })}
                      </div>
                    </div>
                    <div className="text-sm text-purple-400 font-semibold mb-2">{milestone.date}</div>
                    <h3 className="text-lg font-bold text-white mb-3">{milestone.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{milestone.description}</p>
                  </div>
                  
                  {/* Connection line for larger screens */}
                  {index < JOURNEY_MILESTONES.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform -translate-y-1/2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

                 {/* Core Values Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Our Core Values
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
                The principles that guide everything we build
              </p>
            </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Creator Empowerment */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                    <CrownOutlined className="text-xl sm:text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Creator Empowerment</h3>
                <p className="text-gray-400 leading-relaxed">We believe creators should have full control over their content, earnings, and community without traditional platform limitations.</p>
              </div>

              {/* Community First */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white group-hover:scale-110 transition-transform duration-300">
                    <TeamOutlined className="text-xl sm:text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Community First</h3>
                <p className="text-gray-400 leading-relaxed">Our platform is built by the community, for the community. Every decision considers the impact on both creators and viewers.</p>
              </div>

              {/* Transparent Economics */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 text-white group-hover:scale-110 transition-transform duration-300">
                    <DollarOutlined className="text-xl sm:text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Transparent Economics</h3>
                <p className="text-gray-400 leading-relaxed">Clear, fair, and transparent earning mechanisms that benefit everyone in the ecosystem without hidden fees or complex terms.</p>
              </div>

              {/* Innovation Through Crypto */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                    <ThunderboltOutlined className="text-xl sm:text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Innovation Through Crypto</h3>
                <p className="text-gray-400 leading-relaxed">Leveraging blockchain technology to create new possibilities for content creation, monetization, and community engagement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Features Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Platform Features
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
                Revolutionary tools that empower creators and viewers alike
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {PLATFORM_FEATURES.map((feature, index) => (
                <div key={index} className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300 group">
                  <div className="flex items-start mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(feature.icon, { className: "text-xl" })}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 sm:p-12 md:p-16 rounded-2xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-700/30 backdrop-blur-sm">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
                To create a decentralized streaming ecosystem where creators maintain full ownership of their content 
                and community, while viewers are rewarded for their engagement and support. We're building more than 
                a platform—we're pioneering a new economy that benefits everyone who participates.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 hover:from-purple-700 hover:to-blue-700 h-12 px-8 text-lg font-semibold rounded-full text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:scale-105 active:scale-95"
                  aria-label="Join AVIE"
                  tabIndex={0}
                >
                  <RocketOutlined /> Join AVIE
                </button>
                <Link href="/whitepaper">
                  <button
                    type="button"
                    className="w-full sm:w-auto border border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 h-12 px-8 text-lg rounded-full flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:scale-105 active:scale-95"
                    aria-label="Read Whitepaper"
                    tabIndex={0}
                  >
                    <FileTextOutlined /> Whitepaper
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

export default AboutPage;
