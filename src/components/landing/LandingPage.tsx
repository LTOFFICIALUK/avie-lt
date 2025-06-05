import React from "react";
import { Navigation } from "./Navigation";
import Image from "next/image";
import { Footer } from "../footer/Footer";
import { Button, Modal, Tabs, Typography } from "antd";
import Link from "next/link";
import {
  PlayCircleOutlined,
  DollarOutlined,
  TrophyOutlined,
  TeamOutlined,
  RocketOutlined,
  StarOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  FireOutlined,
  VideoCameraOutlined,
  HeartOutlined,
  GiftOutlined,
  CloseOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { AuthSheet } from "../auth/AuthSheet";
import Login from "../auth/Login";
import Register from "../auth/Register";
import FormVerify2FA from "../auth/FormVerify2FA";
import PasswordReset from "../auth/PasswordReset";
import { CommunityHero } from "./CommunityHero";

const FEATURES = [
  {
    icon: PlayCircleOutlined,
    title: "Rewarding Streamers",
    description: "Go live and be rewarded with AP Rewards based on a wide range of engagement metrics.",
    color: "text-blue-400"
  },
  {
    icon: DollarOutlined,
    title: "Rewarding Communities",
    description: "Viewers compete for AP Rewards by watching streams, engaging with content, and supporting creators.",
    color: "text-green-400"
  },
  {
    icon: TrophyOutlined,
    title: "AI Powered Tools",
    description: "Take advantage of our AI-powered tools to enhance your streaming experience and grow your audience.",
    color: "text-yellow-400"
  },
  {
    icon: SafetyOutlined,
    title: "MultiStream Capabilities",
    description: "AVIE doesn't limit you to one platform. You can stream to multiple platforms at the same time, empowering creator growth.",
    color: "text-purple-400"
  }
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Account",
    description: "Sign up and connect your Solana wallet to start your streaming journey on AVIE.",
    icon: TeamOutlined
  },
  {
    step: "02", 
    title: "Start Streaming",
    description: "Go live with your content and start being rewarded with AP Rewards from day one.",
    icon: PlayCircleOutlined
  },
  {
    step: "03",
    title: "Engage & Grow",
    description: "Build your audience, engage with viewers, and watch your AP Rewards grow.",
    icon: DollarOutlined
  },
  {
    step: "04",
    title: "Thrive & Improve",
    description: "Leverage AVIE's tools to build a loyal audience, boost your visibility across platforms.",
    icon: StarOutlined
  }
];

