"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  FiVideo,
  FiClock,
  FiEye,
  FiTrendingUp
} from "react-icons/fi";

interface AnalyticsData {
  totalStreams: number;
  streamTime: number; // in hours
  totalViews: number;
  apRewards: number;
}

const AnalyticsOverview = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalStreams: 0,
    streamTime: 0,
    totalViews: 0,
    apRewards: 0,
  });
  const [loading, setLoading] = useState(true);

  const formatNumber = (number: number): string => {
    if (number > 1000000) return (number / 1000000).toFixed(1) + "M";
    else if (number > 1000) return (number / 1000).toFixed(1) + "K";
    else return number.toString();
  };

  const formatStreamTime = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours.toFixed(1)}h`;
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // This would typically fetch from your analytics API
        const response = await api.get("/api/analytics/overview");
        
        if (response.data) {
          setData({
            totalStreams: response.data.totalStreams || 0,
            streamTime: response.data.streamTime || 0,
            totalViews: response.data.totalViews || 0,
            apRewards: response.data.apRewards || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching analytics overview:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const StatCard = ({ 
    label, 
    value, 
    icon: Icon, 
    color = "text-emerald-400",
    tooltip 
  }: {
    label: string;
    value: string | number;
    icon: any;
    color?: string;
    tooltip?: string;
  }) => (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-zinc-800 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {tooltip && (
          <div className="text-xs text-zinc-500" title={tooltip}>
            ?
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className="text-sm text-zinc-400">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Total Streams"
        value={loading ? "..." : data.totalStreams}
        icon={FiVideo}
        color="text-purple-400"
      />
      <StatCard
        label="Stream Time"
        value={loading ? "..." : formatStreamTime(data.streamTime)}
        icon={FiClock}
        color="text-blue-400"
      />
      <StatCard
        label="Total Views"
        value={loading ? "..." : formatNumber(data.totalViews)}
        icon={FiEye}
        color="text-green-400"
      />
      <StatCard
        label="AP Rewards"
        value={loading ? "..." : data.apRewards.toFixed(1)}
        icon={FiTrendingUp}
        color="text-orange-400"
      />
    </div>
  );
};

export default AnalyticsOverview; 