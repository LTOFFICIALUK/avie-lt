"use client";
import api from "@/lib/api";
import { useSession } from "@/providers/SessionProvider";
import { Videos } from "@/types/videos";
import React, { useEffect, useState } from "react";
import VideoCard from "./(components)/VideoCard";
import VideoCardCarousel, { VideoCardCarouselSkeleton } from "./(components)/VideoCardCarousel";
import { LoadingOutlined } from "@ant-design/icons";

const ProfilePage = () => {
  const [loadingStreams, setIsLoadingStreams] = useState(true);
  const [streams, setStreams] = useState<Videos | undefined>();
  const [error, setError] = useState("");
  const { user } = useSession();

  const fetchRecentStreams = async () => {
    if (user?.displayName) {
      try {
        setIsLoadingStreams(true);
        const response = await api.get(
          `/api/stream/videos/${user.displayName}`
        );

        if (response.data.status === "success" && response.data.data) {
          setStreams(response.data.data);
        } else {
          setError("Failed to load streams");
        }
      } catch (err) {
        console.error("Error fetching streams:", err);
        setError("Failed to load streams");
      } finally {
        setIsLoadingStreams(false);
      }
    } else {
      // Set loading to false if there's no user
      setIsLoadingStreams(false);
    }
  };

  useEffect(() => {
    fetchRecentStreams();
  }, [user?.displayName]);

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {/* Show skeleton during loading */}
      {loadingStreams ? (
        <div className="w-full">
          <VideoCardCarouselSkeleton title="Videos" skeletonCount={6} />
        </div>
      ) : streams && streams.videos && streams.videos.length > 0 ? (
        // Show videos when loaded
        <VideoCardCarousel 
          title="Videos" 
          videos={streams.videos} 
          viewAllLink="/videos"
        />
      ) : (
        // Show empty state when no videos
        <div className="pt-8 pb-4 relative border-t border-[#2f2f34] w-full">
          <h2 className="text-white text-xl font-semibold m-0 mb-4 px-2">Videos</h2>
          <div className="text-[var(--text-secondary)] text-center py-12 border border-[var(--color-gray)]/20 rounded-md">
            No videos available
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
