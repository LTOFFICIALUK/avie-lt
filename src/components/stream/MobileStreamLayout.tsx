"use client";

import React, { useState } from "react";
import { StreamPlayer } from "./StreamPlayer";
import { MobileAccountSubscribe } from "./MobileAccountSubscribe";
import { MobileDonationButton } from "./MobileDonationButton";
import { MobileVideoInfo } from "./MobileVideoInfo";
import { Chat } from "./chat/Chat";
import { Typography, Divider, Button } from "antd";
import { BarChartOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
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
  isMobileContentHidden: boolean;
  onMobileContentToggle: () => void;
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
  isMobileContentHidden,
  onMobileContentToggle,
}: MobileStreamLayoutProps) {
  const [infoExpanded] = useState(true);
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
    <div className={`flex flex-col w-full sm:hidden bg-[var(--color-background)] ${isMobileContentHidden ? 'h-[100svh] max-h-[100svh] overflow-hidden' : 'min-h-[100svh]'}`}>
      {/* Video Player - Fixed at top */}
      <div className="flex-none w-full">
        <StreamPlayer username={username} />
      </div>

      {/* Donation Button - Always visible */}
      <div className="flex-none mt-3 px-4">
        <MobileDonationButton username={username} />
      </div>

      {/* Hide/Show Button - Always visible */}
      <div className="flex-none mt-2 px-4 flex justify-center">
        <Button
          type="text"
          size="small"
          onClick={onMobileContentToggle}
          icon={isMobileContentHidden ? <DownOutlined /> : <UpOutlined />}
          style={{
            color: 'var(--text-secondary)',
            fontSize: '12px',
            height: '32px',
            width: '70px',
            padding: '0 8px',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            flexShrink: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        >
          {isMobileContentHidden ? 'Show' : 'Hide'}
        </Button>
      </div>

      {/* Collapsible content section */}
      {!isMobileContentHidden && (
        <div className="flex-none overflow-hidden">
          {/* Streamer info with title and stream stats */}
          <div className="mt-3 px-4">
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
          <div className="mt-3 px-4">
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

          {/* Stats Button - Only show if user is live and is the current user's stream */}
          {isCurrentUserStreamer && streamInfo.isLive && (
            <div className="mt-3 px-4 mb-3">
              <Link href={`/${lang}/streams/${username}/stats`}>
                <Button 
                  type="primary"
                  icon={<BarChartOutlined />}
                  block
                  style={{
                    backgroundColor: 'var(--color-brand)',
                    borderColor: 'var(--color-brand)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: 'normal',
                    height: '34px'
                  }}
                >
                  View Stream Stats
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Chat section - Takes all remaining space */}
      <div className={`flex flex-col px-4 pb-4 pt-3 ${isMobileContentHidden ? 'flex-1 min-h-0' : 'min-h-[400px]'}`}>
        <div className={`${isMobileContentHidden ? 'flex-1 min-h-0 overflow-hidden' : 'h-[400px] overflow-hidden'}`}>
          <Chat username={username} />
        </div>
      </div>
    </div>
  );
}
