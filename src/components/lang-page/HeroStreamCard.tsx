// components/HeroStreamCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Stream } from '../../types/stream';

interface HeroStreamCardProps {
  stream: Stream;
  className?: string;
  isOffline?: boolean;
}

const HeroStreamCard: React.FC<HeroStreamCardProps> = ({
  stream,
  className = '',
  isOffline = false,
}) => {
  //
  // Format viewer count for live streams or show last streamed info for offline
  //
  const formatViewers = (count: number): string => {
    if (isOffline) {
      // For offline streams, show when it last streamed or viewer count when it ended
      return `${count} viewers`;
    }
    
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K Live Viewers';
    }
    return `${count} Live Viewers`;
  };

  //
  // Grab current locale from the URL path (e.g. "/en/streams/…")
  //
  const pathSegments =
    typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
  const lang = pathSegments.length > 1 ? pathSegments[1] : 'en';

  return (
    <div
      className={`
        bg-transparent
        border 
        border-gray-700/50
        rounded-lg 
        overflow-hidden 
        flex 
        shadow-lg 
        h-32
        w-full
        max-w-none
        p-3
        ${className}
      `}
    >
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* LEFT: Full Height Thumbnail - Properly Spaced */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <Link
        href={`/${lang}/streams/${stream.user.displayName}`}
        className="group block w-44 flex-shrink-0"
      >
        <div className="relative aspect-[16/9] bg-black overflow-hidden rounded-lg">
          {stream.thumbnail ? (
            <Image
              src={stream.thumbnail}
              alt={`${stream.user.displayName}'s stream preview`}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              className="transition-transform duration-200 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          )}
          
          {/* Offline indicator for offline streams */}
          {isOffline && (
            <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs px-2 py-1 rounded">
              OFFLINE
            </div>
          )}
        </div>
      </Link>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* RIGHT: Stream Info - Properly Spaced */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between pl-3 min-w-0">
        <div>
          {/* Category - use actual stream category without uppercase transform */}
          <p className="text-gray-400 text-xs font-medium mb-2">
            {stream.category?.name || 'Crypto & Trading'}
          </p>

          {/* Stream Title */}
          <h3 className="line-clamp-1 text-white text-sm font-bold leading-tight mb-2 break-words">
            {stream.title || 'Live Stream'}
          </h3>

          {/* Streamer info with avatar */}
          <div className="flex items-start space-x-2 mb-2 min-w-0">
            {/* Streamer Avatar */}
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5">
              {stream.user.avatarUrl ? (
                <Image
                  src={stream.user.avatarUrl}
                  alt={stream.user.displayName}
                  width={16}
                  height={16}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-500 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-white text-xs" />
                </div>
              )}
            </div>

            {/* Streamer DisplayName and viewer count stacked */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-xs break-words">
                {stream.user.displayName}
              </p>
              <p className="text-gray-400 text-xs">
                {formatViewers(stream.viewers)}
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default HeroStreamCard;
