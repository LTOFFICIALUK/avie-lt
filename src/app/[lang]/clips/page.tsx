'use client';

import React, { useState, useEffect } from 'react';
import { ClipCard, ClipCardSkeleton } from '@/components/stream/ClipCard';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';
import Link from 'next/link';

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

interface ClipsResponse {
  clips: Clip[];
  pagination: {
    page: number;
    limit: number;
    totalClips: number;
    totalPages: number;
  };
}

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'duration', label: 'Longest' },
];

export default function ClipsPage() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClips, setTotalClips] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('recent');
  const toast = useToast();

  const fetchClips = async (page: number = 1, sort: string = 'recent') => {
    try {
      setLoading(true);
      const response = await api.get(`/api/stream/clips?page=${page}&limit=20&sortBy=${sort}`);
      
      if (response.data.status === 'success') {
        const data: ClipsResponse = response.data.data;
        setClips(data.clips);
        setTotalClips(data.pagination.totalClips);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      }
    } catch (error: any) {
      console.error('Error fetching clips:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to view your clips');
      } else {
        toast.error('Failed to load clips');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips(currentPage, sortBy);
  }, [currentPage, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchClips(1, value);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const currentSort = sortOptions.find(option => option.value === sortBy);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/clips/discover" className="text-gray-400 hover:text-white transition-colors">
            Clips
          </Link>
        </div>

        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              My Clips
            </h1>
            <p className="text-gray-400">
              Manage and view your created clips
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-[var(--color-brand)] cursor-pointer transition-all duration-200 hover:bg-gray-800/70 text-sm"
                style={{ 
                  '--focus-border-color': 'var(--color-brand)' 
                } as React.CSSProperties}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Create Clip Button */}
            <Link href="/browse">
              <button 
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-sm text-black"
                style={{
                  backgroundColor: 'var(--color-brand)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-brand-darker)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-brand)';
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Clip
              </button>
            </Link>
          </div>
        </div>

        {/* Divider Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-6"></div>

        {/* Active Sort Indicator */}
        {sortBy !== 'recent' && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-gray-400">Sorted by:</span>
            <span 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: 'rgba(132, 238, 245, 0.2)',
                color: 'var(--color-brand)'
              }}
            >
              {currentSort?.label}
            </span>
          </div>
        )}

        {/* Stats Banner */}
        {!loading && clips.length > 0 && (
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div 
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: 'var(--color-brand)' }}
                  >
                    {formatNumber(totalClips)}
                  </div>
                  <div className="text-sm text-gray-400">Total Clips</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: 'var(--color-brand)' }}
                  >
                    {formatNumber(clips.reduce((total, clip) => total + clip.viewCount, 0))}
                  </div>
                  <div className="text-sm text-gray-400">Total Views</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ClipCardSkeleton key={index} />
            ))}
          </div>
        ) : clips.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="text-6xl mb-4">✂️</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                No clips yet
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Start watching streams and create your first clip! Share your favorite moments with the community.
              </p>
            </div>
            
            <Link href="/browse">
              <button 
                className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center gap-2 text-black"
                style={{
                  backgroundColor: 'var(--color-brand)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-brand-darker)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-brand)';
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Browse Streams
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Clips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {clips.map((clip) => (
                <ClipCard key={clip.id} clip={clip} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-400">
                  Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalClips)} of {totalClips} clips
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg transition-colors duration-200 ${
                            currentPage === pageNum
                              ? 'font-medium text-black'
                              : 'bg-gray-800 hover:bg-gray-700 text-white'
                          }`}
                          style={currentPage === pageNum ? {
                            backgroundColor: 'var(--color-brand)'
                          } : {}}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
