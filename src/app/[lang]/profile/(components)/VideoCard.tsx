import {
  getDateDiffInDays,
  getDateDiffInHours,
  getDateDiffInMinutes,
} from "@/lib/utils";
import { Video } from "@/types/videos";
import { PictureOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import Image from 'next/image';
import { Typography } from 'antd';

const { Text } = Typography;

interface Props {
  video: Video;
}

const renderDateDiff = (videoEndedAt: string): string => {
  const diffInDays = getDateDiffInDays(
    new Date(Date.now()),
    new Date(videoEndedAt)
  );

  const diffInHours = getDateDiffInHours(
    new Date(Date.now()),
    new Date(videoEndedAt)
  );

  const diffInMinutes = getDateDiffInMinutes(
    new Date(Date.now()),
    new Date(videoEndedAt)
  );

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      return `${diffInMinutes} minutes ago`;
    } else return `${diffInHours} hours ago`;
  }

  if (diffInDays >= 365) {
    // Always round down to whole number
    const years = Math.floor(diffInDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  } else if (diffInDays >= 30) {
    // Always round down to whole number
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else if (diffInDays >= 7) {
    // Always round down to whole number
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
};

// Add skeleton component for loading state
export function VideoCardSkeleton() {
  return (
    <div className="w-full">
      {/* Thumbnail Skeleton */}
      <div className="aspect-[16/9] relative bg-[var(--color-gray)]/40 overflow-hidden rounded animate-pulse">
        <div className="absolute bottom-1 right-1 bg-[var(--color-gray)]/80 h-4 w-16 rounded"></div>
      </div>
      
      {/* Info Skeleton */}
      <div className="pt-2 flex gap-3 items-start">
        {/* Text Skeletons */}
        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className="h-4 bg-[var(--color-gray)]/40 rounded w-full mb-2 animate-pulse"></div>
          
          {/* Date */}
          <div className="h-3 bg-[var(--color-gray)]/40 rounded w-2/3 mb-2 animate-pulse"></div>
          
          {/* View count */}
          <div className="h-3 bg-[var(--color-gray)]/40 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

const VideoCard = ({ video }: Props) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-full hover:opacity-90 transition-all duration-200">
      {/* Thumbnail with 16:9 aspect ratio */}
      <div className="aspect-[16/9] relative bg-black overflow-hidden rounded">
        {!imageError ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            className="transition-all duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <PictureOutlined
              style={{ fontSize: "40px", color: "var(--color-brand)" }}
            />
          </div>
        )}
        
        {/* View count badge in bottom right corner */}
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-1 rounded">
          {video.viewers.toLocaleString()} views
        </div>
      </div>
      
      {/* Video Info */}
      <div className="pt-2">
        {/* Title */}
        <h3 className="text-white text-sm font-medium leading-tight m-0 mb-1 line-clamp-2">
          {video.title}
        </h3>
        
        {/* Date and views */}
        <p className="text-[13px] m-0 truncate" style={{ color: 'var(--text-secondary)' }}>
          {renderDateDiff(video.endedAt)}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