// Rewards Dashboard Component
const RewardsDashboard = () => {
  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Mock Browser Window */}
      <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/50 rounded-2xl border border-purple-500/30 backdrop-blur-lg shadow-2xl overflow-hidden">
        {/* Browser Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-gray-700/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="pr-10 text-sm text-gray-400 font-mono">avie.live/dashboard/analytics</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-xl p-4 border border-green-700/30">
              <div className="text-sm text-green-400 mb-1"> Total AP</div>
              <div className="text-2xl font-bold text-white">+ 147.23</div>
              <div className="text-xs text-green-400">Past 24 Hours</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 rounded-xl p-4 border border-blue-700/30">
              <div className="text-sm text-blue-400 mb-1">Live Viewers</div>
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-xs text-blue-400 flex items-center">
                <EyeOutlined className="mr-1" /> watching
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-xl p-4 border border-purple-700/30">
              <div className="text-sm text-purple-400 mb-1">Unique Viewers</div>
              <div className="text-2xl font-bold text-white">92%</div>
              <div className="text-xs text-purple-400 flex items-center">
                <FireOutlined className="mr-1" /> trending
              </div>
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl p-4 mb-6 border border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold">Rewards Overview</div>
              <div className="text-sm text-gray-400">Last 7 days</div>
            </div>
            
            {/* Simple Chart Visualization */}
            <div className="relative h-24 flex items-end justify-between gap-2">
              {[32, 45, 28, 67, 89, 76, 94].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t opacity-80 transition-all duration-500 ease-out"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            
            {/* Chart Labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Recent Payouts */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-xl p-4 border border-gray-700/30">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold">Recent Payouts</div>
              <div className="text-xs text-purple-400">View All</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">All Time</span>
                </div>
                <span className="text-green-400 font-semibold">+12,412</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Last 7 Days</span>
                </div>
                <span className="text-blue-400 font-semibold">+8,920</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Last 24 Hours</span>
                </div>
                <span className="text-purple-400 font-semibold">+3,670</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full border border-purple-400/30 flex items-center justify-center">
        <DollarOutlined className="text-purple-400 text-xl" />
      </div>
      <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 flex items-center justify-center">
        <PlayCircleOutlined className="text-green-400" />
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = React.useState(false);

  const handleStartStreaming = () => {
    setAuthModalOpen(true);
  };

  const handleExploreStreams = () => {
    setAuthModalOpen(true);
  };

  const handleAPRewards = () => {
    window.location.href = '/AP-reward-system';
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
          badgeText="Powered by Solana Blockchain"
          badgeIcon={<ThunderboltOutlined className="mr-2 text-white" />}
          title="Create, Connect, Earn."
          description="Join AVIE, the revolutionary streaming platform where creators and viewers earn AP Rewards for every stream, every view and every interaction."
          button1={{
            text: "Explore Streams",
            icon: <PlayCircleOutlined />,
            onClick: handleExploreStreams,
            variant: 'primary'
          }}
          button2={{
            text: "AP Rewards",
            icon: <TrophyOutlined />,
            onClick: handleAPRewards,
            variant: 'secondary'
          }}
        />

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-14 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                How AVIE Works
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-2 sm:px-0">
                Start earning AP Rewards in just four simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 md:gap-8 relative">
              {HOW_IT_WORKS.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center">
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 relative z-10">
                      <step.icon className="text-xl sm:text-2xl text-white" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-purple-400 mb-2">STEP {step.step}</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm sm:text-base px-2 sm:px-0">{step.description}</p>
                  </div>
                  
                  {/* Dynamic connecting line */}
                  {index < HOW_IT_WORKS.length - 1 && (
                    <>
                      {/* Horizontal line for large screens (4 columns) */}
                      <div className="hidden lg:block absolute top-6 sm:top-8 left-1/2 w-full h-px bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 transform translate-x-4 z-0" 
                           style={{ width: 'calc(100% + 2rem)' }} />
                      
                      {/* Vertical line for medium screens (2 columns) - between pairs */}
                      {index % 2 === 0 && index < HOW_IT_WORKS.length - 2 && (
                        <div className="hidden sm:block lg:hidden absolute top-full left-1/2 w-px h-6 sm:h-8 bg-gradient-to-b from-purple-600 to-purple-400 transform -translate-x-1/2 mt-3 sm:mt-4 z-0" />
                      )}
                      
                      {/* Horizontal line for medium screens (2 columns) - within pairs */}
                      {index % 2 === 0 && index < HOW_IT_WORKS.length - 1 && (
                        <div className="hidden sm:block lg:hidden absolute top-6 sm:top-8 left-1/2 w-full h-px bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 transform translate-x-4 z-0"
                             style={{ width: 'calc(100% + 2rem)' }} />
                      )}
                      
                      {/* Vertical line for mobile (1 column) */}
                      <div className="block sm:hidden absolute top-full left-1/2 w-px h-6 bg-gradient-to-b from-purple-600 to-purple-400 transform -translate-x-1/2 mt-3 z-0" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-14 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                See Your Rewards in Real-Time
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-2 sm:px-0">
                Track your AP Rewards, viewer engagement, and streaming performance with our intuitive dashboard
              </p>
            </div>
            
            <div className="flex justify-center">
              <RewardsDashboard />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-14 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Why Choose AVIE?
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-2 sm:px-0">
                Revolutionary features that make streaming profitable for everyone
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8">
              {FEATURES.map((feature, index) => (
                <div key={index} className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`p-2.5 sm:p-3 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 ${feature.color}`}>
                      <feature.icon className="text-xl sm:text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-14 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Dual Token Economy
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-2 sm:px-0">
                Collect AP Rewards for content and supporting your favorite creators
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8">
              {/* SOL Earnings */}
              <div className="p-6 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/30">
                <div className="flex items-center mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <DollarOutlined className="text-lg sm:text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">AP Rewards</h3>
                    <p className="text-green-400 text-sm sm:text-base">Be rewarded while you stream & watch</p>
                  </div>
                </div>
                <ul className="space-y-2.5 sm:space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <span className="text-sm sm:text-base">Stream rewards based on engagement</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <span className="text-sm sm:text-base">Viewer rewards for watch time</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <span className="text-sm sm:text-base">Instant payouts to Solana wallet</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <span className="text-sm sm:text-base">No minimum withdrawal limits</span>
                  </li>
                </ul>
              </div>

              {/* AVIE Token */}
              <div className="p-6 sm:p-7 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-700/30">
                <div className="flex items-center mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                    <StarOutlined className="text-lg sm:text-xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">$AVIE Token</h3>
                    <p className="text-purple-400 text-sm sm:text-base">Platform governance & utility</p>
                  </div>
                </div>
                <ul className="space-y-2.5 sm:space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    <span className="text-sm sm:text-base">Stake for premium features</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    <span className="text-sm sm:text-base">Governance voting rights</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    <span className="text-sm sm:text-base">Exclusive tournament access</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    <span className="text-sm sm:text-base">Enhanced reward multipliers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-700/30 backdrop-blur-sm">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                Ready to be Rewarded?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
                Join our growing community of creators and viewers and compete for AP Rewards on the AVIE platform. 
                Your streaming journey starts here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={handleStartStreaming}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <RocketOutlined className="mr-2" />
                  Start Streaming Today
                </button>
                <button className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg border border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Auth Modal */}
      {authModalOpen && (
        <AuthSheetControlled 
          open={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      )}
    </div>
  );
};

// Custom controllable AuthSheet component
const AuthSheetControlled = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [verificationMessage, setVerificationMessage] = React.useState<string | null>(null);
  const [verificationMode, setVerificationMode] = React.useState(false);
  const [verificationSuccess, setVerificationSuccess] = React.useState(false);
  const [resetPasswordMode, setResetPasswordMode] = React.useState(false);

  const handleForgotPassword = () => {
    setResetPasswordMode(true);
  };

  const handleBackToLogin = () => {
    setResetPasswordMode(false);
  };

  const handleClose = () => {
    onClose();
    setResetPasswordMode(false);
    setVerificationMode(false);
    setVerificationSuccess(false);
  };

  const items = [
    {
      key: "login",
      label: "Login",
      children: (
        <Login
          onRequiresVerification={(verificationMessage) => {
            setVerificationMode(true);
            setVerificationMessage(verificationMessage);
          }}
          onForgotPassword={handleForgotPassword}
        />
      ),
    },
    {
      key: "register",
      label: "Register",
      children: <Register />,
    },
  ];

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      title={null}
      width={440}
      centered
      className="bg-transparent"
      onCancel={handleClose}
    >
      <div className="relative border-b border-zinc-800 px-6 py-5">
        <div className="flex justify-center items-center gap-3">
          <Image
            src="/favicon/avie-logo-512x512-noback.png"
            alt="AVIE Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <Typography.Title level={4} className="text-white m-0">
            {verificationMode
              ? "Verify Your Login"
              : resetPasswordMode
              ? "Reset Your Password"
              : "Join AVIE today"}
          </Typography.Title>
        </div>
        <button
          onClick={handleClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
        >
          <CloseOutlined className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        {verificationMode ? (
          <div className="space-y-6">
            {verificationSuccess ? (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/25 text-green-400 text-center">
                <CheckCircleOutlined className="w-12 h-12 mx-auto mb-2" />
                <Typography.Title level={5} className="text-green-400">
                  Verification Successful!
                </Typography.Title>
                <Typography.Text className="text-sm">
                  Redirecting to dashboard...
                </Typography.Text>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400">
                  <div className="flex items-start gap-3">
                    <MailOutlined className="w-5 h-5 mt-0.5" />
                    <div>
                      <Typography.Text className="text-sm font-medium">
                        {verificationMessage}
                      </Typography.Text>
                      <Typography.Text className="text-xs mt-1 text-blue-400/80">
                        Enter the 6-character code from your email to verify
                        your login.
                      </Typography.Text>
                    </div>
                  </div>
                </div>

                <FormVerify2FA
                  onVerificationSuccess={() => setVerificationSuccess(true)}
                />
              </>
            )}
          </div>
        ) : resetPasswordMode ? (
          <PasswordReset onBackToLogin={handleBackToLogin} />
        ) : (
          <Tabs items={items} />
        )}
      </div>
    </Modal>
  );
};

export default LandingPage;
