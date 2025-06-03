'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, Skeleton } from 'antd';
import { UserOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';

interface Clip {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration: number;
  viewCount: number;
  createdAt: string;
  streamer: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  clipper: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  stream: {
    title: string;
  };
}

interface ClipCardProps {
  clip: Clip;
}

export function ClipCardSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative">
        <Skeleton.Image className="w-full aspect-video rounded-lg" />
        <div className="absolute bottom-2 right-2">
          <Skeleton.Button size="small" />
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-start gap-3">
          <Skeleton.Avatar size={32} />
          <div className="flex-1 space-y-1">
            <Skeleton.Input size="small" />
            <Skeleton.Input size="small" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClipCard({ clip }: ClipCardProps) {
  const params = useParams();
  const lang = params?.lang || 'en';

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const clipDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - clipDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  return (
    <Link href={`/${lang}/clip/${clip.id}`} className="block w-full max-w-sm mx-auto group">
      <div className="relative overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-105">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          {clip.thumbnailUrl ? (
            <Image
              src={clip.thumbnailUrl}
              alt={clip.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-gray)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No Preview</span>
            </div>
          )}
          
          {/* Duration overlay */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-75 rounded text-white text-xs font-medium">
            {formatDuration(clip.duration)}
          </div>
          
          {/* View count overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black bg-opacity-75 rounded text-white text-xs">
            <EyeOutlined />
            {formatViews(clip.viewCount)}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <div className="flex items-start gap-3">
            <Link href={`/${lang}/profile/${clip.streamer.displayName}`} onClick={(e) => e.stopPropagation()}>
              <Avatar
                size={32}
                src={clip.streamer.avatarUrl}
                icon={!clip.streamer.avatarUrl && <UserOutlined />}
                className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              />
            </Link>
            
            <div className="flex-1 min-w-0">
              <h3 
                className="font-medium text-sm line-clamp-2 leading-tight mb-1 group-hover:text-opacity-80 transition-colors"
                style={{ color: 'var(--text-primary)' }}
                title={clip.title}
              >
                {clip.title}
              </h3>
              
              <div className="flex items-center gap-1 mb-1">
                <Link 
                  href={`/${lang}/profile/${clip.streamer.displayName}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {clip.streamer.displayName}
                </Link>
                {clip.streamer.isVerified && (
                  <CheckCircleOutlined style={{ color: 'var(--color-brand)', fontSize: '10px' }} />
                )}
              </div>
              
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {clip.stream.title}
              </div>
              
              <div className="flex items-center gap-2 text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                <span>{formatTimeAgo(clip.createdAt)}</span>
                {clip.clipper.id !== clip.streamer.id && (
                  <>
                    <span>•</span>
                    <span>Clipped by {clip.clipper.displayName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 