"use client";

import React from "react";
import { FiStar, FiZap, FiGift } from "react-icons/fi";
import { GiCrown } from "react-icons/gi";

const SubscriptionsPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center">
          <GiCrown className="w-6 h-6 text-emerald-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        </div>
        <p className="text-zinc-400">
          Manage your subscriptions and unlock premium features with our subscription plans.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
            <GiCrown className="w-12 h-12 text-yellow-400" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Coming Soon</h3>
            <p className="text-zinc-300 leading-relaxed">
              Our premium subscription services are currently under development. Stay tuned for early access and special launch offers!
            </p>
          </div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/20 rounded-lg mx-auto mb-3">
                <FiStar className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Premium Features</h4>
              <p className="text-xs text-zinc-400">Unlock advanced streaming tools and exclusive content</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mx-auto mb-3">
                <FiZap className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Enhanced Analytics</h4>
              <p className="text-xs text-zinc-400">Access detailed insights and performance metrics</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg mx-auto mb-3">
                <FiGift className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Exclusive Perks</h4>
              <p className="text-xs text-zinc-400">Special badges, priority support, and early access</p>
            </div>
          </div>

          {/* Special Notice */}
          <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 rounded-xl p-6 border border-yellow-800/30 mt-8">
            <div className="flex items-center justify-center mb-4">
              <GiCrown className="w-6 h-6 text-yellow-400 mr-2" />
              <h4 className="text-lg font-semibold text-white">Early Access Program</h4>
            </div>
            <p className="text-sm text-zinc-300 text-center mb-4">
              Be among the first to experience our premium features when they launch.
            </p>
            <button 
              disabled
              className="w-full px-6 py-2 bg-zinc-700 text-zinc-400 rounded-lg cursor-not-allowed"
            >
              Join Waitlist (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
