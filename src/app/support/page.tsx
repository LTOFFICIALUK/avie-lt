"use client";
import React, { useRef } from "react";
import { Navigation } from "../../components/landing/Navigation";
import { Footer } from "../../components/footer/Footer";
import Link from "next/link";
import {
  MailOutlined,
  BugOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  MessageOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  SafetyOutlined,
  ToolOutlined,
  HeartOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DiscordOutlined,
} from "@ant-design/icons";
import { AuthSheet } from "../../components/auth/AuthSheet";
import { CommunityHero } from "../../components/landing/CommunityHero";

const SUPPORT_CATEGORIES = [
  {
    title: "Bug Reports",
    description: "Found a bug? Help us improve AVIE by reporting issues you encounter on the platform.",
    icon: BugOutlined,
    gradient: "from-red-600 to-pink-600",
    items: [
      "Streaming issues",
      "Payment problems",
      "UI/UX bugs",
      "Performance issues"
    ]
  },
  {
    title: "Feature Requests",
    description: "Have an idea for a new feature? We'd love to hear your suggestions for improving AVIE.",
    icon: StarOutlined,
    gradient: "from-purple-600 to-blue-600",
    items: [
      "New streaming features",
      "Enhanced monetization",
      "Community tools",
      "Creator utilities"
    ]
  },
  {
    title: "Account & Security",
    description: "Need help with your account, security settings, or wallet integration issues.",
    icon: SafetyOutlined,
    gradient: "from-green-600 to-emerald-600",
    items: [
      "Account recovery",
      "Wallet connection",
      "Security settings",
      "Two-factor authentication"
    ]
  },
  {
    title: "Platform Support",
    description: "General questions about using AVIE, streaming setup, and platform features.",
    icon: ToolOutlined,
    gradient: "from-blue-600 to-cyan-600",
    items: [
      "Streaming setup",
      "Earning mechanisms",
      "Community features",
      "MultiStream technology"
    ]
  }
];

const FAQ_ITEMS = [
  {
    question: "How do I report a bug?",
    answer: "Email us at support@avie.live or message us on Discord with a detailed description of the issue, including steps to reproduce it, your browser/device information, and any error messages you see."
  },
  {
    question: "What information should I include in a bug report?",
    answer: "Please include: detailed description of the issue, steps to reproduce, expected vs actual behavior, browser/device info, screenshots if applicable, and your account details (without passwords)."
  },
  {
    question: "How quickly do you respond to support requests?",
    answer: "We typically respond within 24-48 hours. Critical bugs and security issues are prioritized and addressed as quickly as possible."
  },
  {
    question: "Can I suggest new features?",
    answer: "Absolutely! We encourage feature suggestions from our community. Email us at support@avie.live or share your ideas on Discord with detailed descriptions of how the feature would benefit creators and viewers."
  },
  {
    question: "Is there a public roadmap for feature requests?",
    answer: "Yes! Check out our roadmap page to see planned features and vote on community suggestions. Your feedback directly influences our development priorities."
  },
  {
    question: "How do I get help with wallet integration?",
    answer: "For wallet-related issues, email us at support@avie.live or ask on Discord with your wallet type, the specific problem you're experiencing, and any error messages. Never share your private keys or seed phrases."
  }
];

