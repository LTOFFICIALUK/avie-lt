'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { Stream } from '../../types/stream';

interface HeroCarouselProps {
  streams: Stream[];
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
}

export function HeroCarousel({ streams, onIndexChange, initialIndex = 0 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [scrollerWidth, setScrollerWidth] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Filter to ensure we only show live streams with thumbnails
  const featuredStreams = streams.filter(stream => 
    stream.isLive && stream.thumbnail && stream.title
  ).slice(0, 5); // Limit to 5 streams for the carousel

  // Function to update current index and notify parent - use useCallback to memoize
  const updateCurrentIndex = useCallback((indexOrFn: number | ((prev: number) => number)) => {
    setCurrentIndex(prev => {
      const newIndex = typeof indexOrFn === 'function' ? indexOrFn(prev) : indexOrFn;
      // Notify parent component of index change if callback provided
      if (onIndexChange) {
        onIndexChange(newIndex);
      }
      return newIndex;
    });
  }, [onIndexChange]);

  useEffect(() => {
    function updateScrollerWidth() {
      if (scrollerRef.current) {
        setScrollerWidth(scrollerRef.current.offsetWidth);
      }
    }
    
    updateScrollerWidth();
    window.addEventListener('resize', updateScrollerWidth);
    
    return () => window.removeEventListener('resize', updateScrollerWidth);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || featuredStreams.length <= 1) return;
    
    const interval = setInterval(() => {
      updateCurrentIndex((prev) => (prev + 1) % featuredStreams.length);
    }, 8000); // Change slide every 8 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredStreams.length, updateCurrentIndex]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Navigation functions
  const goToNext = () => {
    updateCurrentIndex((prev) => (prev + 1) % featuredStreams.length);
  };

  const goToPrev = () => {
    updateCurrentIndex((prev) => (prev - 1 + featuredStreams.length) % featuredStreams.length);
  };

  // If no featured streams, don't render
  if (featuredStreams.length === 0) return null;

  // Calculate thumbnail scroller position based on currently selected
  const getScrollPosition = () => {
    if (!scrollerWidth) return 0;
    
    // Dynamically calculate thumbnail width based on screen size
    // This needs to match the widths in the CSS classes
    let thumbnailWidth = 80; // Default for mobile (w-[80px] + gap)
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 768) {
        thumbnailWidth = 120; // md and up (w-[120px] + gap)
      } else if (window.innerWidth >= 640) {
        thumbnailWidth = 100; // sm (w-[100px] + gap)
      }
    }
    
    const centerPosition = scrollerWidth / 2;
    const centerThumbnail = currentIndex * thumbnailWidth + thumbnailWidth / 2;
    
    return Math.max(0, centerThumbnail - centerPosition);
  };

  // Only show navigation arrows if more than one stream
  const showNavigation = featuredStreams.length > 1;

  return (
    <div className="w-full max-w-[100vw] mx-auto overflow-hidden">
      {/* Thumbnails Carousel */}
      <div 
        className="w-full relative z-30 flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Thumbnails container */}
        <div 
          ref={scrollerRef}
          className="w-full flex items-center justify-center bg-transparent relative px-4 sm:px-6 md:px-8 py-2 md:py-4"
        >
          {/* Left navigation button - only show if multiple streams and positioned within container flow */}
          {showNavigation && (
            <button 
              onClick={goToPrev}
              className="absolute left-1 z-30 flex items-center justify-center rounded-full bg-black/70 border border-[var(--color-brand)]/40 w-6 h-6 md:w-8 md:h-8 hover:bg-[var(--color-brand)]/80 transition-all duration-200"
              style={{ 
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <LeftOutlined className="text-white text-xs" />
            </button>
          )}

          {/* Thumbnails scroller with fixed height to match navigation */}
          <div 
            className="overflow-hidden mx-auto w-full h-[60px] md:h-[70px]"
            style={{ 
              maxWidth: 'calc(100% - 30px)'
            }}
          >
            <div 
              className="flex transition-transform duration-300 ease-out gap-2 sm:gap-3 md:gap-4 h-full items-center justify-center"
              style={{ 
                transform: featuredStreams.length > 1 ? `translateX(-${getScrollPosition()}px)` : 'none',
              }}
            >
              {featuredStreams.map((stream, index) => {
                const isActive = index === currentIndex;
                return (
                  <div 
                    key={stream.id}
                    className={`transition-all duration-300 flex items-center justify-center h-full w-[80px] sm:w-[100px] md:w-[120px] shrink-0`}
                    style={{ 
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                      zIndex: isActive ? 10 : 1,
                    }}
                  >
                    <div
                      onClick={() => updateCurrentIndex(index)}
                      className={`w-[70px] sm:w-[80px] md:w-[100px] h-[40px] sm:h-[50px] md:h-[60px] rounded-md overflow-hidden focus:outline-none transition-all duration-300 cursor-pointer ${
                        isActive 
                          ? 'ring-2 ring-[var(--color-brand)] shadow-[0_0_12px_rgba(132,238,245,0.5)]' 
                          : 'ring-1 ring-white/10 hover:ring-white/40 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="relative w-full h-full overflow-hidden rounded-md">
                        <Image
                          src={stream.thumbnail || ''}
                          alt={stream.title}
                          fill
                          sizes="(max-width: 640px) 70px, (max-width: 768px) 80px, 100px"
                          style={{ 
                            objectFit: 'cover'
                          }}
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right navigation button - only show if multiple streams and positioned within container flow */}
          {showNavigation && (
            <button 
              onClick={goToNext}
              className="absolute right-1 z-30 flex items-center justify-center rounded-full bg-black/70 border border-[var(--color-brand)]/40 w-6 h-6 md:w-8 md:h-8 hover:bg-[var(--color-brand)]/80 transition-all duration-200"
              style={{ 
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <RightOutlined className="text-white text-xs" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 