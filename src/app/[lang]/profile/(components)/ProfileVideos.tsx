import { Videos } from "@/types/videos";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
import VideoCardGrid from "./VideoCardGrid";
import Pagination from "./Pagination";

interface Props {
  loading: boolean;
  error: string;
  data?: Videos;
  onPageChange: (page: number) => void;
}

const ProfileVideos = ({ loading, error, data, onPageChange }: Props) => {
  if (loading) {
    return (
      <div className="flex justify-center">
        <LoadingOutlined />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-12">
      <VideoCardGrid videos={data.videos} title="Videos" />
      <Pagination
        currentPage={data.pagination.currentPage}
        pageSize={data.pagination.pageSize}
        totalItems={data.pagination.totalItems}
        onChange={onPageChange}
      />
    </div>
  );
};

export default ProfileVideos;
