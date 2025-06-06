'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Stream } from '../../types/stream';

interface StreamCardProps {
  stream: Stream;
}

export function StreamCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-60 bg-transparent border border-gray-700/50 rounded-lg overflow-hidden shadow-lg animate-pulse">
      {/* Stream Thumbnail Skeleton */}
      <div className="relative aspect-[16/9] bg-gray-800"></div>

      {/* Stream Info Skeleton */}
      <div className="p-3">
        {/* Category Skeleton */}
        <div className="h-3 bg-gray-700 rounded w-1/3 mb-2"></div>

        {/* Stream Title Skeleton */}
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-3"></div>

        {/* Streamer Info Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {/* Streamer Avatar Skeleton */}
            <div className="w-5 h-5 rounded-full bg-gray-700"></div>
            {/* Streamer Name Skeleton */}
            <div className="h-3 bg-gray-700 rounded w-16"></div>
          </div>
          {/* Watch Button Skeleton */}
          <div className="h-6 bg-gray-700 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
}

export function StreamCard({ stream }: StreamCardProps) {
  // Format viewer count
  const formatViewers = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  // Get current locale from path
  const pathSegments =
    typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
  const lang = pathSegments.length > 1 ? pathSegments[1] : 'en';

  return (
    <div className="group flex-shrink-0 relative mx-2 my-1">
      
              {/* Actual Card Content */}
        <div className="w-60 bg-transparent rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-600/50 relative group-hover:scale-105">
      
      {/* Stream Thumbnail */}
      <Link
        href={`/${lang}/streams/${stream.user.displayName}`}
        className="block relative"
      >
        <div className="relative aspect-[16/9] bg-black overflow-hidden">
          {stream.thumbnail ? (
            <Image
              src={stream.thumbnail}
              alt={`${stream.user.displayName}'s stream preview`}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              className="transition-transform duration-200 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          )}
          
          {/* Live Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              Live
            </span>
          </div>

          {/* Viewer Count */}
          <div className="absolute bottom-2 right-2">
            <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
              {formatViewers(stream.viewers)} viewers
            </span>
          </div>
        </div>
      </Link>

      {/* Stream Info */}
      <div className="flex gap-1">
      <Link href={`/${lang}/profile/${stream.user.displayName}`}>
        <div className="pt-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            {stream.user.avatarUrl ? (
              <Image
                src={stream.user.avatarUrl}
                alt={stream.user.displayName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-purple-500 rounded-full flex items-center justify-center">
                <UserOutlined className="text-white text-xs" />
              </div>
              )}
            </div>
          </div>
        </Link>

        <div className="p-2">
          {/* Stream Title */}
          <Link href={`/${lang}/streams/${stream.user.displayName}`}>
            <h3 className="line-clamp-1 text-white text-sm font-semibold leading-tight mb-0 hover:text-purple-300 transition-colors cursor-pointer">
              {stream.title}
            </h3>
          </Link>

          {/* Streamer Name */}
          <Link href={`/${lang}/profile/${stream.user.displayName}`}>
            <p className="text-gray-300 text-xs font-medium truncate pt-2 hover:text-white transition-colors cursor-pointer">
              {stream.user.displayName}
            </p>
          </Link>

          {/* Category */}
          <Link href={`/${lang}/streams/category/${stream.category?.slug}`}>
            <p className="text-[var(--text-secondary)] text-xs font-medium mb-1 tracking-wide pt-1 hover:text-white transition-colors cursor-pointer">
              {stream.category?.name || 'General'}
            </p>
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
} 