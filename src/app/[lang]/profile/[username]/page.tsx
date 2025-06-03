"use client";
import api from "@/lib/api";
import { Videos } from "@/types/videos";
import React, { useEffect, useState } from "react";
import VideoCard from "../(components)/VideoCard";
import VideoCardCarousel from "../(components)/VideoCardCarousel";
import { LoadingOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";

const Page = () => {
  const [loadingStreams, setIsLoadingStreams] = useState(false);
  const [streams, setStreams] = useState<Videos | undefined>();
  const [error, setError] = useState("");
  const params = useParams();
  const username = params?.username as string;

  const fetchRecentStreams = async () => {
    try {
      setIsLoadingStreams(true);
      const response = await api.get(`/api/stream/videos/${username}`);

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
    fetchRecentStreams();
  }, [username]);

  return (
    <div className="flex flex-col gap-6 items-center">
      {loadingStreams && (
        <div className="flex justify-center">
          <LoadingOutlined />
        </div>
      )}
      {streams && streams.videos && (
        <VideoCardCarousel title="Videos" videos={streams.videos} />
      )}
    </div>
  );
};

export default Page;
