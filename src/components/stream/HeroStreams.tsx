'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Button } from 'antd';
import { HeroCarousel } from './HeroCarousel';
import api from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Stream } from '../../types/stream';

const { Title } = Typography;

interface HeroStreamsProps {
  featuredStreams?: Stream[];
  aspectRatio?: string;
  className?: string;
  minHeight?: string;
  isLoading?: boolean;
}

// Skeleton component for Hero Streams loading state
export function HeroStreamsSkeleton({ 
  aspectRatio = "16/7",
  minHeight = "200px", 
  className = "" 
}: {
  aspectRatio?: string;
  minHeight?: string;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-[100vw] mx-auto rounded-lg overflow-hidden ${className}`}>
      <div 
        className="relative w-full overflow-hidden bg-[var(--color-gray)]/30 animate-pulse" 
        style={{ 
          aspectRatio,
          minHeight
        }}
      >
        {/* Content Placeholder */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-3 md:px-4 flex flex-col justify-center h-full max-w-full">
            <div className="max-w-xl mx-auto md:mx-0 md:ml-[10%]">
              {/* Category tag skeleton */}
              <div className="mb-1 md:mb-2">
                <div className="w-24 h-5 bg-[var(--color-gray)]/50 rounded"></div>
              </div>
              
              {/* Title skeleton */}
              <div className="h-7 w-full md:h-9 bg-[var(--color-gray)]/50 rounded mb-2"></div>
              <div className="h-7 w-2/3 md:h-9 bg-[var(--color-gray)]/50 rounded mb-4 hidden md:block"></div>
              
              {/* Info skeleton */}
              <div className="hidden xs:flex items-center gap-2 mb-3">
                <div className="w-20 h-4 bg-[var(--color-gray)]/50 rounded"></div>
                <div className="w-3 h-3 bg-[var(--color-gray)]/50 rounded-full"></div>
                <div className="w-24 h-4 bg-[var(--color-gray)]/50 rounded"></div>
              </div>
              
              {/* Button skeleton */}
              <div className="w-16 h-7 md:h-8 bg-[var(--color-accent)]/50 rounded"></div>
            </div>
          </div>
        </div>

        {/* Carousel skeleton - hidden on mobile */}
        <div className="absolute bottom-0 left-0 right-0 w-full hidden md:block">
          <div className="h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}

export function HeroStreams({ 
  featuredStreams, 
  aspectRatio = "16/7",
  className = "",
  minHeight = "200px",
  isLoading: forcedLoading
}: HeroStreamsProps) {
  const [streams, setStreams] = useState<Stream[]>(featuredStreams || []);
  const [isLoading, setIsLoading] = useState(!featuredStreams);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use forced loading state if provided
  const loading = forcedLoading !== undefined ? forcedLoading : isLoading;

  // Fetch streams if not provided as props
  useEffect(() => {
    if (featuredStreams && featuredStreams.length > 0) {
      // If streams are provided as props, use them
      setStreams(featuredStreams);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch them
    const fetchStreams = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/stream/streams');
        
        if (response.data.status === 'success') {
          const fetchedStreams = response.data.data || [];
          setStreams(fetchedStreams);
          setError(null);
        } else {
          throw new Error('Failed to fetch streams');
        }
      } catch (err) {
        console.error('Error fetching streams:', err);
        setError('Failed to load streams');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreams();
  }, [featuredStreams]);

  // Filter for featured streams - ones with thumbnails, highest viewer counts
  const carouselStreams = [...streams]
    .filter(stream => stream.isLive && stream.thumbnail)
    .sort((a, b) => b.viewers - a.viewers)
    .slice(0, 5);

  // Handle when carousel index changes in the child component
  const handleCarouselChange = (index: number) => {
    setCurrentIndex(index);
  };

  // Format viewer count
  const formatViewers = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  // Show skeleton during loading
  if (loading) {
    return <HeroStreamsSkeleton aspectRatio={aspectRatio} minHeight={minHeight} className={className} />;
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className={`w-full max-w-[100vw] mx-auto rounded-xl overflow-hidden shadow-lg ${className}`}>
      {/* Hero Section with Background and Content */}
      <div className="w-full overflow-hidden">
        {/* Background Image with current stream thumbnail */}
        {carouselStreams.length > 0 && (
          <div 
            className="relative w-full overflow-hidden bg-black rounded-xl" 
            style={{ 
              aspectRatio,
              minHeight
            }}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={carouselStreams[currentIndex]?.thumbnail || ''}
                alt={carouselStreams[currentIndex]?.title || 'Featured Stream'}
                fill
                priority
                quality={85}
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                className="transition-transform duration-500"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent" />
              <div className="absolute inset-0 bg-black/20" /> {/* Slight overall darkening for better text contrast */}
            </div>

            {/* Content - adjusted for better and more balanced spacing */}
            <div className="absolute inset-0 flex items-center overflow-hidden">
              <div className="container mx-auto px-2 sm:px-3 md:px-6 flex flex-col justify-center h-full max-w-[100vw]">
                <div className="max-w-xl mx-auto md:mx-0 md:ml-[5%] lg:ml-[8%] text-center md:text-left">
                  {/* Category tag - improved styling */}
                  <div className="mb-2 md:mb-3">
                    <span className="px-2 md:px-3 py-1 text-xs md:text-sm font-medium bg-[var(--color-accent)] text-white rounded-full">
                      {carouselStreams[currentIndex]?.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                  
                  {/* Stream Title - improved typography */}
                  <Title level={2} className="text-white mb-2 text-base sm:text-lg md:text-2xl lg:text-3xl line-clamp-1 md:line-clamp-2 m-0 font-bold">
                    {carouselStreams[currentIndex]?.title || 'Trending Stream'}
                  </Title>
                  
                  {/* Channel name and viewers - improved styling */}
                  <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 text-[var(--text-secondary)] mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
                    <span className="truncate font-medium max-w-[120px] sm:max-w-[200px]">{carouselStreams[currentIndex]?.user.displayName || 'LiveStreamCoin'}</span>
                    <span className="text-xs">•</span>
                    <span className="flex items-center">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-red-500 rounded-full mr-1 sm:mr-1.5 animate-pulse"></span>
                      {carouselStreams[currentIndex] ? formatViewers(carouselStreams[currentIndex].viewers) : '440'} Viewers
                    </span>
                  </div>
                  
                  {/* Watch Button - improved styling */}
                  <Link href={carouselStreams[currentIndex] ? `/en/streams/${carouselStreams[currentIndex].user.displayName}` : '/en/streams'}>
                    <Button 
                      type="primary" 
                      size="middle"
                      className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-darker)] text-white font-medium text-xs sm:text-sm px-3 sm:px-4 md:px-5 h-8 sm:h-9 md:h-10 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      Watch Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Carousel Overlay at the bottom - improved positioning and styling */}
            <div className="absolute bottom-3 md:bottom-6 left-0 right-0 w-full hidden md:flex items-center justify-center overflow-hidden">
              {/* Subtle dark gradient overlay for thumbnail visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent h-32 pointer-events-none"></div>
              <div className="relative z-10 w-full overflow-hidden">
                <HeroCarousel 
                  streams={carouselStreams}
                  onIndexChange={handleCarouselChange}
                  initialIndex={currentIndex}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 