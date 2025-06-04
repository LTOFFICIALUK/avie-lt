'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { MobileStreamLayout } from '@/components/stream/MobileStreamLayout';
import { DesktopStreamLayout } from '@/components/stream/DesktopStreamLayout';
import { Alert } from 'antd';
import { useSession } from '@/providers/SessionProvider';

interface StreamInfo {
  id: string;
  isLive: boolean;
  startedAt: string | null;
  viewers: number;
  title: string;
  tags?: string[];
}

interface StreamerInfo {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  isStreaming: boolean;
  joinedAt: string;
  socials: any[];
  stats: {
    followers: number;
    following: number;
    videos: number;
  };
  accountHealth?: {
    score: number;
    status: string;
  };
}

interface StreamPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function StreamPage({ params }: StreamPageProps) {
  const { username } = React.use(params);
  const { user } = useSession();
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [streamerInfo, setStreamerInfo] = useState<StreamerInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current user is the streamer
  const isCurrentUserStreamer = user?.displayName === username;

  // Function to check subscription status
  const checkSubscriptionStatus = async () => {
    // Skip subscription check if user is viewing their own stream
    if (isCurrentUserStreamer) {
      setIsSubscribed(false);
      return false;
    }
    
    try {
      const subscriptionResponse = await api.get(`/api/profile/subscribe/status/${username}`);
      setIsSubscribed(subscriptionResponse.data.isSubscribed || false);
      return subscriptionResponse.data.isSubscribed || false;
    } catch (error: any) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
      return false;
    }
  };

  // Function to fetch all required data
  const fetchAllData = async () => {
    try {
      // Fetch stream info
      const streamResponse = await api.get(`/api/stream/${username}`);
      if (streamResponse.data.status === 'success' && streamResponse.data.data) {
        setStreamInfo(streamResponse.data.data);
        
        // If we have a valid stream ID, check like status
        if (streamResponse.data.data.id) {
          const streamId = streamResponse.data.data.id;
          
          const [likeStatusResponse, likeCountResponse] = await Promise.all([
            api.get(`/api/stream/${streamId}/liked`),
            api.get(`/api/stream/${streamId}/likes`)
          ]);
          
          setIsLiked(likeStatusResponse.data.data?.liked || false);
          setLikeCount(likeCountResponse.data.data?.likes || 0);
        }
      } else {
        //
      }
      
      // Fetch streamer info and subscription status in parallel
      const [streamerResponse] = await Promise.all([
        api.get(`/api/profile/${username}`),
        checkSubscriptionStatus() // Use the dedicated function
      ]);
      
      const streamerData = streamerResponse.data.data || streamerResponse.data;
      if (streamerData) {
        setStreamerInfo(streamerData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Handle subscription toggle
  const handleSubscribe = async () => {
    if (!streamerInfo) return;
    
    setIsSubscribing(true);
    try {
      if (isSubscribed) {
        await api.delete(`/api/profile/subscribe/${username}`);
      } else {
        await api.post(`/api/profile/subscribe/${username}`);
      }
      
      // Instead of just toggling the local state, re-fetch the subscription status from server
      // to ensure consistency
      const [streamerResponse] = await Promise.all([
        api.get(`/api/profile/${username}`),
        checkSubscriptionStatus() // Use the dedicated function
      ]);
      
      // Update streamer info to reflect new follower count
      const streamerData = streamerResponse.data.data || streamerResponse.data;
      if (streamerData) {
        setStreamerInfo(streamerData);
      }
      
    } catch (error) {
      console.error('Error updating subscription:', error);
      // On error, re-fetch the current subscription status to ensure UI is accurate
      await checkSubscriptionStatus();
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle like toggle
  const handleLike = async () => {
    if (!streamInfo?.id) return;
    
    // Optimistically update UI
    setIsLiked(!isLiked);
    setLikeCount(prev => !isLiked ? prev + 1 : prev - 1);
    
    try {
      // Make API call in background
      const response = await api.post(`/api/stream/${streamInfo.id}/like`);
      
      // If API call fails, revert the optimistic update
      if (response.data.status !== 'success') {
        setIsLiked(isLiked);
        setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [username]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 text-red-500 border border-red-500/25 mb-4">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full relative md:p-4 pb-16 sm:pb-0">
      <main className="flex-1 w-full">
        {/* Mobile Layout - Only visible on small screens */}
        <MobileStreamLayout 
          username={username}
          streamInfo={streamInfo}
          streamerInfo={streamerInfo}
          isSubscribed={isSubscribed}
          onSubscribe={handleSubscribe}
          isSubscribing={isSubscribing}
          likeCount={likeCount}
          isLiked={isLiked}
          onLike={handleLike}
          isCurrentUserStreamer={isCurrentUserStreamer}
        />
        
        {/* Desktop Layout - Hidden on small screens */}
        <DesktopStreamLayout 
          username={username}
          streamInfo={streamInfo}
          isCurrentUserStreamer={isCurrentUserStreamer}
        />
      </main>
    </div>
  );
} 