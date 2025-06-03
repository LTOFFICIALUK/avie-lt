import { Video } from "@/types/videos";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import VideoCard, { VideoCardSkeleton } from "./VideoCard";
import Link from "next/link";

interface Props {
  videos: Video[];
  title: string;
  isLoading?: boolean;
  skeletonCount?: number;
  viewAllLink?: string;
}

export function VideoCardCarouselSkeleton({ 
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
      
      {/* Scrollable Video Cards Container with skeletons */}
      <div className="flex gap-2 xs:gap-3 sm:gap-4 overflow-hidden pb-2 hide-scrollbar px-1 sm:px-2 w-full">
        {Array(skeletonCount).fill(0).map((_, index) => (
          <div key={index} className="min-w-[200px] xs:min-w-[220px] sm:min-w-[280px] max-w-[200px] xs:max-w-[220px] sm:max-w-[280px] flex-shrink-0">
            <VideoCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

const VideoCardCarousel = ({ videos, title, isLoading = false, skeletonCount = 6, viewAllLink }: Props) => {
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
  }, [videos, isLoading]);

  // Show skeleton during loading state
  if (isLoading) {
    return <VideoCardCarouselSkeleton title={title} skeletonCount={skeletonCount} />;
  }

  if (!videos.length) {
    return (
      <div className="pt-8 pb-4 relative border-t border-[#2f2f34] max-w-full">
        <h2 className="text-white text-xl font-semibold m-0 mb-4 px-2">{title}</h2>
        <div className="text-[var(--text-secondary)] text-center py-8">
          No videos available
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-4 relative border-t border-[#2f2f34] max-w-full overflow-hidden">
      {/* Category Title */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-white text-xl font-semibold m-0">
          {title}
        </h2>
        
        {viewAllLink && (
          <div className="flex items-center">
            <Link 
              href={viewAllLink}
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
      
      {/* Main carousel container */}
      <div className="relative">
        {/* Scrollable Video Cards Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-2 xs:gap-3 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar px-1 sm:px-2 w-full"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth'
          }}
        >
          {videos.map(video => (
            <div key={video.vodUrl} className="min-w-[200px] xs:min-w-[220px] sm:min-w-[280px] max-w-[200px] xs:max-w-[220px] sm:max-w-[280px] flex-shrink-0 video-card-item">
              <VideoCard video={video} />
            </div>
          ))}
        </div>

        {/* Navigation arrows container - positioned in the middle of carousel */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex items-center justify-between">
          {/* Left Arrow */}
          {showLeftArrow && (
            <Button 
              icon={<LeftOutlined />} 
              onClick={() => scroll('left')}
              className="pointer-events-auto flex items-center justify-center ml-0"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            />
          )}
          
          {/* Empty div to maintain flex spacing */}
          <div></div>
          
          {/* Right Arrow */}
          {showRightArrow && (
            <Button 
              icon={<RightOutlined />} 
              onClick={() => scroll('right')}
              className="pointer-events-auto flex items-center justify-center mr-0"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            />
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
    </div>
  );
};

export default VideoCardCarousel;
