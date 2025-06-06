'use client';

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { LeftOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import PreviouslyWatchedCard from './PreviouslyWatchedCard';

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
        console.log('Watch history response:', response.data.data);
        console.log('First item:', response.data.data.watchHistory[0]);
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

  if (loading) {
    return (
      <div className="min-h-screen text-white">
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
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb">
      <h1 className="text-3xl font-bold text-white mb-1">Previously Watched</h1>
        <p className="text-lg text-gray-400 mb-2">See your previously watched streams and clips.</p>
      </div>
      
      {/* Live Now Section */}
      {liveContent.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Live Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {liveContent.map((item) => (
              <PreviouslyWatchedCard key={item.id} item={item} formatViewerCount={formatViewerCount} />
            ))}
          </div>
        </div>
      )}

      {/* Ended Streams Section */}
      {endedContent.length > 0 && (
        <div>
          {/* Section Header with Divider */}
          <div className="w-full mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-6"></div>
            <h2 className="text-xl font-semibold text-white mb-6">Ended Streams</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {endedContent.map((item) => (
              <PreviouslyWatchedCard key={item.id} item={item} formatViewerCount={formatViewerCount} />
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
  );
};

export default PreviouslyWatchedPage;
