"use client";
import React, { useState, useRef } from "react";
import { Navigation } from "../../components/landing/Navigation";
import { Footer } from "../../components/footer/Footer";
import Link from "next/link";
import {
  FileTextOutlined,
  RocketOutlined,
  DollarOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  StarOutlined,
  EyeOutlined,
  TeamOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  MessageOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  CodeOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  CrownOutlined,
  FireOutlined,
  HeartOutlined,
  DownloadOutlined,
  MenuOutlined,
  CloseOutlined,
  VideoCameraOutlined,
  GiftOutlined,
  DiscordOutlined,
  SendOutlined,
  XOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { AuthSheet } from "../../components/auth/AuthSheet";
import { CommunityHero } from "../../components/landing/CommunityHero";

const PROBLEM_SOLUTIONS = [
  {
    problem: "Creators face limited earning options, with centralized platforms taking large revenue cuts.",
    solution: "AVIE's Reward Ecosystem enables creators to earn through tips, token integration, and platform-native AVIE Points (AP), with low fees and no reliance on ads.",
    icon: DollarOutlined,
    color: "text-green-400"
  },
  {
    problem: "Audiences are faced with limited reasons to stay engaged beyond passive watching.",
    solution: "Watch-to-Earn rewards viewers with the ability to earn AVIE Points (AP) for watching, chatting, and supporting creators, turning engagement into value.",
    icon: EyeOutlined,
    color: "text-blue-400"
  },
  {
    problem: "Fragmented AI tools for moderation, avatars, and automation lack integration and are not purpose-built for streaming environments.",
    solution: "AVIE offers built-in character generation, chat automation, moderation, and content tools which are all accessible from one easy to use dashboard.",
    icon: BulbOutlined,
    color: "text-purple-400"
  },
  {
    problem: "Creators wanting to display their stream to multiple platforms face issues as this typically requires third-party tools or strong hardware.",
    solution: "AVIE's Multistream Plugin enables creators to stream to Twitch, Kick, X, and TikTok simultaneously without the need for additional GPU or third-party software.",
    icon: PlayCircleOutlined,
    color: "text-orange-400"
  }
];

const KEY_FEATURES = [
  {
    title: "Streaming & Chat",
    purpose: "Power real-time content creation and audience interaction through a streamlined, intuitive interface.",
    howItWorks: "Creators use third-party broadcasting software (such as OBS) with a stream key and URL provided by AVIE. The platform supports real-time donation prompts, integrated chat, and moderation tools.",
    whoItsFor: "Ideal for creators of all levels and viewers who want a more interactive, real-time streaming experience.",
    whyItMatters: "Offers a simple and accessible way to go live while unlocking meaningful engagement and monetization—without relying on complex or expensive setups.",
    icon: VideoCameraOutlined,
    color: "text-blue-400"
  },
  {
    title: "Multistream Plugin",
    purpose: "Let creators reach multiple audiences without duplicating effort.",
    howItWorks: "Creators can broadcast a single stream to multiple platforms (Kick, Twitch, TikTok, X, and more) directly from AVIE's dashboard. No additional GPU usage is required.",
    whoItsFor: "Streamers seeking audience growth across platforms.",
    whyItMatters: "Multistream is native to AVIE—unlike external Restreaming services—and includes unified chat integration, allowing creators to monitor and respond to chats from major platforms in one place.",
    icon: PlayCircleOutlined,
    color: "text-purple-400"
  },

  {
    title: "Creator Dashboard",
    purpose: "Centralize performance metrics and creative tools.",
    howItWorks: "This is the creator's control center, showing stream stats (viewership, followers, AP earnings), plugin access, and token performance.",
    whoItsFor: "All AVIE creators—especially those launching tokens or managing communities.",
    whyItMatters: "Transparent data access helps creators optimize content and build sustainable growth strategies.",
    icon: SettingOutlined,
    color: "text-orange-400"
  },
  {
    title: "Reward System (AVIE Points - AP)",
    purpose: "Turn engagement into earnings for creators and viewers.",
    howItWorks: "Viewers earn AP by watching streams and interacting; creators earn AP based on audience activity. AP can be redeemed bi-weekly for $SOL directly from the platform.",
    whoItsFor: "Creators and viewers alike.",
    whyItMatters: "Incentivizes long-term platform engagement and delivers real value to users for participation—without requiring ad revenue or brand sponsorships.",
    icon: TrophyOutlined,
    color: "text-yellow-400"
  }
];

const TECH_STACK = [
  { component: "Frontend", description: "Built with React and TailwindCSS for rapid iteration and mobile responsiveness", icon: CodeOutlined },
  { component: "Backend", description: "Node.js with PostgreSQL ensures scalable database integrity", icon: SettingOutlined },
  { component: "Web3 Integration", description: "Solana-based smart contracts power all token transactions, creator token launches, and AP redemptions", icon: ThunderboltOutlined },
  { component: "AI Stack", description: "Real-time LLM pipelines for chatbot response, avatar generation, and smart moderation", icon: BulbOutlined },
  { component: "Media Delivery", description: "High-speed HLS streaming, FFmpeg encoding, and OBS-ready setup ensures quality and accessibility", icon: PlayCircleOutlined }
];

const SECURITY_FEATURES = [
  { feature: "KYC/AML Verification", description: "May be required for creator token launches and users interacting with monetized systems" },
  { feature: "Smart Contract Audits", description: "All core contracts are subject to external audit and public reporting" },
  { feature: "Content Moderation", description: "AVIE uses hybrid human-AI systems to enforce platform rules and maintain a safe environment" },
  { feature: "Data Handling", description: "Compliant with global standards such as GDPR, CCPA, and Data Protection laws" }
];

const WhitepaperPage = () => {
  const authSheetRef = useRef<HTMLDivElement>(null);

  const sections = [
    { key: 'executive-summary', title: 'Executive Summary' },
    { key: 'platform-overview', title: 'Platform Overview' },
    { key: 'problem-solution', title: 'Problem & Solution' },
    { key: 'key-features', title: 'Key Features' },
    { key: 'avie-token', title: '$AVIE Token Utility' },
    { key: 'ap-system', title: 'AVIE Points System' },
    { key: 'tech-stack', title: 'Technology Stack' },
    { key: 'security', title: 'Security & Compliance' },
    { key: 'roadmap', title: 'Roadmap' },
    { key: 'legal', title: 'Legal Disclaimers' },
    { key: 'future', title: 'The Future Starts Here' }
  ];

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoinMovement = () => {
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
        <CommunityHero 
          badgeText="Last Updated: 05/17/2025"
          badgeIcon={<ClockCircleOutlined className="mr-2 text-white" />}
          title="Official AVIE Whitepaper"
          description="Technical documentation and overview for the AVIE platform and its features."
          button1={{
            text: "Roadmap",
            icon: <RocketOutlined />,
            onClick: () => window.location.href = '/roadmap',
            variant: 'primary'
          }}
          button2={{
            text: "AP Rewards",
            icon: <TrophyOutlined />,
            onClick: () => window.location.href = '/AP-reward-system',
            variant: 'secondary'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 relative z-10">
          {/* Table of Contents - Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-white font-semibold mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.key}
                    onClick={() => handleScrollToSection(section.key)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-purple-400 hover:bg-purple-600/10 rounded-md transition-all duration-200"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Executive Summary */}
            <section id="executive-summary" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <RocketOutlined className="mr-3 text-purple-400" />
                Executive Summary
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg">
                  AVIE is a next-generation streaming platform built to bridge the gap between Web2 ease of use and Web3 innovation. 
                  Designed for creators and viewers alike, AVIE introduces a tokenized ecosystem, AI-integrated tools, and seamless 
                  cross-platform functionality to redefine live content creation and engagement.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg mt-4">
                  Our mission is to remove traditional platform constraints and empower creators through ownership, innovation, and 
                  transparency, while rewarding viewers for their participation.
                </p>
              </div>
            </section>

            {/* Platform Overview */}
            <section id="platform-overview" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <GlobalOutlined className="mr-3 text-blue-400" />
                Platform Overview
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg">
                  AVIE is a creator-first entertainment platform offering a user-centric rewards program, real-time streaming, 
                  donation tools, live chat, clip generation, multistreaming, and AI-powered plugins.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg mt-4">
                  With an emphasis on accessibility, AVIE reduces onboarding friction by integrating walletless viewer experiences, 
                  intuitive UI, and automatic incentives. All creators can customize their streaming environment and earn from 
                  audience interaction, while viewers get rewarded for time spent, engagement, and support.
                </p>
                <p className="text-gray-300 leading-relaxed text-lg mt-4">
                  Our platform combines familiar streaming workflows with cutting-edge Web3 infrastructure to ensure users benefit 
                  from both performance and innovation without requiring crypto expertise.
                </p>
              </div>
            </section>

            {/* Problem & Solution */}
            <section id="problem-solution" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <BulbOutlined className="mr-3 text-yellow-400" />
                Problem & Solution
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-8">
                The current streaming landscape limits creator control, engagement incentives, and technical accessibility. 
                AVIE addresses these issues head-on by combining seamless monetization, integrated AI tools, and multi-platform 
                distribution into a single, creator-first platform—built to reward both creators and their communities.
              </p>
              
              <div className="space-y-6">
                {PROBLEM_SOLUTIONS.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 ${item.color}`}>
                        <item.icon className="text-2xl" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold text-red-400 mb-2">Problem:</h4>
                          <p className="text-gray-300">{item.problem}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-green-400 mb-2">Solution:</h4>
                          <p className="text-gray-300">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Features */}
            <section id="key-features" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <StarOutlined className="mr-3 text-purple-400" />
                AVIE's Key Features
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-8">
                Upon launch, AVIE will provide the following core features to support creators and their audiences. 
                This is just the beginning — see our roadmap for upcoming releases and long-term platform expansion.
              </p>
              
              <div className="space-y-8">
                {KEY_FEATURES.map((feature, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 ${feature.color}`}>
                        <feature.icon className="text-3xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Purpose:</h4>
                        <p className="text-gray-300 mb-4">{feature.purpose}</p>
                        
                        <h4 className="text-lg font-semibold text-blue-400 mb-2">How It Works:</h4>
                        <p className="text-gray-300">{feature.howItWorks}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-400 mb-2">Who It's For:</h4>
                        <p className="text-gray-300 mb-4">{feature.whoItsFor}</p>
                        
                        <h4 className="text-lg font-semibold text-orange-400 mb-2">Why It Matters:</h4>
                        <p className="text-gray-300">{feature.whyItMatters}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* $AVIE Token */}
            <section id="avie-token" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <CrownOutlined className="mr-3 text-yellow-400" />
                $AVIE Token Utility & Ecosystem Role
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-6">
                The $AVIE token powers the infrastructure behind the AVIE platform. It is a non-speculative, 
                utility-based token that enables:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30">
                  <div className="flex items-center mb-2">
                    <CheckCircleOutlined className="text-green-400 mr-2" />
                    <h4 className="text-white font-semibold">Access to Platform Plugins</h4>
                  </div>
                  <p className="text-gray-400 text-sm">Certain AI tools and plugins will be available via $AVIE token access</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30">
                  <div className="flex items-center mb-2">
                    <CheckCircleOutlined className="text-green-400 mr-2" />
                    <h4 className="text-white font-semibold">Support for AI Costs</h4>
                  </div>
                  <p className="text-gray-400 text-sm">$AVIE offsets backend compute costs for generative AI functions</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30">
                  <div className="flex items-center mb-2">
                    <CheckCircleOutlined className="text-green-400 mr-2" />
                    <h4 className="text-white font-semibold">Governance Participation</h4>
                  </div>
                  <p className="text-gray-400 text-sm">Token holders can vote on proposed upgrades, community features, and more</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/30">
                  <div className="flex items-center mb-2">
                    <CheckCircleOutlined className="text-green-400 mr-2" />
                    <h4 className="text-white font-semibold">Transaction Fees</h4>
                  </div>
                  <p className="text-gray-400 text-sm">Micro-fees on features like donations or creator token launches generate revenue</p>
                </div>
              </div>
            </section>

            {/* AP System */}
            <section id="ap-system" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <TrophyOutlined className="mr-3 text-green-400" />
                AVIE Points (AP) — The Reward System
              </h2>
              <p className="text-gray-300 leading-relaxed text-lg mb-8">
                AVIE Points (AP) are a utility-based incentive system that rewards viewers and creators for their 
                meaningful contributions to the platform.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <EyeOutlined className="text-3xl text-blue-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">For Viewers</h3>
                  </div>
                  <p className="text-gray-300">
                    Engage with streams and earn rewards by chatting, watching, liking, and supporting your favorite creators. 
                    The more active you are, the more you gain.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <StarOutlined className="text-3xl text-purple-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">For Creators</h3>
                  </div>
                  <p className="text-gray-300">
                    Grow your audience, keep viewers engaged, and stream consistently to earn rewards. 
                    Your success and community activity directly power your earnings.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 text-center">
                  <h4 className="text-green-400 font-semibold mb-2">Bi-Weekly Distribution</h4>
                  <p className="text-gray-400 text-sm">AP is calculated and redeemable at the end of each bi-week</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 text-center">
                  <h4 className="text-blue-400 font-semibold mb-2">Redemption</h4>
                  <p className="text-gray-400 text-sm">Users can redeem AP for $SOL (Solana) via their AVIE account dashboard</p>
                </div>
                
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 text-center">
                  <h4 className="text-purple-400 font-semibold mb-2">Compliance</h4>
                  <p className="text-gray-400 text-sm">All redemptions may be subject to KYC verification and compliance review</p>
                </div>
              </div>
            </section>

            {/* Technology Stack */}
            <section id="tech-stack" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <CodeOutlined className="mr-3 text-blue-400" />
                Technology Stack
              </h2>
              
              <div className="space-y-4">
                {TECH_STACK.map((tech, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-blue-400">
                        <tech.icon className="text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">{tech.component}</h4>
                        <p className="text-gray-300">{tech.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Security & Compliance */}
            <section id="security" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <SecurityScanOutlined className="mr-3 text-green-400" />
                Security & Compliance
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SECURITY_FEATURES.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircleOutlined className="text-green-400 text-xl mt-1" />
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{item.feature}</h4>
                        <p className="text-gray-300">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Roadmap */}
            <section id="roadmap" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <FireOutlined className="mr-3 text-orange-400" />
                Roadmap
              </h2>
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-lg p-8 backdrop-blur-sm text-center">
                <p className="text-gray-300 text-lg mb-4">
                  Visit <span className="text-purple-400 font-semibold">https://avie.live/roadmap</span> for a full breakdown of current and upcoming product phases.
                </p>
                <Link href="/roadmap">
                  <button className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                    View Full Roadmap
                  </button>
                </Link>
              </div>
            </section>

            {/* Legal Disclaimers */}
            <section id="legal" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <SafetyOutlined className="mr-3 text-red-400" />
                Legal Disclaimers
              </h2>
              
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
                    <p className="text-gray-300">$AVIE and creator tokens are not investment products</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
                    <p className="text-gray-300">No claim or implication of financial return is offered or implied</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
                    <p className="text-gray-300">AVIE complies with applicable international regulatory standards</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
                    <p className="text-gray-300">Features may be regionally restricted or delayed depending on legal considerations</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2" />
                    <p className="text-gray-300">All content, tokens, and interactions are subject to the AVIE Terms of Service</p>
                  </div>
                </div>
              </div>
            </section>

            {/* The Future Starts Here */}
            <section id="future" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
                <HeartOutlined className="mr-3 text-pink-400" />
                The Future Starts Here
              </h2>
              
              <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-700/30 rounded-lg p-8 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-xl text-gray-300 leading-relaxed mb-6">
                    AVIE isn't just a streaming platform—it's a movement. A new digital stage where creators own their momentum, 
                    communities earn through engagement, and every stream pushes the industry forward.
                  </p>
                  <p className="text-lg text-gray-300 mb-6">
                    This is your invitation to build, connect, and thrive in a space powered by innovation—not legacy rules.
                  </p>
                  <p className="text-xl font-bold text-purple-400 mb-6">
                    We're not here to follow trends. We're here to rewrite them.
                  </p>
                  <p className="text-2xl font-bold text-white mb-8">
                    Welcome to the future of streaming. Let's shape it together.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleJoinMovement}
                      className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <RocketOutlined className="mr-2" />
                      Join the Movement
                    </button>
                    <Link href="/community">
                      <button className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 font-semibold text-lg transition-all duration-300">
                        <TeamOutlined className="mr-2" />
                        Join Community
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-8 right-8 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
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

export default WhitepaperPage;
