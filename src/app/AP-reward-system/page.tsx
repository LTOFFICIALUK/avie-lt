"use client";
import React from "react";
import { Navigation } from "../../components/landing/Navigation";
import { Footer } from "../../components/footer/Footer";
import APGraphics from "../../components/graphics/APGraphics";
import { Button, Card, Progress, Statistic, Steps } from "antd";
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
} from "@ant-design/icons";

const EARNING_ACTIVITIES = [
  {
    category: "Viewers",
    icon: EyeOutlined,
    color: "text-blue-400",
    bgGradient: "from-blue-900/20 to-cyan-900/20",
    borderColor: "border-blue-500/30",
    activities: [
      { action: "Watching Streams", points: "1-5 AP/hour", description: "Earn points for every hour of active viewing" },
      { action: "Chat Participation", points: "2-10 AP/message", description: "Engage with streamers and community" },
      { action: "Liking Content", points: "1 AP/like", description: "Show appreciation for great content" },
      { action: "Following Creators", points: "5 AP/follow", description: "Support your favorite streamers" },
      { action: "Sharing Streams", points: "10 AP/share", description: "Help grow the AVIE community" },
      { action: "Daily Login", points: "5-15 AP/day", description: "Consistent platform engagement" }
    ]
  },
  {
    category: "Creators",
    icon: StarOutlined,
    color: "text-purple-400",
    bgGradient: "from-purple-900/20 to-pink-900/20",
    borderColor: "border-purple-500/30",
    activities: [
      { action: "Streaming Hours", points: "10-50 AP/hour", description: "Base rewards for live streaming" },
      { action: "Viewer Engagement", points: "1-5 AP/viewer", description: "Bonus for active audience participation" },
      { action: "New Followers", points: "20 AP/follower", description: "Growing your community" },
      { action: "Chat Interaction", points: "5 AP/response", description: "Actively engaging with viewers" },
      { action: "Content Quality", points: "50-200 AP/stream", description: "AI-assessed content quality bonus" },
      { action: "Consistency Bonus", points: "100-500 AP/week", description: "Regular streaming schedule rewards" }
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
    description: "Accumulate AP based on your activities throughout the week",
    icon: TrophyOutlined,
    color: "text-purple-400"
  },
  {
    title: "Weekly Calculation",
    description: "Points are calculated and distributed every Sunday at midnight UTC",
    icon: CalendarOutlined,
    color: "text-green-400"
  },
  {
    title: "Redeem for $SOL",
    description: "Convert your AP to Solana tokens directly in your dashboard",
    icon: WalletOutlined,
    color: "text-yellow-400"
  }
];

const REWARD_TIERS = [
  {
    tier: "Bronze",
    minPoints: 0,
    maxPoints: 999,
    multiplier: "1.0x",
    perks: ["Basic AP earning", "Weekly redemption", "Community access"],
    color: "text-orange-400",
    bgGradient: "from-orange-900/20 to-amber-900/20",
    borderColor: "border-orange-500/30"
  },
  {
    tier: "Silver", 
    minPoints: 1000,
    maxPoints: 4999,
    multiplier: "1.25x",
    perks: ["25% AP bonus", "Priority support", "Exclusive events"],
    color: "text-gray-300",
    bgGradient: "from-gray-600/20 to-slate-600/20",
    borderColor: "border-gray-500/30"
  },
  {
    tier: "Gold",
    minPoints: 5000,
    maxPoints: 19999,
    multiplier: "1.5x",
    perks: ["50% AP bonus", "Early feature access", "VIP community"],
    color: "text-yellow-400",
    bgGradient: "from-yellow-900/20 to-orange-900/20", 
    borderColor: "border-yellow-500/30"
  },
  {
    tier: "Diamond",
    minPoints: 20000,
    maxPoints: null,
    multiplier: "2.0x",
    perks: ["100% AP bonus", "Direct team access", "Governance voting"],
    color: "text-cyan-400",
    bgGradient: "from-cyan-900/20 to-blue-900/20",
    borderColor: "border-cyan-500/30"
  }
];

const APRewardsPage = () => {
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
              <span className="text-green-400 font-bold">$SOL</span> tokens every week.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                type="primary" 
                size="large"
                icon={<RocketOutlined />}
                className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 hover:from-purple-700 hover:to-blue-700 h-12 px-6 text-lg font-semibold"
              >
                Start Earning Now
              </Button>
              <Button 
                size="large"
                icon={<TrophyOutlined />}
                className="border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 h-12 px-6 text-lg"
              >
                View Leaderboard
              </Button>
            </div>

            {/* AP Graphics */}
            <APGraphics />
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 ${step.color}`}>
                    <step.icon className="text-2xl text-white" />
                  </div>
                  <div className="text-sm font-bold text-purple-400 mb-2">STEP {index + 1}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
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
                Multiple earning opportunities for both viewers and creators
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {EARNING_ACTIVITIES.map((category, categoryIndex) => (
                <Card key={categoryIndex} className={`bg-gradient-to-br ${category.bgGradient} border ${category.borderColor}`}>
                  <div className="flex items-center mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 ${category.color} mr-4`}>
                      <category.icon className="text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">For {category.category}</h3>
                      <p className={`${category.color} font-medium`}>Earn AP by being active</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {category.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{activity.action}</h4>
                          <p className="text-gray-400 text-sm">{activity.description}</p>
                        </div>
                        <div className={`text-right ${category.color} font-bold text-lg ml-4`}>
                          {activity.points}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
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
                <Card key={index} className={`bg-gradient-to-br ${tier.bgGradient} border ${tier.borderColor} text-center hover:border-opacity-75 transition-all duration-300`}>
                  <div className={`text-2xl font-bold ${tier.color} mb-2`}>{tier.tier}</div>
                  <div className="text-gray-400 text-sm mb-4">
                    {tier.minPoints.toLocaleString()} - {tier.maxPoints ? tier.maxPoints.toLocaleString() : '∞'} AP
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
                </Card>
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
              <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 text-center">
                <DollarOutlined className="text-4xl text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Real Value</h3>
                <p className="text-gray-300">Convert AP directly to $SOL tokens with transparent exchange rates</p>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 text-center">
                <ClockCircleOutlined className="text-4xl text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Weekly Payouts</h3>
                <p className="text-gray-300">Automatic distribution every week with no minimum withdrawal</p>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 text-center">
                <SafetyOutlined className="text-4xl text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Secure & Fair</h3>
                <p className="text-gray-300">Anti-bot protection and fair distribution algorithms ensure legitimate earnings</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-700/30">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users already earning $SOL through the AVIE Points system. 
                Your engagement has never been more valuable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<RocketOutlined />}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 hover:from-purple-700 hover:to-blue-700 h-12 px-8 text-lg font-semibold"
                >
                  Start Earning Today
                </Button>
                <Button 
                  size="large"
                  icon={<TrophyOutlined />}
                  className="border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 h-12 px-8 text-lg"
                >
                  View Dashboard
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

export default APRewardsPage;
