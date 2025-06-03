'use client';

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { LeftOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';

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
    category?: string;
  } | null;
  watchedAt: string;
  watchDuration: number | null;
  isCompleted: boolean;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const PreviouslyWatchedPage = () => {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/stream/watch-history', {
        params: {
          page: 1,
          limit: 50,
          type: 'all'
        }
      });
      
      if (response.data.status === 'success') {
        setWatchHistory(response.data.data.watchHistory);
      } else {
        setError('Failed to load watch history');
      }
    } catch (err) {
      console.error('Error fetching watch history:', err);
      setError('Failed to load watch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  const formatViewerCount = (count: number | undefined) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  // Separate live and ended content
  const liveContent = watchHistory.filter(item => item.content?.isLive);
  const endedContent = watchHistory.filter(item => !item.content?.isLive);

  const StreamCard = ({ item }: { item: WatchHistoryItem }) => {
    if (!item.content) return null;

    const linkHref = item.contentType === 'STREAM' 
      ? `/watch/${item.content.id}` 
      : `/clip/${item.content.id}`;

    return (
      <Link href={linkHref} className="group">
        <div className="bg-zinc-900 rounded-lg overflow-hidden transition-transform hover:scale-105">
          <div className="relative aspect-video">
            {item.content.thumbnail ? (
              <Image 
                src={item.content.thumbnail} 
                alt={item.content.title} 
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-zinc-800 w-full h-full flex items-center justify-center">
                <span className="text-zinc-500">No thumbnail</span>
              </div>
            )}
            
            {/* Live indicator */}
            {item.content.isLive && (
              <div className="absolute top-2 left-2 flex items-center space-x-1 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>LIVE</span>
              </div>
            )}
            
            {/* Viewer count */}
            {item.content.viewerCount && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                👁 {formatViewerCount(item.content.viewerCount)}
              </div>
            )}
          </div>
          
          <div className="p-3">
            <div className="flex items-center space-x-2 mb-2">
              {item.content.creator && (
                <>
                  <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                    {item.content.creator.avatarUrl ? (
                      <Image
                        src={item.content.creator.avatarUrl}
                        alt={item.content.creator.displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                        <span className="text-xs text-zinc-400">
                          {item.content.creator.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-zinc-300 truncate">
                    {item.content.creator.displayName}
                  </span>
                  {item.content.isLive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  )}
                </>
              )}
            </div>
            
            <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 leading-tight">
              {item.content.title}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>{item.content.category || 'Gaming'}</span>
              {!item.content.isLive && (
                <span>
                  {formatDistanceToNow(new Date(item.watchedAt), { addSuffix: true })}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <LeftOutlined className="w-5 h-5 text-zinc-400" />
          </Link>
          <div>
            <span className="text-zinc-400 text-sm">Following</span>
            <h1 className="text-2xl font-bold text-white">Following</h1>
          </div>
        </div>

        {/* Live Now Section */}
        {liveContent.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-6">Live Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {liveContent.map((item) => (
                <StreamCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Ended Streams Section */}
        {endedContent.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Ended Streams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {endedContent.map((item) => (
                <StreamCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {watchHistory.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold text-white mb-2">No watch history yet</h3>
            <p className="text-zinc-400 mb-6">
              Start watching streams and clips to see your history here
            </p>
            <Link href="/browse">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Discover Content
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviouslyWatchedPage;