const SupportPage = () => {
  const authSheetRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    if (authSheetRef.current) {
      const button = authSheetRef.current.querySelector('button');
      if (button) {
        button.click();
      }
    }
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@avie.live?subject=AVIE Support Request';
  };

  const handleJoinDiscord = () => {
    window.open('https://discord.gg/gpWuwPpWxp', '_blank');
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
          badgeText="We're Here to Help"
          badgeIcon={<HeartOutlined className="mr-2 text-white" />}
          title="Support Center"
          description="Get help with AVIE, report bugs, suggest features, or contact our support team via email or Discord. We're committed to providing you with the best streaming experience possible."
          button1={{
            text: "Contact Support",
            icon: <MailOutlined />,
            onClick: handleContactSupport,
            variant: 'primary'
          }}
          button2={{
            text: "Join Discord",
            icon: <DiscordOutlined />,
            onClick: handleJoinDiscord,
            variant: 'secondary'
          }}
        />

        {/* Contact Information Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Get in Touch
              </h2>
                             <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
                 Multiple ways to reach our support team
               </p>
            </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
               {/* Email Support */}
               <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/30 text-center group hover:border-purple-500/50 transition-all duration-300">
                 <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                   <MailOutlined className="text-2xl" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
                 <p className="text-gray-300 mb-4">Our primary support channel</p>
                 <a 
                   href="mailto:support@avie.live"
                   className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
                 >
                   support@avie.live
                 </a>
               </div>

               {/* Response Time */}
               <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/30 text-center group hover:border-green-500/50 transition-all duration-300">
                 <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white group-hover:scale-110 transition-transform duration-300">
                   <ClockCircleOutlined className="text-2xl" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Response Time</h3>
                 <p className="text-gray-300 mb-4">Typical response within</p>
                 <span className="text-green-400 font-semibold text-lg">24-48 hours</span>
               </div>

               {/* Priority Support */}
               <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-700/30 text-center group hover:border-orange-500/50 transition-all duration-300">
                 <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-white group-hover:scale-110 transition-transform duration-300">
                   <ExclamationCircleOutlined className="text-2xl" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Critical Issues</h3>
                 <p className="text-gray-300 mb-4">Security & critical bugs</p>
                 <span className="text-orange-400 font-semibold">Priority handling</span>
               </div>
             </div>
          </div>
        </section>

        {/* Bug Reporting Encouragement */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-red-900/5 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-red-900/20 via-pink-900/20 to-red-900/20 border border-red-700/30 backdrop-blur-sm">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-pink-600 text-white">
                  <BugOutlined className="text-3xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Help Us Improve AVIE
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Your bug reports are invaluable! Every issue you report helps us create a better experience 
                  for the entire AVIE community. No bug is too small—we want to hear about it all.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-400" />
                    What to Report
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Streaming quality issues</li>
                    <li>• Payment or token-related problems</li>
                    <li>• UI elements not working correctly</li>
                    <li>• Performance and loading issues</li>
                    <li>• Any unexpected behavior</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileTextOutlined className="text-blue-400" />
                    How to Report
                  </h3>
                                     <ul className="space-y-2 text-gray-300">
                     <li>• Email support@avie.live</li>
                     <li>• Message us on Discord</li>
                     <li>• Include detailed steps to reproduce</li>
                     <li>• Attach screenshots if helpful</li>
                     <li>• Mention your browser/device</li>
                     <li>• Include any error messages</li>
                   </ul>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleContactSupport}
                  className="bg-gradient-to-r from-red-600 to-pink-600 border-0 hover:from-red-700 hover:to-pink-700 h-12 px-8 text-lg font-semibold rounded-full text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 hover:scale-105 active:scale-95 mx-auto"
                  aria-label="Report a Bug"
                  tabIndex={0}
                >
                  <BugOutlined /> Report a Bug
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Support Categories */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Support Categories
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
                Choose the category that best matches your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {SUPPORT_CATEGORIES.map((category, index) => (
                <div key={index} className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 group">
                  <div className="flex items-start mb-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-lg bg-gradient-to-br ${category.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                      {React.createElement(category.icon, { className: "text-xl sm:text-2xl" })}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{category.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{category.description}</p>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2 sm:px-0">
                Quick answers to common support questions
              </p>
            </div>

            <div className="space-y-6">
              {FAQ_ITEMS.map((faq, index) => (
                <div key={index} className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                    <QuestionCircleOutlined className="text-blue-400 mt-1 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 leading-relaxed pl-8">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 sm:p-12 md:p-16 rounded-2xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-700/30 backdrop-blur-sm">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Still Need Help?
              </h2>
                             <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
                 Don't hesitate to reach out! Our support team is here to help you make the most of your AVIE experience. 
                 Whether it's a bug, suggestion, or general question—contact us via email or join our Discord community.
               </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleContactSupport}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 hover:from-purple-700 hover:to-blue-700 h-12 px-8 text-lg font-semibold rounded-full text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 hover:scale-105 active:scale-95"
                  aria-label="Contact Support"
                  tabIndex={0}
                >
                  <MailOutlined /> Contact Support
                </button>
                                 <button
                   type="button"
                   onClick={handleJoinDiscord}
                   className="w-full sm:w-auto border border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-indigo-400 h-12 px-8 text-lg rounded-full flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:scale-105 active:scale-95"
                   aria-label="Join Discord Community"
                   tabIndex={0}
                 >
                   <DiscordOutlined /> Join Discord
                 </button>
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

export default SupportPage;

