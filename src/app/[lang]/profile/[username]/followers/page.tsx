"use client";
import api from "@/lib/api";
import { Followers } from "@/types/followers";
import React, { useEffect, useState } from "react";
import ProfileFollowers from "../../(components)/ProfileFollowers";

const Page = ({ params }: { params: { username: string } }) => {
  const [loadingFollowers, setIsLoadingFollowers] = useState(false);
  const [followers, setFollowers] = useState<Followers | undefined>();
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFollowers = async (page: number) => {
    try {
      setIsLoadingFollowers(true);
      const response = await api.get(
        `/api/profile/${params.username}/followers?page=${page}`
      );

      if (response.data.status === "success" && response.data.data) {
        setFollowers(response.data.data);
      } else {
        setError("Failed to load followers");
      }
    } catch (err) {
      console.error("Error fetching followers:", err);
      setError("Failed to load followers");
    } finally {
      setIsLoadingFollowers(false);
    }
  };

  useEffect(() => {
    fetchFollowers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-6">
      <ProfileFollowers
        loading={loadingFollowers}
        error={error}
        data={followers}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Page;
