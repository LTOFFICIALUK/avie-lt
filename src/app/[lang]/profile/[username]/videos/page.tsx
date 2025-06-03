"use client";
import api from "@/lib/api";
import { Videos } from "@/types/videos";
import React, { useEffect, useState } from "react";
import ProfileVideos from "../../(components)/ProfileVideos";

const Page = ({ params }: { params: { username: string } }) => {
  const [loadingStreams, setIsLoadingStreams] = useState(false);
  const [streams, setStreams] = useState<Videos | undefined>();
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecentStreams = async (page: number) => {
    try {
      setIsLoadingStreams(true);
      const response = await api.get(
        `/api/stream/videos/${params.username}?page=${page}`
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
  };

  useEffect(() => {
    fetchRecentStreams(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6">
      <ProfileVideos
        loading={loadingStreams}
        error={error}
        data={streams}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Page;
