// src/app/[lang]/dashboard/page.tsx
"use client"; // Ensure this is a client component
import React, { useState, useEffect } from "react";
import { useSession } from "@/providers/SessionProvider"; // Import session provider
import { Button, Avatar, Typography, Divider, Spin, Alert } from "antd";
import { UserOutlined, CheckCircleOutlined, EyeOutlined, TeamOutlined, VideoCameraOutlined, DollarOutlined } from "@ant-design/icons";
import Link from "next/link";
import { api } from "@/lib/api";
import { Videos } from "@/types/videos";
import VideoCard from "../profile/(components)/VideoCard";

const { Title, Text } = Typography;

interface DashboardAnalytics {
  views: number;
  followers: number;
  liveStreams: number;
  revenue: number;
}

const DashboardPage = ({ params }: { params: { lang: string } }) => {
  const { user } = useSession(); // Get user data from session
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streams, setStreams] = useState<Videos | undefined>();
  const [loadingStreams, setLoadingStreams] = useState(true);
  const [streamsError, setStreamsError] = useState<string>("");

  const formatNumber = (number: number): string => {
    if (number > 1000000) return (number / 1000000).toFixed(1) + "M";
    else if (number > 1000) return (number / 1000).toFixed(1) + "K";
    else return number.toString();
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch stream stats similar to analytics pages
        const streamStatsResponse = await api.get("/api/analytics/stream-stats?timeRange=30d");
        
        // Extract relevant data or set defaults
        const streamStats = streamStatsResponse.data || {};
        
        setAnalytics({
          views: streamStats.viewers?.total || 0,
          followers: streamStats.subscribers || 0,
          liveStreams: streamStats.streams?.count || 0,
          revenue: 0 // This would come from revenue analytics API
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        // Set default values on error
        setAnalytics({
          views: 0,
          followers: 0,
          liveStreams: 0,
          revenue: 0
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchRecentStreams = async () => {
      if (user?.displayName) {
        try {
          setLoadingStreams(true);
          const response = await api.get(
            `/api/stream/videos/${user.displayName}`
          );

          if (response.data.status === "success" && response.data.data) {
            setStreams(response.data.data);
          } else {
            setStreamsError("Failed to load streams");
          }
        } catch (err) {
          console.error("Error fetching streams:", err);
          setStreamsError("Failed to load streams");
        } finally {
          setLoadingStreams(false);
        }
      } else {
        setLoadingStreams(false);
      }
    };

    fetchRecentStreams();
  }, [user?.displayName]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <div className="container mx-auto px-4 pt-8">
        {/* Page Header */}
        <div className="mb-8">
          <Title level={1} className="!text-white !mb-2">Dashboard</Title>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1A1A1A] rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                size={120}
                src={user?.avatarUrl}
                icon={!user?.avatarUrl && <UserOutlined />}
                className="border-4 border-pink-500"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <Title level={2} className="!text-white !mb-0">
                  {user?.displayName ? `@${user.displayName}` : "Streamguy AI"}
                </Title>
                <CheckCircleOutlined className="text-pink-500 text-xl" />
              </div>
              
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4 text-gray-400">
                <span>{analytics ? formatNumber(analytics.followers) : "0"} followers</span>
                <span>•</span>
                <span>{analytics ? formatNumber(analytics.liveStreams) : "0"} videos</span>
              </div>

              <Text className="text-gray-300 block mb-6">
                {user?.bio || "StreamGuy is the visionary behind AVIE and architect of $LIVE. Recognizing engagement as the lifeblood of creative culture, he built $LIVE V2 to reward participation, deepen audience connections, and empower creators."}
              </Text>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center md:justify-start">
                <Link href={`/${params.lang}/dashboard/plugins/stream`}>
                  <Button 
                    type="primary" 
                    size="large"
                    className="bg-purple-600 hover:bg-purple-700 border-purple-600 px-8"
                  >
                    Go Live
                  </Button>
                </Link>
                <Link href={`/${params.lang}/dashboard/settings`}>
                  <Button 
                    size="large"
                    className="bg-gray-700 hover:bg-gray-600 text-white border-gray-700 px-8"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              {/* Social media icons would go here */}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <Title level={3} className="!text-white mb-6">Analytics</Title>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : error ? (
            <Alert
              message="Error Loading Analytics"
              description={error}
              type="error"
              showIcon
              className="mb-6"
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-[#1A1A1A] p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <EyeOutlined className="text-purple-500 text-xl" />
                  <Text className="text-gray-400">Views</Text>
                </div>
                <Title level={2} className="!text-white !mb-1">{analytics ? formatNumber(analytics.views) : "0"}</Title>
                <Text className="text-green-500 text-sm">+20.9 from last month</Text>
              </div>
              <div className="bg-[#1A1A1A] p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <TeamOutlined className="text-purple-500 text-xl" />
                  <Text className="text-gray-400">Followers</Text>
                </div>
                <Title level={2} className="!text-white !mb-1">{analytics ? formatNumber(analytics.followers) : "0"}</Title>
                <Text className="text-green-500 text-sm">+20.9 from last month</Text>
              </div>
              <div className="bg-[#1A1A1A] p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <VideoCameraOutlined className="text-purple-500 text-xl" />
                  <Text className="text-gray-400">Live Streams</Text>
                </div>
                <Title level={2} className="!text-white !mb-1">{analytics ? analytics.liveStreams : "0"}</Title>
                <Text className="text-green-500 text-sm">+20.9 from last month</Text>
              </div>
              <div className="bg-[#1A1A1A] p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <DollarOutlined className="text-purple-500 text-xl" />
                  <Text className="text-gray-400">Revenue</Text>
                </div>
                <Title level={2} className="!text-white !mb-1">{analytics ? formatNumber(analytics.revenue) : "0"} $AVIE</Title>
                <Text className="text-green-500 text-sm">+20.9 from last month</Text>
              </div>
            </div>
          )}
        </div>

        {/* Previous Streams Section */}
        <div className="mb-8">
          <Title level={3} className="!text-white mb-6">Previous Streams</Title>
          {loadingStreams ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : streamsError ? (
            <div className="text-red-500 text-center py-8">{streamsError}</div>
          ) : streams && streams.videos && streams.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {streams.videos.slice(0, 5).map((video) => (
                <VideoCard key={video.vodUrl} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-[var(--text-secondary)] text-center py-8 border border-[var(--color-gray)]/20 rounded-md">
              No previous streams available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;