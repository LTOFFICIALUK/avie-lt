"use client";

import React from "react";
import { FiHeart, FiMessageCircle, FiActivity, FiTarget } from "react-icons/fi";

const EngagementAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center">
          <FiActivity className="w-6 h-6 text-emerald-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Engagement Analytics</h1>
        </div>
        <p className="text-zinc-400">
          Track viewer interactions and engagement metrics to improve your content.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto">
            <FiActivity className="w-12 h-12 text-pink-400" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Coming Soon</h3>
            <p className="text-zinc-300 leading-relaxed">
              Engagement analytics will be available in the next update. You'll be able to track chat activity, likes, donations, viewer retention, and more to help optimize your content strategy.
            </p>
          </div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-pink-500/20 rounded-lg mx-auto mb-3">
                <FiMessageCircle className="w-5 h-5 text-pink-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Chat Activity</h4>
              <p className="text-xs text-zinc-400">Messages per minute and chat engagement rates</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-red-500/20 rounded-lg mx-auto mb-3">
                <FiHeart className="w-5 h-5 text-red-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Likes & Reactions</h4>
              <p className="text-xs text-zinc-400">Stream likes and viewer reaction analytics</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-lg mx-auto mb-3">
                <FiTarget className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Retention Metrics</h4>
              <p className="text-xs text-zinc-400">Viewer drop-off rates and engagement peaks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementAnalyticsPage; 