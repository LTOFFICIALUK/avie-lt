"use client";

import React from "react";
import { FiDollarSign, FiGift, FiCreditCard, FiTrendingUp } from "react-icons/fi";

const RevenueAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center">
          <FiDollarSign className="w-6 h-6 text-emerald-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Revenue Analytics</h1>
        </div>
        <p className="text-zinc-400">
          Track your earnings, donations, and monetization performance over time.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <FiDollarSign className="w-12 h-12 text-green-400" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Coming Soon</h3>
            <p className="text-zinc-300 leading-relaxed">
              Revenue analytics will be available in the next update. You'll be able to track donations, subscription revenue, and other earnings with detailed charts and insights to help grow your income.
            </p>
          </div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg mx-auto mb-3">
                <FiGift className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Donations</h4>
              <p className="text-xs text-zinc-400">Track donation amounts and top contributors</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mx-auto mb-3">
                <FiCreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Subscriptions</h4>
              <p className="text-xs text-zinc-400">Recurring revenue and subscriber growth</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/20 rounded-lg mx-auto mb-3">
                <FiTrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Growth Trends</h4>
              <p className="text-xs text-zinc-400">Revenue forecasts and earning patterns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalyticsPage; 