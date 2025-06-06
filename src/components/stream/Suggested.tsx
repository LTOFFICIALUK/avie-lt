'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { StreamCard, StreamCardSkeleton } from './StreamCard';
import Link from 'next/link';
import { Stream } from '../../types/stream';
import { api } from '@/lib/api';

interface SuggestedProps {
  currentStreamId?: string; // ID of current stream to exclude from suggestions
  currentStreamCategory?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export function Suggested({ 
  currentStreamId,
  currentStreamCategory
}: SuggestedProps) {
  const [suggestedStreams, setSuggestedStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Fetch suggested streams
  const fetchSuggestedStreams = async () => {
    try {
      setIsLoading(true);
      
      // First, try to get streams from the same category
      let categoryStreams: Stream[] = [];
      if (currentStreamCategory?.slug) {
        try {
          const categoryResponse = await api.get(`/api/stream/streams/category/${currentStreamCategory.slug}`, {
            params: {
              limit: 15, // Get more than we need in case we need to filter out current stream
            },
          });
          
          if (categoryResponse.data.status === "success" && categoryResponse.data.data?.streams) {
            categoryStreams = categoryResponse.data.data.streams.filter(
              (stream: Stream) => stream.id !== currentStreamId
            );
          }
        } catch (err) {
          console.log('Category API not available, falling back to filtering all streams');
        }
      }
      
      // If we don't have enough streams from the category, get all streams
      if (categoryStreams.length < 5) {
        try {
          const allStreamsResponse = await api.get("/api/stream/streams");
          
          if (allStreamsResponse.data.status === "success" && allStreamsResponse.data.data) {
            let allStreams = allStreamsResponse.data.data.filter(
              (stream: Stream) => stream.id !== currentStreamId
            );
            
            // Separate streams by category
            const sameCategoryStreams = allStreams.filter(
              (stream: Stream) => stream.category?.id === currentStreamCategory?.id
            );
            
            const otherStreams = allStreams.filter(
              (stream: Stream) => stream.category?.id !== currentStreamCategory?.id
            );
            
                         // Sort by viewer count (highest first)
             sameCategoryStreams.sort((a: Stream, b: Stream) => b.viewers - a.viewers);
             otherStreams.sort((a: Stream, b: Stream) => b.viewers - a.viewers);
            
            // Combine: prioritize same category, then fill with top viewing streams
            let combinedStreams = [...sameCategoryStreams];
            
            // Fill up to 10 streams with top viewing streams from other categories
            const remainingSlots = Math.max(0, 10 - combinedStreams.length);
            if (remainingSlots > 0) {
              combinedStreams = [...combinedStreams, ...otherStreams.slice(0, remainingSlots)];
            }
            
            // Take up to 10 streams, but accept any number if that's all we have
            const finalStreams = combinedStreams.slice(0, 10);
            setSuggestedStreams(finalStreams);
          }
        } catch (err) {
          console.error("Error fetching all streams:", err);
          setError("Failed to load suggested streams");
        }
            } else {
        // We have enough from category, sort by viewers and take up to 10
         categoryStreams.sort((a: Stream, b: Stream) => b.viewers - a.viewers);
        const categoryOnlyStreams = categoryStreams.slice(0, 10);
        setSuggestedStreams(categoryOnlyStreams);
      }
      
    } catch (err) {
      console.error("Error fetching suggested streams:", err);
      setError("Failed to load suggested streams");
    } finally {
      setIsLoading(false);
    }
  };

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
  }, [suggestedStreams, isLoading]);

  // Fetch suggested streams on component mount and when dependencies change
  useEffect(() => {
    fetchSuggestedStreams();
  }, [currentStreamId, currentStreamCategory?.id]);

  // Get current locale from path
  const pathSegments = typeof window !== 'undefined' ? window.location.pathname.split('/') : [];
  const lang = pathSegments.length > 1 ? pathSegments[1] : 'en';

  // Get category link if available
  const categoryLink = currentStreamCategory?.slug 
    ? `/${lang}/streams/category/${currentStreamCategory.slug}`
    : null;

  // Show skeleton during loading state
  if (isLoading) {
    return (
      <section className="w-full pt-8 pb-0 -mb-4 max-w-full overflow-hidden">
        {/* Small Breaker Line */}
        <div className="w-full mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Suggested Streams</h2>
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
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-60">
                <StreamCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Only hide if we're not loading, have no error, and definitely have no streams after attempting to fetch
  if (!isLoading && !error && suggestedStreams.length === 0) {
    // For debugging: let's always show something instead of returning null
    return (
      <section className="w-full pt-8 pb-0 -mb-4 max-w-full overflow-hidden">
        {/* Small Breaker Line */}
        <div className="w-full mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Suggested Streams</h2>
          </div>
        </div>
        
        {/* No streams message */}
        <div className="w-full py-8 text-center text-gray-400">
          <p>No other live streams available at the moment.</p>
          <p className="text-sm mt-2">Check back later for more content!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-8 pb-0 -mb-4 max-w-full overflow-hidden">
      {/* Small Breaker Line */}
      <div className="w-full mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
      </div>

      {/* Section Header - Full width */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {currentStreamCategory ? `More ${currentStreamCategory.name}` : 'Suggested Streams'}
          </h2>
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
      
      {/* Streams Container - Full width */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 pb-2"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
        >
          {error ? (
            <div className="w-full py-4 text-center text-red-400">
              {error}
            </div>
          ) : (
            suggestedStreams.map(stream => (
              <div key={stream.id} className="flex-shrink-0 w-60">
                <StreamCard stream={stream} />
              </div>
            ))
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
      `}</style>
    </section>
  );
} 