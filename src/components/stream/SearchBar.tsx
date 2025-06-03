'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Button, Spin } from 'antd';
import { api } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  title: string;
  viewers: number;
  thumbnail: string | null;
  user: {
    displayName: string;
    avatarUrl: string | null;
  };
  tags: string[];
}

interface SearchBarProps {
  isSmallScreen?: boolean;
  onClose?: () => void;
  isOverlay?: boolean;
}

export function SearchBar({ isSmallScreen, onClose, isOverlay }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
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
    const searchStreams = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/api/stream/search?query=${encodeURIComponent(debouncedQuery)}`);
        setResults(response.data.data);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching streams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchStreams();
  }, [debouncedQuery]);

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
    if (isSmallScreen && onClose) {
      onClose();
    }
  };

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
              placeholder="Search streams..."
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
                      setResults([]);
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
            placeholder="Search streams..."
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
                    setResults([]);
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
      {showResults && query.length >= 3 && (
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
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-zinc-400">
                No streams found
              </div>
            ) : (
              <div className={`${isOverlay ? 'max-h-[calc(100vh-80px)]' : 'max-h-[400px]'} overflow-y-auto`}>
                {results.map((stream) => (
                  <Link
                    key={stream.id}
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
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 