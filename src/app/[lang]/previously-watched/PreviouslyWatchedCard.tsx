import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'antd';

interface WatchHistoryItem {
  id: string;
  contentType: 'STREAM' | 'CLIP' | 'VIDEO';
  content: {
    id: string;
    title: string;
    thumbnail: string | null;
    duration: number;
    creator: {
      displayName: string;
      avatarUrl: string | null;
    } | null;
    isLive?: boolean;
    viewerCount?: number;
    category?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  } | null;
  watchedAt: string;
  watchDuration: number | null;
  isCompleted: boolean;
}

interface PreviouslyWatchedCardProps {
  item: WatchHistoryItem;
  formatViewerCount: (count: number | undefined) => string;
}

const PreviouslyWatchedCard: React.FC<PreviouslyWatchedCardProps> = ({ item, formatViewerCount }) => {
  if (!item.content) return null;

  // Debug: Log the item structure to understand the actual data format
  console.log('PreviouslyWatchedCard item:', item);
  console.log('PreviouslyWatchedCard content:', item.content);

  // Try different possible category field locations
  const getCategoryName = () => {
    // Check various possible category structures
    if (item.content?.category?.name) return item.content.category.name;
    if (item.content?.category && typeof item.content.category === 'string') return item.content.category;
    if ((item.content as any)?.categoryName) return (item.content as any).categoryName;
    if ((item.content as any)?.stream?.category?.name) return (item.content as any).stream.category.name;
    if ((item as any)?.stream?.category?.name) return (item as any).stream.category.name;
    if ((item as any)?.category?.name) return (item as any).category.name;
    if ((item as any)?.categoryName) return (item as any).categoryName;
    
    console.log('No category found, using fallback "General"');
    return 'General';
  };

  const linkHref = item.contentType === 'STREAM'
    ? `/watch/${item.content.id}`
    : `/clip/${item.content.id}`;

  return (
    <div className="w-full bg-transparent border border-gray-700/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-600/50">
      {/* Thumbnail */}
      <Link href={linkHref} className="group block relative" tabIndex={0} aria-label={`Go to ${item.content.title}`}> 
        <div className="relative aspect-[16/9] overflow-hidden">
          {item.content.thumbnail ? (
            <Image
              src={item.content.thumbnail}
              alt={item.content.title}
              fill
              className="transition-transform duration-200 ease-out group-hover:scale-105 object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Live Badge */}
          {item.content.isLive && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                Live
              </span>
            </div>
          )}

          {/* Viewer Count */}
          {item.content.viewerCount && (
            <div className="absolute bottom-2 right-2">
              <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
                {formatViewerCount(item.content.viewerCount)} viewers
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">

        {/* Title */}
        <Link href={linkHref} tabIndex={0} aria-label={item.content.title}>
          <h3 className="line-clamp-2 text-white text-base sm:text-sm font-semibold leading-tight mb-3 hover:text-purple-300 transition-colors cursor-pointer">
            {item.content.title}
          </h3>
        </Link>

        {/* Category */}
        <p className="text-white text-sm sm:text-xs font-medium mb-2 uppercase tracking-wide">
          {getCategoryName()}
        </p>

        {/* Streamer Info */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {/* Avatar */}
            <div className="w-6 h-6 sm:w-5 sm:h-5 rounded-full overflow-hidden flex-shrink-0">
              {item.content.creator?.avatarUrl ? (
                <Image
                  src={item.content.creator.avatarUrl}
                  alt={item.content.creator.displayName}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm sm:text-xs">
                    {item.content.creator?.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Name */}
            <p className="text-gray-300 text-sm sm:text-xs font-medium truncate">
              {item.content.creator?.displayName}
            </p>
          </div>
          {/* Watch Button */}
          <Link href={linkHref} tabIndex={0} aria-label={`Watch ${item.content.title}`}>
            <Button
              type="primary"
              size="small"
              className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-darker)] text-white font-medium text-sm sm:text-xs h-7 sm:h-6 px-3 sm:px-2 rounded-full shadow-md hover:shadow-lg transition-all flex-shrink-0"
            >
              Watch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PreviouslyWatchedCard; 