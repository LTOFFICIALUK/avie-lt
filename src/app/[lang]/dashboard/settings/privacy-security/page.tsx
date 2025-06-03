"use client";

import React from "react";
import { FiShield, FiLock, FiEye, FiUserX } from "react-icons/fi";

const PrivacySecurityPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center">
          <FiShield className="w-6 h-6 text-emerald-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Privacy & Security</h1>
        </div>
        <p className="text-zinc-400">
          Control your account security, privacy settings, and data management.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <FiShield className="w-12 h-12 text-blue-400" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Coming Soon</h3>
            <p className="text-zinc-300 leading-relaxed">
              Advanced privacy and security controls are in development. Soon you'll have comprehensive tools to manage your account security, privacy preferences, and data control.
            </p>
          </div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mx-auto mb-3">
                <FiLock className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Account Security</h4>
              <p className="text-xs text-zinc-400">Two-factor auth, password management, and login history</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg mx-auto mb-3">
                <FiEye className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Privacy Controls</h4>
              <p className="text-xs text-zinc-400">Profile visibility, data sharing, and tracking preferences</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-red-500/20 rounded-lg mx-auto mb-3">
                <FiUserX className="w-5 h-5 text-red-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Block & Report</h4>
              <p className="text-xs text-zinc-400">User blocking, harassment reporting, and safety tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
