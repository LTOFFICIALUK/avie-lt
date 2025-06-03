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
    <div className="pt-8 pb-4 relative border-t border-[#2f2f34] max-w-full overflow-hidden">
      {/* Category Title with loading effect */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-white text-xl font-semibold m-0">
          {title}
        </h2>
      </div>
      
      {/* Scrollable Stream Cards Container with skeletons */}
      <div className="flex gap-2 xs:gap-3 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar px-1 sm:px-2 w-full">
        {Array(skeletonCount).fill(0).map((_, index) => (
          <div key={index} className="min-w-[200px] xs:min-w-[220px] sm:min-w-[280px] max-w-[200px] xs:max-w-[220px] sm:max-w-[280px] flex-shrink-0">
            <StreamCardSkeleton />
          </div>
        ))}
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

  // Determine the "View All" link
  const getCategoryLink = () => {
    if (viewAllLink) return viewAllLink;
    if (slug) return `/streams/category/${slug}`;
    return null;
  };

  const categoryLink = getCategoryLink();

  // Show skeleton during loading state
  if (isLoading) {
    return <StreamCategorySkeleton title={title} skeletonCount={skeletonCount} />;
  }

  return (
    <div className="pt-8 pb-4 relative border-t border-[#2f2f34] max-w-full overflow-hidden">
      {/* Category Title - exactly as in the image */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-white text-xl font-semibold m-0">
          {title}
        </h2>
        
        {categoryLink && (
          <div className="flex items-center">
            <Link 
              href={categoryLink}
              className="text-xs hover:text-white transition-colors flex items-center"
              style={{ color: 'var(--text-secondary)' }}
            >
              Show more{' '}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"></path>
              </svg>
            </Link>
          </div>
        )}
      </div>
      
      {/* Navigation Arrows - styled to match the image exactly */}
      {showLeftArrow && (
        <Button 
          icon={<LeftOutlined />} 
          onClick={() => scroll('left')}
          className="absolute left-0 sm:-left-1 top-1/2 z-10 transform -translate-y-1/2 flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(30,30,30,0.7)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            marginTop: '10px'
          }}
        />
      )}
      
      {showRightArrow && (
        <Button 
          icon={<RightOutlined />} 
          onClick={() => scroll('right')}
          className="absolute right-0 sm:-right-1 top-1/2 z-10 transform -translate-y-1/2 flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(30,30,30,0.7)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            marginTop: '10px'
          }}
        />
      )}
      
      {/* Scrollable Stream Cards Container - 1:1 with the image */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 xs:gap-3 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar px-1 sm:px-2 w-full"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth'
        }}
      >
        {streams.map(stream => (
          <div key={stream.id} className="min-w-[200px] xs:min-w-[220px] sm:min-w-[280px] max-w-[200px] xs:max-w-[220px] sm:max-w-[280px] flex-shrink-0">
            <StreamCard stream={stream} />
          </div>
        ))}
        
        {/* If no streams display a message */}
        {streams.length === 0 && (
          <div className="w-full py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
            No streams available in this category.
          </div>
        )}
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
    </div>
  );
}
