"use client";

import React from "react";
import { FiUsers, FiClock, FiTrendingUp } from "react-icons/fi";

const AudienceAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center">
          <FiUsers className="w-6 h-6 text-emerald-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Audience Analytics</h1>
        </div>
        <p className="text-zinc-400">
          Understand your viewers with detailed demographic and engagement insights.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <FiUsers className="w-12 h-12 text-blue-400" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Coming Soon</h3>
            <p className="text-zinc-300 leading-relaxed">
              Audience analytics features will be available in the next update. Soon you'll be able to view detailed demographics, watch patterns, and engagement metrics for your viewers.
            </p>
          </div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mx-auto mb-3">
                <FiUsers className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Demographics</h4>
              <p className="text-xs text-zinc-400">Age, location, and viewer preferences breakdown</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg mx-auto mb-3">
                <FiClock className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Watch Patterns</h4>
              <p className="text-xs text-zinc-400">Peak viewing times and session duration insights</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg mx-auto mb-3">
                <FiTrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Growth Metrics</h4>
              <p className="text-xs text-zinc-400">Follower growth and retention analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudienceAnalyticsPage; 