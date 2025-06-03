'use client';

import React, { useEffect, useState } from 'react';
import { UserOutlined, CheckOutlined, DownOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Avatar, Button, Typography } from 'antd';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const { Text, Title } = Typography;

interface AccountSubscribeProps {
  username: string;
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

interface Subscription {
  subscribedTo: {
    displayName: string;
    avatarUrl: string | null;
  };
}

export function AccountSubscribe({ username }: AccountSubscribeProps) {
  const { lang } = useParams();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamerInfo, setStreamerInfo] = useState<StreamerInfo | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [showBio, setShowBio] = useState(false);

  useEffect(() => {
    const fetchStreamerInfo = async () => {
      try {
        // Fetch streamer info
        const streamerResponse = await api.get(`/api/profile/${username}`);
        
        // Make sure we're getting data from the API response correctly
        console.log('API response:', streamerResponse.data);
        
        // Handle the case where data might be nested inside a data property
        const streamerData = streamerResponse.data.data || streamerResponse.data;
        
        if (!streamerData) {
          console.error('No streamer data found in response');
          return;
        }
        
        setStreamerInfo(streamerData);
        
        // Safely access stats.followers
        if (streamerData.stats && typeof streamerData.stats.followers === 'number') {
          setSubscriberCount(streamerData.stats.followers);
        } else {
          console.warn('Followers count not available or invalid');
          setSubscriberCount(0);
        }
        
        // Safely access stats.videos
        if (streamerData.stats && typeof streamerData.stats.videos === 'number') {
          setVideoCount(streamerData.stats.videos);
        } else {
          console.warn('Video count not available or invalid');
          setVideoCount(0);
        }
        
        // Check subscription status with proper API call
        try {
          const statusResponse = await api.get(`/api/profile/subscribe/status/${username}`);
          setIsSubscribed(statusResponse.data.isSubscribed);
        } catch (error: any) {
          console.error('Error checking subscription status:', error);
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error('Error fetching streamer info:', error);
      }
    };

    fetchStreamerInfo();
  }, [username]);

  const handleSubscribe = async () => {
    if (!streamerInfo) return;
    
    setIsLoading(true);
    try {
      if (isSubscribed) {
        await api.delete(`/api/profile/subscribe/${username}`);
        setSubscriberCount(prev => prev - 1);
      } else {
        await api.post(`/api/profile/subscribe/${username}`);
        setSubscriberCount(prev => prev + 1);
      }
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!streamerInfo) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-secondary border-none shadow-lg rounded-xl">
      <div className="flex items-start gap-3 w-full">
        {/* Avatar with Link */}
        <Link 
          href={`/${lang}/profile/${username}`} 
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Avatar
            size={48}
            icon={!streamerInfo.avatarUrl && <UserOutlined />}
            src={streamerInfo.avatarUrl || undefined}
            style={{ 
              backgroundColor: 'var(--color-gray)',
              border: '1px solid var(--color-brand)',
            }}
          />
        </Link>

        <div className="flex-1 min-w-0">
          {/* Name and badge in same row */}
          <div className="flex items-center gap-2">
            <Link 
              href={`/${lang}/profile/${username}`}
              className="hover:opacity-80 transition-opacity"
            >
              <Title level={5} style={{ margin: 0, color: '#ffffff', cursor: 'pointer' }}>
                {streamerInfo.displayName}
              </Title>
            </Link>
            {streamerInfo.isVerified && (
              <div className="bg-[#00ffff]/5 border border-[#00ffff]/20 text-[#00ffff] text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                <CheckOutlined style={{ fontSize: '12px' }} />
                <span>Verified</span>
              </div>
            )}
          </div>

          {/* Stats - Only show on larger screens */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-400">
            <Text style={{ color: 'var(--text-secondary)' }}>{subscriberCount.toLocaleString()} followers</Text>
            <Text style={{ color: 'var(--text-secondary)' }}>•</Text>
            <Text style={{ color: 'var(--text-secondary)' }}>{videoCount} videos</Text>
          </div>
          
          {/* Action buttons - Only visible on small screens */}
          <div className="flex sm:hidden items-center gap-2 mt-1">
            <Button
              type="text"
              style={{
                height: '24px',
                backgroundColor: 'var(--color-gray)',
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: '20px',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 'normal',
                padding: '0 8px'
              }}
            >
              Message
            </Button>
            <Button
              onClick={handleSubscribe}
              loading={isLoading}
              type={isSubscribed ? "text" : "primary"}
              style={{
                height: '24px',
                backgroundColor: isSubscribed ? 'var(--color-gray)' : undefined,
                borderColor: isSubscribed ? 'rgba(255,255,255,0.2)' : undefined,
                borderRadius: '20px',
                color: isSubscribed ? '#ffffff' : undefined,
                fontSize: '11px',
                fontWeight: 'normal',
                padding: '0 8px'
              }}
            >
              {isSubscribed ? "Following" : "Follow"}
            </Button>
          </div>

          {/* Bio with slide down animation */}
          <div className="mt-2">
            <Button 
              type="text"
              size="small"
              onClick={() => setShowBio(!showBio)}
              icon={<DownOutlined className={cn(
                "transition-transform duration-200",
                showBio && "rotate-180"
              )} />}
              style={{ color: 'rgba(255, 255, 255, 0.45)', padding: '0', height: 'auto' }}
            >
              <Text style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Channel bio
              </Text>
            </Button>
            <div className={cn(
              "overflow-hidden transition-all duration-200",
              showBio ? "max-h-20 mt-2" : "max-h-0"
            )}>
              <div className="p-1">
                <Text style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {streamerInfo.bio || 'No bio available'}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons for larger screens */}
      <div className="hidden sm:flex items-center gap-2 shrink-0 mt-3 sm:mt-0 w-full sm:w-auto">
        <Button
          type="text"
          style={{
            height: '28px',
            backgroundColor: 'var(--color-gray)',
            borderColor: 'rgba(255,255,255,0.2)',
            borderRadius: '20px',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 'normal',
            padding: '0 12px'
          }}
        >
          Message
        </Button>
        <Button
          onClick={handleSubscribe}
          loading={isLoading}
          type={isSubscribed ? "text" : "primary"}
          style={{
            height: '28px',
            backgroundColor: isSubscribed ? 'var(--color-gray)' : undefined,
            borderColor: isSubscribed ? 'rgba(255,255,255,0.2)' : undefined,
            borderRadius: '20px',
            color: isSubscribed ? '#ffffff' : undefined,
            fontSize: '12px',
            fontWeight: 'normal',
            padding: '0 12px'
          }}
        >
          {isSubscribed ? "Following" : "Follow"}
        </Button>
      </div>
    </div>
  );
} 