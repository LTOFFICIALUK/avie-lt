"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  FiClock, 
  FiUsers, 
  FiVideo,
  FiHeart,
  FiUserPlus,
  FiBarChart,
  FiEye
} from "react-icons/fi";

interface StreamStatsData {
  timeRange: string;
  subscribers: number;
  streams: {
    count: number;
    totalHours: number;
    totalMinutes: number;
    averageViewers: number;
  };
  viewers: {
    total: number;
    average: number;
  };
  watchTime: {
    totalSeconds: number;
    totalHours: number;
    totalMinutes: number;
  };
  likes: number;
}

const StreamStatsPage = () => {
  const [stats, setStats] = useState<StreamStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("7d");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/api/analytics/stream-stats?timeRange=${timeRange}`);
        if (response.data) {
          setStats(response.data);
        } else {
          setError("Failed to load stream statistics");
        }
      } catch (err) {
        console.error("Error fetching stream stats:", err);
        setError("Failed to load stream statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [timeRange]);

  const formatTime = (hours: number, minutes: number) => {
    return `${hours}h ${minutes}m`;
  };

  const StatCard = ({ 
    label, 
    value, 
    icon: Icon, 
    color = "text-emerald-400" 
  }: {
    label: string;
    value: string | number;
    icon: any;
    color?: string;
  }) => (
    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-zinc-800 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className="text-sm text-zinc-400">{label}</p>
      </div>
    </div>
  );

  const MetricBar = ({ 
    label, 
    value, 
    displayValue, 
    maxValue = 100, 
    color = "bg-emerald-500" 
  }: {
    label: string;
    value: number;
    displayValue: string;
    maxValue?: number;
    color?: string;
  }) => {
    const percentage = Math.min(100, (value / maxValue) * 100);
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-300">{label}</span>
          <span className="text-emerald-400 font-medium">{displayValue}</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div 
            className={`${color} h-2 rounded-full transition-all duration-300`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          <p className="text-zinc-400">Loading Stream Statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <FiVideo className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Data</h3>
            <p className="text-zinc-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
            <FiVideo className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">No Stream Data</h3>
            <p className="text-zinc-400">
              You haven't streamed yet or there's no data available for the selected time period.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const watchHoursPerStream = stats.streams.count > 0 
    ? Math.round((stats.watchTime.totalHours + (stats.watchTime.totalMinutes / 60)) / stats.streams.count * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center">
            <FiVideo className="w-6 h-6 text-emerald-400 mr-3" />
            <h1 className="text-2xl font-bold text-white">Stream Statistics</h1>
          </div>
          <p className="text-zinc-400">
            Analyze your stream performance with detailed statistics and metrics.
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-zinc-800 rounded-lg p-1">
          {[
            { value: "24h", label: "Last 24h" },
            { value: "7d", label: "Last 7d" },
            { value: "30d", label: "Last 30d" },
            { value: "all", label: "All time" }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                timeRange === option.value 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Streams"
          value={stats.streams.count}
          icon={FiVideo}
          color="text-blue-400"
        />
        <StatCard
          label="Total Stream Time"
          value={formatTime(stats.streams.totalHours, stats.streams.totalMinutes)}
          icon={FiClock}
          color="text-purple-400"
        />
        <StatCard
          label="New Subscribers"
          value={stats.subscribers}
          icon={FiUserPlus}
          color="text-green-400"
        />
        <StatCard
          label="Total Likes"
          value={stats.likes}
          icon={FiHeart}
          color="text-red-400"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Analytics */}
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center mb-6">
            <FiUsers className="w-5 h-5 text-emerald-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Audience</h3>
          </div>
          <div className="space-y-4">
            <MetricBar
              label="Average Viewers"
              value={stats.viewers.average}
              displayValue={stats.viewers.average.toString()}
              maxValue={200}
              color="bg-blue-500"
            />
            <MetricBar
              label="Total Viewers"
              value={stats.viewers.total}
              displayValue={stats.viewers.total.toString()}
              maxValue={1000}
              color="bg-purple-500"
            />
            <MetricBar
              label="Likes per Stream"
              value={stats.streams.count > 0 ? stats.likes / stats.streams.count : 0}
              displayValue={stats.streams.count > 0 ? (stats.likes / stats.streams.count).toFixed(1) : '0'}
              maxValue={10}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Watch Time Analytics */}
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center mb-6">
            <FiEye className="w-5 h-5 text-emerald-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Watch Time</h3>
          </div>
          <div className="space-y-4">
            <MetricBar
              label="Total Watch Time"
              value={stats.watchTime.totalHours}
              displayValue={formatTime(stats.watchTime.totalHours, stats.watchTime.totalMinutes)}
              maxValue={100}
              color="bg-emerald-500"
            />
            <MetricBar
              label="Watch Hours per Stream"
              value={watchHoursPerStream}
              displayValue={`${watchHoursPerStream}h`}
              maxValue={10}
              color="bg-orange-500"
            />
            <MetricBar
              label="Average Watch Duration"
              value={stats.viewers.total > 0 ? (stats.watchTime.totalSeconds / stats.viewers.total) / 60 : 0}
              displayValue={stats.viewers.total > 0 
                ? `${Math.floor((stats.watchTime.totalSeconds / stats.viewers.total) / 60)}m ${Math.floor((stats.watchTime.totalSeconds / stats.viewers.total) % 60)}s` 
                : '0m 0s'}
              maxValue={60}
              color="bg-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl p-6 border border-blue-800/30">
        <div className="flex items-center mb-4">
          <FiBarChart className="w-5 h-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">Understanding Your Metrics</h3>
        </div>
        <div className="space-y-4">
          <p className="text-zinc-300 text-sm leading-relaxed">
            These statistics help you understand your stream's performance and audience engagement:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-400">Core Metrics</h4>
              <ul className="space-y-1 text-xs text-zinc-300">
                <li>• <strong>Total Streams:</strong> Number of streams in the selected period</li>
                <li>• <strong>Stream Time:</strong> Total time spent streaming</li>
                <li>• <strong>New Subscribers:</strong> Followers gained during this period</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-emerald-400">Engagement Insights</h4>
              <ul className="space-y-1 text-xs text-zinc-300">
                <li>• <strong>Watch Time:</strong> Total viewer hours across all streams</li>
                <li>• <strong>Average Viewers:</strong> Mean concurrent viewers per stream</li>
                <li>• <strong>Likes:</strong> Total stream likes and reactions</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Use these insights to optimize your streaming schedule, content, and engagement strategies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreamStatsPage; 