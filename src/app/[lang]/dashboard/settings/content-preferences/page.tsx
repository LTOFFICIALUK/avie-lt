"use client";

import React from "react";
import { FiSettings, FiFilter, FiEyeOff, FiVolume2 } from "react-icons/fi";

const ContentPreferencesPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center">
          <FiSettings className="w-6 h-6 text-emerald-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Content Preferences</h1>
        </div>
        <p className="text-zinc-400">
          Customize your content experience with personalized filters and preferences.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
            <FiSettings className="w-12 h-12 text-purple-400" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Coming Soon</h3>
            <p className="text-zinc-300 leading-relaxed">
              Content preference controls are currently in development. Soon you'll be able to customize your viewing experience with advanced content filters and personalization options.
            </p>
          </div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg mx-auto mb-3">
                <FiFilter className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Content Filters</h4>
              <p className="text-xs text-zinc-400">Filter streams by categories, languages, and content ratings</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-red-500/20 rounded-lg mx-auto mb-3">
                <FiEyeOff className="w-5 h-5 text-red-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Block Content</h4>
              <p className="text-xs text-zinc-400">Hide specific content types or block certain streamers</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mx-auto mb-3">
                <FiVolume2 className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Audio Preferences</h4>
              <p className="text-xs text-zinc-400">Control auto-play and default volume settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPreferencesPage;
