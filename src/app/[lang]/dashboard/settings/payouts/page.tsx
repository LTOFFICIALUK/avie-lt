"use client";

import React from "react";
import { FiDollarSign, FiCreditCard, FiPieChart, FiTrendingUp } from "react-icons/fi";

const PayoutsPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center">
          <FiDollarSign className="w-6 h-6 text-emerald-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Payouts</h1>
        </div>
        <p className="text-zinc-400">
          Manage your earnings, withdrawal methods, and payment history.
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <FiDollarSign className="w-12 h-12 text-green-400" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Coming Soon</h3>
            <p className="text-zinc-300 leading-relaxed">
              Our payout system is currently under development. Soon you'll be able to manage your earnings, set up payment methods, and track your revenue history with detailed analytics.
            </p>
          </div>

          {/* Preview Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg mx-auto mb-3">
                <FiCreditCard className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Payment Methods</h4>
              <p className="text-xs text-zinc-400">Add bank accounts, PayPal, and crypto wallets</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mx-auto mb-3">
                <FiPieChart className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Earnings Breakdown</h4>
              <p className="text-xs text-zinc-400">View donations, subscriptions, and ad revenue</p>
            </div>
            
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg mx-auto mb-3">
                <FiTrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-sm font-medium text-white mb-2">Payment History</h4>
              <p className="text-xs text-zinc-400">Track all transactions and withdrawal requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutsPage;
