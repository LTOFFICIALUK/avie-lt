'use client';

import React from 'react';
import { StreamPlayer } from '@/components/stream/StreamPlayer';
import { Chat } from '@/components/stream/chat/Chat';

import { VideoTitle } from '@/components/stream/VideoTitle';
import { Button } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface DesktopStreamLayoutProps {
  username: string;
  streamInfo: {
    id: string;
    isLive: boolean;
    startedAt: string | null;
    viewers: number;
    title: string;
    tags?: string[];
  } | null;
  streamerInfo: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    isVerified: boolean;
    stats: {
      followers: number;
      videos: number;
    };
  } | null;
  isCurrentUserStreamer: boolean;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  isSubscribing?: boolean;
}

export function DesktopStreamLayout({
  username,
  streamInfo,
  streamerInfo,
  isCurrentUserStreamer,
  isSubscribed,
  onSubscribe,
  isSubscribing
}: DesktopStreamLayoutProps) {
  const { lang } = useParams();

  if (!streamInfo) {
    return (
        <div></div>
    );
  }

  return (
    <div className="hidden sm:grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content (Left 2 columns) */}
      <div className="lg:col-span-2 flex flex-col space-y-4">
        {/* Video Player */}
        <StreamPlayer username={username} />
        
        {/* Video Title and Info */}
        <VideoTitle 
          title={streamInfo.title || `${username}'s Live Stream`}
          views={streamInfo.viewers || 0}
          timestamp={streamInfo.startedAt ? new Date(streamInfo.startedAt).toLocaleDateString() : 'Just now'}
          tags={streamInfo.tags || []}
          username={username || ''}
          streamId={streamInfo.id}
          avatarUrl={streamerInfo?.avatarUrl || undefined}
          followerCount={streamerInfo?.stats?.followers || 0}
          videoCount={streamerInfo?.stats?.videos || 0}
          isSubscribed={isSubscribed}
          onSubscribe={onSubscribe}
          isSubscribing={isSubscribing}
        />
        
        {/* Stats Button - Only show if user is live and is the current user's stream */}
        {isCurrentUserStreamer && streamInfo.isLive && (
          <div className="flex justify-end">
            <Link href={`/${lang}/streams/${username}/stats`}>
              <Button 
                type="primary"
                icon={<BarChartOutlined />}
                style={{
                  backgroundColor: 'var(--color-brand)',
                  borderColor: 'var(--color-brand)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'normal',
                  padding: '0 16px',
                  height: '32px'
                }}
              >
                Stream Stats
              </Button>
            </Link>
          </div>
        )}
        

      </div>
      
      {/* Chat (Right column) */}
      <div className="lg:col-span-1 h-[650px] lg:h-auto">
        <div className="h-full sticky top-4">
          <Chat username={username} />
        </div>
      </div>
    </div>
  );
} 