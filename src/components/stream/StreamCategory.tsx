'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { StreamCard, StreamCardSkeleton } from './StreamCard';
import Link from 'next/link';
import { Stream } from '../../types/stream';

interface StreamCategoryProps {
  title: string;
  streams: Stream[];
  slug?: string; // Optional slug for linking to category page
  viewAllLink?: string; // Optional custom "View All" link
  isLoading?: boolean; // Added loading state
  skeletonCount?: number; // Number of skeletons to show while loading
}

export function StreamCategorySkeleton({ 
  title = "Loading...", 
  skeletonCount = 6 
}: {
  title?: string;
  skeletonCount?: number;
}) {
  return (
    <div className="w-full pt-8 pb-0 -mb-4 max-w-full overflow-hidden">
      {/* Small Breaker Line */}
      <div className="w-full mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        </div>

        {/* Navigation Controls Placeholder */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Streams Container */}
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2"
             style={{
               scrollbarWidth: 'none',
               msOverflowStyle: 'none',
             }}>
          {Array(skeletonCount).fill(0).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-60">
              <StreamCardSkeleton />
            </div>
          ))}
        </div>
      </div>
      
      {/* Add custom styles to hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export function StreamCategory({ 
  title, 
  streams, 
  slug, 
  viewAllLink,
  isLoading = false,
  skeletonCount = 6
}: StreamCategoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check if scrolling is needed and update arrow visibility
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10); // 10px buffer
  };

  // Scroll left or right by a certain amount
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
    const newScrollPosition = direction === 'left' 
      ? scrollContainerRef.current.scrollLeft - scrollAmount
      : scrollContainerRef.current.scrollLeft + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  // Initialize and update arrow visibility
  useEffect(() => {
    if (isLoading) return;
    
    checkScrollPosition();
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      
      // Check after images might have loaded
      const timer = setTimeout(checkScrollPosition, 1000);
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
        clearTimeout(timer);
      };
    }
    
    return () => {};
  }, [streams, isLoading]);

  // Get current locale from path
  const pathSegments = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
  const lang = pathSegments.length > 1 ? pathSegments[1] : 'en';

  // Determine the "View All" link
  const getCategoryLink = () => {
    if (viewAllLink) return viewAllLink;
    if (slug) return `/${lang}/streams/category/${slug}`;
    return null;
  };

  const categoryLink = getCategoryLink();

  // Show skeleton during loading state
  if (isLoading) {
    return <StreamCategorySkeleton title={title} skeletonCount={skeletonCount} />;
  }

  return (
    <section className="w-full pt-8 pb-0 -mb-4 max-w-full overflow-hidden">
      {/* Small Breaker Line */}
      <div className="w-full mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          {categoryLink && (
            <Link 
              href={categoryLink}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View all →
            </Link>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          <Button
            type="text"
            size="small"
            icon={<LeftOutlined />}
            onClick={() => scroll('left')}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
            style={{ 
              opacity: showLeftArrow ? 1 : 0.3,
              pointerEvents: showLeftArrow ? 'auto' : 'none'
            }}
            tabIndex={0}
            aria-label="Scroll left"
          />
          <Button
            type="text"
            size="small"
            icon={<RightOutlined />}
            onClick={() => scroll('right')}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
            style={{ 
              opacity: showRightArrow ? 1 : 0.3,
              pointerEvents: showRightArrow ? 'auto' : 'none'
            }}
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
          {streams.map(stream => (
            <div key={stream.id} className="flex-shrink-0 w-60">
              <StreamCard stream={stream} />
            </div>
          ))}
          
          {/* If no streams display a message */}
          {streams.length === 0 && (
            <div className="w-full py-4 text-center text-gray-400">
              No streams available in this category.
            </div>
          )}
        </div>
      </div>
      
      {/* Add custom styles to hide scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Add custom xs breakpoint */
        @media (min-width: 480px) {
          .xs\\:gap-3 {
            gap: 0.75rem;
          }
          .xs\\:min-w-\\[220px\\] {
            min-width: 220px;
          }
          .xs\\:max-w-\\[220px\\] {
            max-width: 220px;
          }
        }
      `}</style>
    </section>
  );
}
