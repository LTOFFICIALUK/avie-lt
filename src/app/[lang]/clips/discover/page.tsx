'use client';

import React, { useState, useEffect } from 'react';
import { ClipCard, ClipCardSkeleton } from '@/components/stream/ClipCard';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

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

export default function DiscoverClipsPage() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClips, setTotalClips] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const toast = useToast();

  const fetchClips = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      let url = `/api/stream/clips/all?page=${page}&limit=20&sortBy=views`;
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      
      const response = await api.get(url);
      
      if (response.data.status === 'success') {
        const data: ClipsResponse = response.data.data;
        setClips(data.clips);
        setTotalClips(data.pagination.totalClips);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      }
    } catch (error: any) {
      console.error('Error fetching clips:', error);
      toast.error('Failed to load clips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips(currentPage, searchQuery);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
    fetchClips(1, searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
    fetchClips(1, '');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/30"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Discover 
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent ml-3">
                Clips
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Explore amazing clips from the community. Find the most viewed, recent, and epic moments.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              {/* Search Bar */}
              <div className="relative w-full max-w-2xl">
                <div className={`relative transition-all duration-200 ${isSearchFocused ? 'transform scale-[1.02]' : ''}`}>
                  <input
                    type="text"
                    placeholder="Search clips by title or creator..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full h-12 pl-12 pr-20 bg-gray-800/50 border border-gray-600/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-800/70 transition-all duration-200"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-cyan-500 hover:bg-cyan-600 text-black px-4 h-8 rounded-full font-medium transition-colors duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Active Search Filter */}
            {searchQuery && (
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className="text-sm text-gray-400">Search results for:</span>
                
                <span className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  "{searchQuery}"
                  <button
                    onClick={clearSearch}
                    className="hover:text-white transition-colors ml-1"
                  >
                    ×
                  </button>
                </span>
                
                <button
                  onClick={clearSearch}
                  className="text-sm text-gray-400 hover:text-white transition-colors underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Banner */}
        {!loading && clips.length > 0 && (
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
                    {formatNumber(totalClips)}
                  </div>
                  <div className="text-sm text-gray-400">Total Clips</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">
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
            {Array.from({ length: 12 }).map((_, index) => (
              <ClipCardSkeleton key={index} />
            ))}
          </div>
        ) : clips.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {searchQuery ? 'No clips found' : 'No clips available'}
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                {searchQuery 
                  ? `No clips found matching "${searchQuery}". Try adjusting your search terms.`
                  : 'Be the first to create a clip and share amazing moments!'
                }
              </p>
            </div>
            
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="bg-cyan-500 hover:bg-cyan-600 text-black px-6 py-3 rounded-full font-medium transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
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
                              ? 'bg-cyan-500 text-black font-medium'
                              : 'bg-gray-800 hover:bg-gray-700 text-white'
                          }`}
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
