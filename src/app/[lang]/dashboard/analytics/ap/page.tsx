"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  FiTrendingUp, 
  FiEye,
  FiVideo,
  FiBarChart,
  FiUsers
} from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";
import { UserXP, LeaderboardEntry } from "@/types/xp";

const APAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [userXP, setUserXP] = useState<UserXP | null>(null);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('weekly');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user's XP data
        const userXPResponse = await api.get("/api/xp/my-xp");
        setUserXP(userXPResponse.data.data.userXP);
        
        // Fetch weekly leaderboard
        const weeklyResponse = await api.get("/api/xp/leaderboard/weekly?limit=10");
        setWeeklyLeaderboard(weeklyResponse.data.data.leaderboard);
        
        // Fetch all-time leaderboard
        const allTimeResponse = await api.get("/api/xp/leaderboard/all-time?limit=10");
        setAllTimeLeaderboard(allTimeResponse.data.data.leaderboard);
      } catch (err) {
        console.error("Error fetching AP data:", err);
        setError("Failed to load AP data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate viewer/streamer XP totals
  const viewerXP = userXP ? 
    userXP.breakdown.chatXP + 
    userXP.breakdown.watchTimeXP + 
    userXP.breakdown.likedStreamsXP + 
    userXP.breakdown.donationsXP : 0;
    
  const streamerXP = userXP ? 
    userXP.breakdown.uniqueViewersXP + 
    userXP.breakdown.newFollowersXP + 
    userXP.breakdown.streamChatXP + 
    userXP.breakdown.streamTimeXP : 0;

  const StatCard = ({ 
    label, 
    value, 
    icon: Icon, 
    color = "text-emerald-400",
    tooltip 
  }: {
    label: string;
    value: number;
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
        <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        <p className="text-sm text-zinc-400">{label}</p>
      </div>
    </div>
  );

  const SourceBreakdownCard = () => {
    if (!userXP) return null;

    const sources = [
      { label: "Watch Time", value: userXP.breakdown.watchTimeXP, color: "bg-blue-500" },
      { label: "Chat Messages", value: userXP.breakdown.chatXP, color: "bg-green-500" },
      { label: "Stream Time", value: userXP.breakdown.streamTimeXP, color: "bg-purple-500" },
      { label: "Unique Viewers", value: userXP.breakdown.uniqueViewersXP, color: "bg-orange-500" },
      { label: "New Followers", value: userXP.breakdown.newFollowersXP, color: "bg-pink-500" },
      { label: "Donations", value: userXP.breakdown.donationsXP, color: "bg-yellow-500" },
      { label: "Liked Streams", value: userXP.breakdown.likedStreamsXP, color: "bg-teal-500" },
      { label: "Stream Chat", value: userXP.breakdown.streamChatXP, color: "bg-red-500" },
    ].filter(source => source.value > 0);

    const total = sources.reduce((sum, source) => sum + source.value, 0);

    return (
      <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center mb-4">
          <FiBarChart className="w-5 h-5 text-emerald-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">AP Sources Breakdown</h3>
        </div>
        <div className="space-y-3">
          {sources.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${source.color}`} />
                <span className="text-sm text-zinc-300">{source.label}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{source.value.toLocaleString()}</p>
                <p className="text-xs text-zinc-500">{((source.value / total) * 100).toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LeaderboardCard = () => {
    const currentData = activeTab === 'weekly' ? weeklyLeaderboard : allTimeLeaderboard;

    return (
      <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiUsers className="w-5 h-5 text-emerald-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">AP Leaderboard</h3>
          </div>
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                activeTab === 'weekly' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setActiveTab('alltime')}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                activeTab === 'alltime' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        
        {userXP?.weeklyRank && activeTab === 'weekly' && (
          <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <p className="text-sm text-zinc-300">
              Your Rank: <span className="text-emerald-400 font-medium">#{userXP.weeklyRank}</span>
            </p>
          </div>
        )}

        <div className="space-y-2">
          {currentData.slice(0, 10).map((entry, index) => (
            <div key={entry.userId} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index < 3 
                    ? index === 0 ? 'bg-yellow-500 text-black' 
                      : index === 1 ? 'bg-gray-400 text-black'
                      : 'bg-amber-600 text-black'
                    : 'bg-zinc-700 text-zinc-300'
                }`}>
                  {index + 1}
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                  <span className="text-xs font-medium text-zinc-300">
                    {entry.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-zinc-200">{entry.displayName}</span>
              </div>
              <span className="text-sm font-medium text-emerald-400">
                {entry.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          <p className="text-zinc-400">Loading AP Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <GiTrophy className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Error Loading Data</h3>
            <p className="text-zinc-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userXP) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
            <GiTrophy className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">No AP Data Yet</h3>
            <p className="text-zinc-400">
              You haven't earned any AP yet. Start watching streams, chatting, and interacting to earn AP!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center">
          <GiTrophy className="w-6 h-6 text-emerald-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">AP Analytics</h1>
        </div>
        <p className="text-zinc-400">
          Track your progress, see where your AP comes from, and compare yourself to other users.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total AP"
          value={userXP.totalXP}
          icon={GiTrophy}
          color="text-emerald-400"
        />
        <StatCard
          label="This Week"
          value={userXP.currentWeekXP}
          icon={FiTrendingUp}
          color="text-blue-400"
        />
        <StatCard
          label="Viewer AP"
          value={viewerXP}
          icon={FiEye}
          color="text-purple-400"
          tooltip="AP earned from watching streams, chatting, liking and donating"
        />
        <StatCard
          label="Streamer AP"
          value={streamerXP}
          icon={FiVideo}
          color="text-orange-400"
          tooltip="AP earned from streaming, unique viewers, new followers and stream chat"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SourceBreakdownCard />
        <LeaderboardCard />
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 rounded-xl p-6 border border-emerald-800/30">
        <div className="flex items-center mb-4">
          <GiTrophy className="w-5 h-5 text-emerald-400 mr-2" />
          <h3 className="text-lg font-semibold text-white">About the AP System</h3>
        </div>
        <div className="space-y-4">
          <p className="text-zinc-300 text-sm leading-relaxed">
            The AVIE POINTS system rewards users for their engagement and activity on the platform.
            You can earn AP in various ways:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-emerald-400">Viewer Activities</h4>
              <ul className="space-y-1 text-xs text-zinc-300">
                <li>• Watching streams (time-based rewards)</li>
                <li>• Chatting in streams</li>
                <li>• Liking streams</li>
                <li>• Making donations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-orange-400">Streamer Activities</h4>
              <ul className="space-y-1 text-xs text-zinc-300">
                <li>• Streaming (broadcast time)</li>
                <li>• Getting unique viewers</li>
                <li>• Gaining new followers</li>
                <li>• Receiving chat messages</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            AP rankings reset weekly, but your total AP accumulates over time. Higher AP levels unlock
            special platform features and recognition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default APAnalyticsPage;
