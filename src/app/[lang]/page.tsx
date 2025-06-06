"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  StreamCategory,
  StreamCategorySkeleton,
} from "@/components/stream/StreamCategory";
import { HeroStreams } from "@/components/stream/HeroStreams";
import HeroStreamCard from "@/components/lang-page/HeroStreamCard";

import { Category, Stream } from "@/types/stream";
import { Video } from "@/types/videos";
import api from "@/lib/api";

export default function RootPage() {
  const [liveStreams, setLiveStreams] = useState<Stream[]>([]);
  const [recentStreams, setRecentStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingStreams, setIsLoadingStreams] = useState(true);
  const [isLoadingRecentStreams, setIsLoadingRecentStreams] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { lang } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      router.push(`/${lang}/landing`);
    }
  }, []);

  // Fetch all live streams
  const fetchStreams = async () => {
    try {
      setIsLoadingStreams(true);
      const response = await api.get("/api/stream/streams");

      if (response.data.status === "success" && response.data.data) {
        // Sort streams by viewer count (highest first)
        const sortedStreams = [...response.data.data].sort(
          (a, b) => b.viewers - a.viewers
        );
        setLiveStreams(sortedStreams);
      } else {
        setError("Failed to load streams");
      }
    } catch (err) {
      console.error("Error fetching streams:", err);
      setError("Failed to load streams");
    } finally {
      setIsLoadingStreams(false);
    }
  };

  // Fetch recently ended streams by getting videos from various users
  const fetchRecentStreams = async () => {
    try {
      setIsLoadingRecentStreams(true);
      
      // Get a list of users to check for recent streams
      // Start with current live streamers (they likely have recent ended streams)
      let usersToCheck = liveStreams.map(stream => stream.user.displayName).slice(0, 5);
      
      // Add some fallback known users if we don't have enough live streamers
      const fallbackUsers = ['LiveStreamCoin', 'cryptotrader', 'gamingmaster', 'nftartist', 'trader_pro'];
      usersToCheck = [...new Set([...usersToCheck, ...fallbackUsers])].slice(0, 10);
      
      let allRecentVideos: Video[] = [];
      
      // Fetch recent videos from each user
      const fetchPromises = usersToCheck.map(async (username) => {
        try {
          const response = await api.get(`/api/stream/videos/${username}`);
          if (response.data.status === "success" && response.data.data?.videos) {
            // Take the most recent 2 videos from each user
            return response.data.data.videos.slice(0, 2);
          }
        } catch (err) {
          // If user doesn't exist or has no videos, return empty array
          console.log(`No videos found for user: ${username}`);
        }
        return [];
      });
      
      // Execute all API calls in parallel for better performance
      const results = await Promise.all(fetchPromises);
      allRecentVideos = results.flat();
      
      // Sort by endedAt date (most recent first) and take top 3
      allRecentVideos.sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime());
      const recentVideos = allRecentVideos.slice(0, 3);
      
      // Convert Video objects to Stream objects for compatibility
      const convertedStreams: Stream[] = recentVideos.map((video, index) => ({
        id: `recent-${index}-${video.user.id}`,
        isLive: false,
        startedAt: video.startedAt,
        title: video.title,
        viewers: video.maxViewers || video.viewers || 0, // Use maxViewers for recently ended streams
        thumbnail: video.thumbnail,
        category: { id: 'recent', name: 'Recently Ended', slug: 'recent' },
        user: {
          displayName: video.user.displayName,
          avatarUrl: video.user.avatarUrl,
          bio: null
        }
      }));
      
      setRecentStreams(convertedStreams);
    } catch (err) {
      console.error("Error fetching recent streams:", err);
      // Keep empty array on error - will show fallback cards
      setRecentStreams([]);
    } finally {
      setIsLoadingRecentStreams(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await api.get("/api/categories");

      if (response.data.status === "success" && response.data.data) {
        // Extract the categories array from the response
        const categoriesData = response.data.data.categories || [];
        setCategories(categoriesData);
      } else {
        setError("Failed to load categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchStreams();
    fetchCategories();

    // Refresh streams data every 60 seconds
    const intervalId = setInterval(() => {
      fetchStreams();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch recent streams after live streams are loaded
  useEffect(() => {
    if (!isLoadingStreams) {
      fetchRecentStreams();
    }
  }, [isLoadingStreams, liveStreams]);

  // Refresh recent streams every 5 minutes (less frequent than live streams)
  useEffect(() => {
    const recentStreamsInterval = setInterval(() => {
      fetchRecentStreams();
    }, 300000); // 5 minutes

    return () => clearInterval(recentStreamsInterval);
  }, [liveStreams]);

  // Group streams by category
  const streamsByCategory = categories.map((category) => {
    const categoryStreams = liveStreams.filter(
      (stream) => stream.category?.id === category.id
    );

    return {
      category,
      streams: categoryStreams,
    };
  });

  // Identify categories with streams for display
  const categoriesWithStreams = streamsByCategory.filter(
    ({ streams }) => streams.length > 0
  );

  // Get featured streams (top 5 by viewer count)
  const featuredStreams = liveStreams.slice(0, 5);

  // Show loading error if both streams and categories failed to load
  if (error && !isLoadingStreams && !isLoadingCategories) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg max-w-md text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full overflow-hidden max-w-[100vw]">
      {/* Desktop Layout with Hero Section Container - Only show if there are streams or loading */}
      {(isLoadingStreams || liveStreams.length > 0) && (
        <div className="hidden xl:block w-full overflow-hidden">
          {/* Hero Frame Container - Tightly wrapped, positioned at top */}
          <div className="w-full flex justify-center pt-4">
            <div 
              className="flex flex-row overflow-hidden rounded-lg"
              style={{
                transform: 'scale(var(--hero-scale, 1))',
                transformOrigin: 'center top',
                '--hero-scale': 'min(calc((100vw - 2rem) / 1400px), 1)'
              } as React.CSSProperties}
            >
              {/* Main Hero Stream Area */}
              <div className="flex flex-col overflow-hidden min-w-0 w-[900px]">
                <div className="w-full px-0 overflow-hidden">
                  <HeroStreams
                    featuredStreams={featuredStreams}
                    isLoading={isLoadingStreams}
                    className="max-w-full h-full"
                    aspectRatio="16/9"
                  />
                </div>
              </div>

              {/* Hero Stream Cards Sidebar */}
              <div className="w-[500px] p-6 pt-0 overflow-y-auto flex flex-col">
                <div className="space-y-4">
                  {/* Only 3 Trench Trading Cards with actual stream data */}
                  {featuredStreams.slice(0, 3).map((stream, index) => (
                    <HeroStreamCard 
                      key={`${stream.id}-${index}`}
                      stream={stream}
                    />
                  ))}
                  {/* Show the same stream again if not enough streams */}
                  {featuredStreams.length > 0 && featuredStreams.length < 3 && 
                    Array.from({ length: 3 - featuredStreams.length }).map((_, index) => (
                      <HeroStreamCard 
                        key={`fallback-${index}`}
                        stream={featuredStreams[0]} // Use the first available stream
                      />
                    ))
                  }
                  {/* Only show offline cards if no streams at all */}
                  {featuredStreams.length === 0 && (
                    isLoadingRecentStreams ? (
                      // Show loading skeletons while fetching recent streams
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={`skeleton-${index}`} className="bg-transparent border border-gray-700/50 rounded-lg overflow-hidden flex shadow-lg h-32 w-full max-w-none p-3 animate-pulse">
                          <div className="w-44 flex-shrink-0 bg-gray-800 rounded-lg"></div>
                          <div className="flex-1 pl-3 space-y-2">
                            <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                            <div className="h-6 bg-gray-700 rounded-full w-20 mt-auto"></div>
                          </div>
                        </div>
                      ))
                    ) : recentStreams.length > 0 ? (
                      // Show actual recent streams
                      recentStreams.map((stream, index) => (
                        <HeroStreamCard 
                          key={`recent-${stream.id}-${index}`}
                          stream={stream}
                          isOffline={true}
                        />
                      ))
                    ) : (
                      // Fallback to placeholder cards if no recent streams available
                      Array.from({ length: 3 }).map((_, index) => (
                        <HeroStreamCard 
                          key={`fallback-offline-${index}`}
                          stream={{
                            id: `fallback-offline-${index}`,
                            isLive: false,
                            startedAt: new Date().toISOString(),
                            title: 'No Recent Streams',
                            viewers: 0,
                            thumbnail: null,
                            category: { id: 'general', name: 'General', slug: 'general' },
                            user: {
                              displayName: 'LiveStreamCoin',
                              avatarUrl: null,
                              bio: null
                            }
                          }}
                          isOffline={true}
                        />
                      ))
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile/Tablet Layout (Original Layout) - Only show if there are streams or loading */}
      {(isLoadingStreams || liveStreams.length > 0) && (
        <div className="xl:hidden flex flex-col w-full overflow-hidden max-w-[100vw]">
          {/* Hero Section with Featured Streams */}
          <div className="w-full px-2 md:px-4 overflow-hidden max-w-[100vw]">
            <HeroStreams
              featuredStreams={featuredStreams}
              isLoading={isLoadingStreams}
              className="max-w-full"
              aspectRatio="16/9"
            />
          </div>
        </div>
      )}

      {/* Category Sections - Show on all screen sizes */}
      <div className="w-full flex flex-col max-w-[100vw]">
        {/* Featured Streams - First section */}
        <div className="w-full px-2 md:px-4 xl:px-4 -mt-2 sm:-mt-2 overflow-visible">
          <div className="xl:max-w-7xl xl:mx-auto overflow-visible">
            {isLoadingStreams ? (
              <StreamCategorySkeleton title="Featured Streams" />
            ) : (
              <StreamCategory
                title="Featured Streams"
                streams={liveStreams.slice(0, 10)}
              />
            )}
          </div>
        </div>

        {/* Categories with streams */}
        <div className="w-full px-2 md:px-4 xl:px-4 overflow-visible">
          <div className="xl:max-w-7xl xl:mx-auto overflow-visible">
            {isLoadingCategories ? (
              // Show skeletons while loading
              <>
                <StreamCategorySkeleton title="Loading Category..." />
                <StreamCategorySkeleton title="Loading Category..." />
              </>
            ) : (
              // Show actual categories with streams
              categoriesWithStreams.map(({ category, streams }) => (
                <StreamCategory
                  key={category.id}
                  title={category.name}
                  streams={streams}
                  slug={category.slug}
                  viewAllLink={`/${lang}/streams/category/${category.slug}`}
                />
              ))
            )}
          </div>
        </div>

        {/* No streams message */}
        {!isLoadingStreams && liveStreams.length === 0 && (
          <div className="w-full text-center py-12">
            <div className="xl:max-w-7xl xl:mx-auto">
              <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                No live streams available at the moment.
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                Check back later or start your own stream!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

