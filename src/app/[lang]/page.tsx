"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  StreamCategory,
  StreamCategorySkeleton,
} from "@/components/stream/StreamCategory";
import { HeroStreams } from "@/components/stream/HeroStreams";
import { Category, Stream } from "@/types/stream";
import api from "@/lib/api";

export default function RootPage() {
  const [liveStreams, setLiveStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingStreams, setIsLoadingStreams] = useState(true);
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
    const intervalId = setInterval(fetchStreams, 60000);

    return () => clearInterval(intervalId);
  }, []);

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
      {/* Hero Section with Featured Streams */}
      <div className="w-full px-0 overflow-hidden max-w-[100vw]">
        <HeroStreams
          featuredStreams={featuredStreams}
          isLoading={isLoadingStreams}
          className="max-w-full"
          aspectRatio="16/9"
        />
      </div>

      {/* Popular Live Streams - First section */}
      <div className="w-full px-2 md:px-4 mt-8">
        {isLoadingStreams ? (
          <StreamCategorySkeleton title="Popular Live Streams" />
        ) : (
          <StreamCategory
            title="Popular Live Streams"
            streams={liveStreams.slice(0, 10)}
            viewAllLink="/streams"
          />
        )}
      </div>

      {/* Categories with streams */}
      <div className="w-full px-2 md:px-4">
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
              viewAllLink={`/streams/category/${category.slug}`}
            />
          ))
        )}
      </div>

      {/* No streams message */}
      {!isLoadingStreams && liveStreams.length === 0 && (
        <div className="w-full text-center py-12">
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            No live streams available at the moment.
          </p>
          <p style={{ color: "var(--text-secondary)" }}>
            Check back later or start your own stream!
          </p>
        </div>
      )}
    </div>
  );
}
