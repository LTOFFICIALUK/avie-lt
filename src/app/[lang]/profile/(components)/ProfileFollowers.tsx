import { Followers } from "@/types/followers";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import Link from "next/link";
import React from "react";
import Pagination from "./Pagination";

interface Props {
  loading: boolean;
  error: string;
  data?: Followers;
  onPageChange: (page: number) => void;
}

const ProfileFollowers = ({ loading, error, data, onPageChange }: Props) => {
  const { lang } = useParams();

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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.followers.map((follower) => (
          <Link 
            key={follower.id} 
            href={`/${lang}/profile/${follower.displayName}`}
            className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-20 h-20">
              {follower.avatarUrl ? (
                <div className="w-20 h-20 overflow-hidden rounded-full">
                  <img
                    src={follower.avatarUrl}
                    alt={follower.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 overflow-hidden rounded-full flex items-center justify-center bg-[var(--color-gray)]">
                  <UserOutlined style={{ fontSize: "40px" }} />
                </div>
              )}

              {follower.isVerified && (
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-center hover:text-gray-300 transition-colors cursor-pointer">
              {follower.displayName}
            </span>
          </Link>
        ))}
      </div>
      <Pagination
        currentPage={data.pagination.currentPage}
        pageSize={data.pagination.pageSize}
        totalItems={data.pagination.totalItems}
        onChange={onPageChange}
      />
    </div>
  );
};

export default ProfileFollowers;
