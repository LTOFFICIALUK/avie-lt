'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { SearchOutlined, CloseOutlined, UserOutlined, PlayCircleOutlined, TagOutlined } from '@ant-design/icons';
import { Input, Button, Spin } from 'antd';
import { api } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';

interface StreamResult {
  id: string;
  title: string;
  viewers: number;
  thumbnail: string | null;
  user: {
    displayName: string;
    avatarUrl: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface UserResult {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isVerified: boolean;
  isStreaming: boolean;
  stats: {
    followers: number;
    following: number;
    videos: number;
  };
}

interface CategoryResult {
  id: string;
  name: string;
  slug: string;
}

interface EnhancedSearchResults {
  streams: StreamResult[];
  categoryStreams: StreamResult[];
  categories: CategoryResult[];
  users: UserResult[];
  query: string;
}

interface SearchBarProps {
  isSmallScreen?: boolean;
  onClose?: () => void;
  isOverlay?: boolean;
}

export function SearchBarGlobal({ isSmallScreen, onClose, isOverlay }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<EnhancedSearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { lang } = useParams();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        if (isSmallScreen && onClose) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSmallScreen, onClose]);

  useEffect(() => {
    const searchContent = async () => {
      if (debouncedQuery.length < 2) {
        setResults(null);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/api/stream/search/enhanced?query=${encodeURIComponent(debouncedQuery)}`);
        setResults(response.data.data);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching:', error);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    searchContent();
  }, [debouncedQuery]);

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
    if (isSmallScreen && onClose) {
      onClose();
    }
  };

  const hasResults = results && (
    results.streams.length > 0 || 
    results.categoryStreams.length > 0 || 
    results.categories.length > 0 || 
    results.users.length > 0
  );

  return (
    <div 
      ref={searchRef} 
      className={`${isOverlay 
        ? 'fixed inset-0 bg-black/90 z-[100] flex flex-col items-center pt-4'
        : 'relative w-full max-w-[500px] z-[50]'}`}
    >
      {isOverlay && (
        <div className="w-full max-w-[500px] px-4 flex items-center mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search streams, users, categories..."
              size="large"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              prefix={
                <SearchOutlined
                  style={{
                    fontSize: 20,
                    color: "var(--color-lightGray)",
                  }}
                />
              }
              suffix={
                query && (
                  <CloseOutlined
                    style={{ fontSize: 16, color: "var(--color-lightGray)" }}
                    onClick={() => {
                      setQuery('');
                      setResults(null);
                    }}
                  />
                )
              }
              style={{ borderColor: "transparent" }}
              className="w-full"
              autoFocus={true}
            />
          </div>
          <Button 
            type="text" 
            icon={<CloseOutlined style={{ fontSize: 20, color: 'white' }} />} 
            onClick={onClose}
            className="text-white ml-2"
          />
        </div>
      )}
      
      {!isOverlay && (
        <div className="relative w-full z-[51]">
          <Input
            placeholder="Search streams, users, categories..."
            size="large"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            prefix={
              <SearchOutlined
                style={{
                  fontSize: 20,
                  color: "var(--color-lightGray)",
                }}
              />
            }
            suffix={
              query && (
                <CloseOutlined
                  style={{ fontSize: 16, color: "var(--color-lightGray)" }}
                  onClick={() => {
                    setQuery('');
                    setResults(null);
                  }}
                />
              )
            }
            style={{ borderColor: "transparent" }}
            className="w-full"
          />
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && query.length >= 2 && (
        <div 
          className={`${isOverlay
            ? 'w-full max-w-[500px] px-4'
            : 'absolute top-full mt-1 w-full'} z-[1000]`}
        >
          <div className="bg-[#0b0b0f] border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50 w-full relative" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
            {isLoading ? (
              <div className="p-4 text-center">
                <Spin size="small" /> <span className="ml-2 text-zinc-400">Searching...</span>
              </div>
            ) : !hasResults ? (
              <div className="p-4 text-center text-zinc-400">
                No results found
              </div>
            ) : (
              <div className={`${isOverlay ? 'max-h-[calc(100vh-80px)]' : 'max-h-[400px]'} overflow-y-auto`}>
                
                {/* Live Streams Section */}
                {results.streams.length > 0 && (
                  <div className="border-b border-zinc-800 last:border-b-0">
                    <div className="p-3 bg-zinc-900/50 flex items-center gap-2">
                      <PlayCircleOutlined className="text-emerald-500" />
                      <span className="text-white text-sm font-medium">Live Streams</span>
                    </div>
                    {results.streams.map((stream) => (
                      <Link
                        key={`stream-${stream.id}`}
                        href={`/${lang}/streams/${stream.user.displayName}`}
                        className="block hover:bg-zinc-800/50 transition-colors"
                        onClick={handleResultClick}
                      >
                        <div className="p-4 flex items-start gap-3">
                          <div className="w-24 h-16 relative rounded overflow-hidden bg-zinc-900 flex-shrink-0">
                            {stream.thumbnail ? (
                              <Image
                                src={stream.thumbnail}
                                alt={stream.title}
                                fill
                                className="object-cover"
                              />
                            ) : stream.user.avatarUrl ? (
                              <Image
                                src={stream.user.avatarUrl}
                                alt={stream.user.displayName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs text-zinc-600">No Preview</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{stream.title}</h4>
                            <p className="text-sm text-zinc-400 mt-1">{stream.user.displayName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-emerald-500">LIVE</span>
                              <span className="text-xs text-zinc-500">{stream.viewers} viewers</span>
                              {stream.category && (
                                <span className="text-xs text-zinc-500">• {stream.category.name}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Users Section */}
                {results.users.length > 0 && (
                  <div className="border-b border-zinc-800 last:border-b-0">
                    <div className="p-3 bg-zinc-900/50 flex items-center gap-2">
                      <UserOutlined className="text-blue-500" />
                      <span className="text-white text-sm font-medium">Users</span>
                    </div>
                    {results.users.map((user) => (
                      <Link
                        key={`user-${user.id}`}
                        href={`/${lang}/profile/${user.displayName}`}
                        className="block hover:bg-zinc-800/50 transition-colors"
                        onClick={handleResultClick}
                      >
                        <div className="p-4 flex items-start gap-3">
                          <div className="w-12 h-12 relative rounded-full overflow-hidden bg-zinc-900 flex-shrink-0">
                            {user.avatarUrl ? (
                              <Image
                                src={user.avatarUrl}
                                alt={user.displayName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <UserOutlined className="text-zinc-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white truncate">{user.displayName}</h4>
                              {user.isVerified && (
                                <span className="text-blue-500 text-xs">✓</span>
                              )}
                              {user.isStreaming && (
                                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded">LIVE</span>
                              )}
                            </div>
                            {user.bio && (
                              <p className="text-sm text-zinc-400 mt-1 truncate">{user.bio}</p>
                            )}
                            <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                              <span>{user.stats.followers} followers</span>
                              <span>{user.stats.videos} videos</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Categories Section */}
                {results.categories.length > 0 && (
                  <div className="border-b border-zinc-800 last:border-b-0">
                    <div className="p-3 bg-zinc-900/50 flex items-center gap-2">
                      <TagOutlined className="text-purple-500" />
                      <span className="text-white text-sm font-medium">Categories</span>
                    </div>
                    {results.categories.map((category) => (
                      <Link
                        key={`category-${category.id}`}
                        href={`/${lang}/category/${category.slug}`}
                        className="block hover:bg-zinc-800/50 transition-colors"
                        onClick={handleResultClick}
                      >
                        <div className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TagOutlined className="text-purple-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white">{category.name}</h4>
                            <p className="text-sm text-zinc-400">Browse category</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Category Streams Section */}
                {results.categoryStreams.length > 0 && (
                  <div className="border-b border-zinc-800 last:border-b-0">
                    <div className="p-3 bg-zinc-900/50 flex items-center gap-2">
                      <PlayCircleOutlined className="text-orange-500" />
                      <span className="text-white text-sm font-medium">More in Categories</span>
                    </div>
                    {results.categoryStreams.slice(0, 5).map((stream) => (
                      <Link
                        key={`category-stream-${stream.id}`}
                        href={`/${lang}/streams/${stream.user.displayName}`}
                        className="block hover:bg-zinc-800/50 transition-colors"
                        onClick={handleResultClick}
                      >
                        <div className="p-4 flex items-start gap-3">
                          <div className="w-20 h-12 relative rounded overflow-hidden bg-zinc-900 flex-shrink-0">
                            {stream.thumbnail ? (
                              <Image
                                src={stream.thumbnail}
                                alt={stream.title}
                                fill
                                className="object-cover"
                              />
                            ) : stream.user.avatarUrl ? (
                              <Image
                                src={stream.user.avatarUrl}
                                alt={stream.user.displayName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs text-zinc-600">No Preview</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate text-sm">{stream.title}</h4>
                            <p className="text-xs text-zinc-400 mt-1">{stream.user.displayName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-emerald-500">LIVE</span>
                              <span className="text-xs text-zinc-500">{stream.viewers} viewers</span>
                              {stream.category && (
                                <span className="text-xs text-orange-500">in {stream.category.name}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 