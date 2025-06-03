'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Typography } from 'antd';
import { Stream } from '../../types/stream';

const { Text } = Typography;

interface StreamCardProps {
  stream: Stream;
}

export function StreamCardSkeleton() {
  return (
    <div className="w-full">
      {/* Thumbnail Skeleton */}
      <div className="aspect-[16/9] relative bg-[var(--color-gray)]/40 overflow-hidden rounded animate-pulse">
        <div className="absolute bottom-1 right-1 bg-[var(--color-gray)]/80 h-4 w-16 rounded"></div>
      </div>
      
      {/* Info Skeleton */}
      <div className="pt-2 flex gap-3 items-start">
        {/* Avatar Skeleton */}
        <div className="flex items-center self-start pt-1">
          <div className="w-10 h-10 rounded-full bg-[var(--color-gray)]/40 animate-pulse"></div>
        </div>
        
        {/* Text Skeletons */}
        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className="h-4 bg-[var(--color-gray)]/40 rounded w-full mb-2 animate-pulse"></div>
          
          {/* Username */}
          <div className="h-3 bg-[var(--color-gray)]/40 rounded w-2/3 mb-2 animate-pulse"></div>
          
          {/* Category name */}
          <div className="h-3 bg-[var(--color-gray)]/40 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function StreamCard({ stream }: StreamCardProps) {
  // Format viewer count
  const formatViewers = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K viewers';
    }
    return count + ' viewers';
  };

  // Get the current language from the URL
  const pathSegments = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
  const lang = pathSegments.length > 1 ? pathSegments[1] : 'en';

  return (
    <div className="w-full hover:opacity-90 transition-all duration-200">
      {/* Thumbnail - linked to stream */}
      <Link href={`/${lang}/streams/${stream.user.displayName}`} style={{ display: 'block' }}>
        <div className="aspect-[16/9] relative bg-black overflow-hidden rounded">
          {stream.thumbnail ? (
            <Image
              src={stream.thumbnail}
              alt={`${stream.user.displayName}'s stream`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ 
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              className="transition-all duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <Text style={{ color: 'var(--text-secondary)' }} className="text-sm">No Preview</Text>
            </div>
          )}
          
          {/* Viewer count in bottom right corner - exact styling */}
          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-1 rounded">
            {formatViewers(stream.viewers)}
          </div>
        </div>
      </Link>
      
      {/* Stream Info - Avatar on left, all text on right */}
      <div className="pt-2 flex gap-3 items-center">
        {/* Avatar on left - linked to profile */}
        <Link href={`/${lang}/profile/${stream.user.displayName}`} className="flex items-center self-start pt-1 hover:opacity-80 transition-opacity">
          <Avatar 
            size={40} 
            src={stream.user.avatarUrl} 
            icon={!stream.user.avatarUrl && <UserOutlined />}
            className="flex-shrink-0"
          />
        </Link>
        
        {/* All text info on right */}
        <div className="min-w-0 flex-1">
          {/* Title - linked to stream */}
          <Link href={`/${lang}/streams/${stream.user.displayName}`}>
            <h3 className="text-white text-sm font-medium leading-tight m-0 mb-1 line-clamp-2 hover:text-gray-300 transition-colors cursor-pointer">
              {stream.title || `${stream.user.displayName}'s Stream`}
            </h3>
          </Link>
          
          {/* Channel name - linked to profile */}
          <Link href={`/${lang}/profile/${stream.user.displayName}`}>
            <p className="text-[13px] m-0 truncate hover:text-gray-400 transition-colors cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              {stream.user.displayName}
            </p>
          </Link>
          
          {/* Category name */}
          <p className="text-[13px] m-0 truncate" style={{ color: 'var(--text-secondary)' }}>
            {stream.category ? stream.category.name : "Uncategorized"}
          </p>
        </div>
      </div>
    </div>
  );
} 