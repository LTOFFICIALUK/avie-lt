'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'antd';
import { UserOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Stream } from '../../types/stream';

interface GamingStreamsProps {
  streams?: Stream[];
  className?: string;
}

const GamingStreams: React.FC<GamingStreamsProps> = ({
  streams = [],
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration - replace with actual data
  const mockStreams: Stream[] = streams.length > 0 ? streams : [
    {
      id: '1',
      isLive: true,
      startedAt: '2024-01-01T00:00:00Z',
      viewers: 1250,
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop',
      title: 'Crypto Trading Masterclass - Live Analysis & Strategies',
      user: {
        displayName: 'CryptoTraderPro',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        bio: null,
      },
      category: {
        id: '1',
        name: 'Crypto & Trading',
        slug: 'crypto-trading',
      },
    },
    {
      id: '2',
      isLive: true,
      startedAt: '2024-01-01T00:00:00Z',
      viewers: 850,
      thumbnail: 'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=400&h=225&fit=crop',
      title: 'DeFi Deep Dive: Yield Farming Strategies That Actually Work',
      user: {
        displayName: 'DeFiAnalyst',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        bio: null,
      },
      category: {
        id: '2',
        name: 'DeFi',
        slug: 'defi',
      },
    },
    {
      id: '3',
      isLive: true,
      startedAt: '2024-01-01T00:00:00Z',
      viewers: 2100,
      thumbnail: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400&h=225&fit=crop',
      title: 'NFT Market Analysis - Finding Hidden Gems in Bear Market',
      user: {
        displayName: 'NFTHunter',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        bio: null,
      },
      category: {
        id: '3',
        name: 'NFTs',
        slug: 'nfts',
      },
    },
    {
      id: '4',
      isLive: true,
      startedAt: '2024-01-01T00:00:00Z',
      viewers: 670,
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop',
      title: 'Bitcoin Technical Analysis - Key Levels to Watch This Week',
      user: {
        displayName: 'BTCAnalyst',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        bio: null,
      },
      category: {
        id: '4',
        name: 'Bitcoin',
        slug: 'bitcoin',
      },
    },
    {
      id: '5',
      isLive: true,
      startedAt: '2024-01-01T00:00:00Z',
      viewers: 1580,
      thumbnail: 'https://images.unsplash.com/photo-1634704784915-aacf363b021f?w=400&h=225&fit=crop',
      title: 'Altcoin Gems: Hidden Projects with 100x Potential',
      user: {
        displayName: 'AltcoinExpert',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
        bio: null,
      },
      category: {
        id: '5',
        name: 'Altcoins',
        slug: 'altcoins',
      },
    },
  ];

  const formatViewers = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -240,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 240,
        behavior: 'smooth',
      });
    }
  };

  // Get current locale from path
  const pathSegments =
    typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
  const lang = pathSegments.length > 1 ? pathSegments[1] : 'en';

  return (
    <section className={`w-full py-8 ${className}`}>
      {/* Small Breaker Line */}
      <div className="w-full mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gaming</h2>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          <Button
            type="text"
            size="small"
            icon={<LeftOutlined />}
            onClick={handleScrollLeft}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
            tabIndex={0}
            aria-label="Scroll left"
          />
          <Button
            type="text"
            size="small"
            icon={<RightOutlined />}
            onClick={handleScrollRight}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
            tabIndex={0}
            aria-label="Scroll right"
          />
        </div>
      </div>

      {/* Streams Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {mockStreams.map((stream) => (
            <div
              key={stream.id}
              className="flex-shrink-0 w-60 bg-transparent border border-gray-700/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-600/50"
            >
              {/* Stream Thumbnail */}
              <Link
                href={`/${lang}/streams/${stream.user.displayName}`}
                className="group block relative"
              >
                <div className="relative aspect-[16/9] bg-black overflow-hidden">
                  {stream.thumbnail ? (
                    <Image
                      src={stream.thumbnail}
                      alt={`${stream.user.displayName}'s stream preview`}
                      fill
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      className="transition-transform duration-200 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                  
                  {/* Live Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                      Live
                    </span>
                  </div>

                  {/* Viewer Count */}
                  <div className="absolute bottom-2 right-2">
                    <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {formatViewers(stream.viewers)} viewers
                    </span>
                  </div>
                </div>
              </Link>

              {/* Stream Info */}
              <div className="p-3">
                {/* Category */}
                <p className="text-purple-400 text-xs font-medium mb-2 uppercase tracking-wide">
                  {stream.category?.name || 'Crypto & Trading'}
                </p>

                {/* Stream Title */}
                <Link href={`/${lang}/streams/${stream.user.displayName}`}>
                  <h3 className="line-clamp-2 text-white text-sm font-semibold leading-tight mb-3 hover:text-purple-300 transition-colors cursor-pointer">
                    {stream.title}
                  </h3>
                </Link>

                {/* Streamer Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    {/* Streamer Avatar */}
                    <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                      {stream.user.avatarUrl ? (
                        <Image
                          src={stream.user.avatarUrl}
                          alt={stream.user.displayName}
                          width={20}
                          height={20}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-500 rounded-full flex items-center justify-center">
                          <UserOutlined className="text-white text-xs" />
                        </div>
                      )}
                    </div>

                    {/* Streamer Name */}
                    <p className="text-gray-300 text-xs font-medium truncate">
                      {stream.user.displayName}
                    </p>
                  </div>

                  {/* Watch Button */}
                  <Link href={`/${lang}/streams/${stream.user.displayName}`}>
                    <Button
                      type="primary"
                      size="small"
                      className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-darker)] text-white font-medium text-xs h-6 rounded-full shadow-md hover:shadow-lg transition-all"
                      tabIndex={0}
                      aria-label={`Watch ${stream.user.displayName}'s stream`}
                    >
                      Watch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Fade Effect */}
        <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default GamingStreams; 