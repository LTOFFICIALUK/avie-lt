"use client";

import React, { useState } from "react";
import { StreamPlayer } from "./StreamPlayer";
import { MobileAccountSubscribe } from "./MobileAccountSubscribe";
import { MobileDonationButton } from "./MobileDonationButton";
import { MobileVideoInfo } from "./MobileVideoInfo";
import { Chat } from "./chat/Chat";
import { Typography, Divider, Button } from "antd";
import { UpOutlined, DownOutlined, BarChartOutlined } from "@ant-design/icons";
import { useParams } from 'next/navigation';
import Link from 'next/link';

const { Text } = Typography;

interface MobileStreamLayoutProps {
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
  isSubscribed: boolean;
  onSubscribe: () => void;
  isSubscribing: boolean;
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
  isCurrentUserStreamer: boolean;
}

export function MobileStreamLayout({
  username,
  streamInfo,
  streamerInfo,
  isSubscribed,
  onSubscribe,
  isSubscribing,
  likeCount,
  isLiked,
  onLike,
  isCurrentUserStreamer,
}: MobileStreamLayoutProps) {
  const [infoExpanded, setInfoExpanded] = useState(true);
  const { lang } = useParams();

  if (!streamInfo) {
    return (
        <div></div>
    );
  }

  // Format stream duration if startedAt exists
  const formatStreamDuration = () => {
    if (!streamInfo.startedAt) return "Just started";

    const startTime = new Date(streamInfo.startedAt).getTime();
    const currentTime = new Date().getTime();
    const durationMs = currentTime - startTime;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="flex flex-col w-full sm:hidden h-[100svh] overflow-hidden bg-[var(--color-background)]">
      {/* Upper section - Fixed content */}
      <div className="flex-none">
        {/* Video Player */}
        <div className="w-full">
          <StreamPlayer username={username} />
        </div>

        {/* Collapse/Expand toggle button */}
        <div className="px-4 py-2 flex justify-center">
          <Button 
            type="text"
            icon={infoExpanded ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setInfoExpanded(!infoExpanded)}
            className="text-white opacity-80 hover:opacity-100"
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              fontSize: '12px',
              padding: '0 12px'
            }}
          >
            {infoExpanded ? 'Hide details' : 'Show details'}
          </Button>
        </div>

        {/* Collapsible content */}
        <div className={`transition-all duration-300 overflow-hidden ${infoExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Donation Button - Standalone below video */}
          <div className="mt-1 px-4">
            <MobileDonationButton username={username} />
          </div>

          {/* Stats Button - Only show if user is live and is the current user's stream */}
          {isCurrentUserStreamer && streamInfo.isLive && (
            <div className="mt-3 px-4">
              <Link href={`/${lang}/streams/${username}/stats`}>
                <Button 
                  type="primary"
                  icon={<BarChartOutlined />}
                  block
                  style={{
                    backgroundColor: 'var(--color-brand)',
                    borderColor: 'var(--color-brand)',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'normal',
                    height: '36px'
                  }}
                >
                  View Stream Stats
                </Button>
              </Link>
            </div>
          )}

          {/* Streamer info with title and stream stats */}
          <div className="mt-4 px-4">
            <MobileAccountSubscribe
              username={username}
              streamerInfo={streamerInfo}
              streamTitle={streamInfo.title || ""}
              streamDuration={formatStreamDuration()}
              viewers={streamInfo.viewers || 0}
              isSubscribed={isSubscribed}
              onSubscribe={onSubscribe}
              isLoading={isSubscribing}
            />
          </div>

          {/* Mobile Video Info with action buttons including Follow */}
          <div className="mt-4 px-4">
            <MobileVideoInfo
              streamId={streamInfo.id}
              title={streamInfo.title || ""}
              tags={streamInfo.tags || []}
              likeCount={likeCount}
              isLiked={isLiked}
              onLike={onLike}
              username={username}
              isSubscribed={isSubscribed}
              onSubscribe={onSubscribe}
              isSubscribing={isSubscribing}
            />
          </div>
        </div>
      </div>
      
      {/* Divider - only shown when content is expanded */}
      <div className={`transition-all duration-300 ${infoExpanded ? 'opacity-100' : 'opacity-0'}`}>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0 0 0' }} />
      </div>

      {/* Chat section - Takes remaining space */}
      <div className="flex-grow overflow-hidden flex flex-col min-h-0 pt-2">
        <div className="px-4 mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Live Chat</h3>
          <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            {streamInfo.viewers.toLocaleString()} viewers
          </Text>
        </div>
        <div className="flex-grow overflow-hidden relative">
          <Chat username={username} />
        </div>
      </div>
    </div>
  );
}
