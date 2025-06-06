"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Typography, Spin, Pagination, Empty, Select } from "antd";
import { LoadingOutlined, FilterOutlined } from "@ant-design/icons";
import api from "@/lib/api";
import { StreamCard } from "@/components/stream/StreamCard";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Category, Stream } from "@/types/stream";

const { Title } = Typography;
const { Option } = Select;

interface PaginationInfo {
  page: number;
  limit: number;
  totalStreams: number;
  totalPages: number;
}

type SortOption = 'viewers_desc' | 'viewers_asc' | 'recent' | 'oldest';

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [streams, setStreams] = useState<Stream[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    totalStreams: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('viewers_desc');

  // Fetch streams by category
  const fetchCategoryStreams = useCallback(
    async (page: number = 1, sort: SortOption = sortBy) => {
      try {
        setIsLoading(true);

        const response = await api.get(`/api/stream/streams/category/${slug}`, {
          params: {
            page,
            limit: 12,
            sortBy: sort,
          },
        });

        if (response.data.status === "success") {
          const { streams, pagination, category } = response.data.data;
          
          // Apply client-side sorting if API doesn't support it
          let sortedStreams = streams || [];
          switch (sort) {
            case 'viewers_desc':
              sortedStreams = [...sortedStreams].sort((a, b) => b.viewers - a.viewers);
              break;
            case 'viewers_asc':
              sortedStreams = [...sortedStreams].sort((a, b) => a.viewers - b.viewers);
              break;
            case 'recent':
              sortedStreams = [...sortedStreams].sort((a, b) => 
                new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
              );
              break;
            case 'oldest':
              sortedStreams = [...sortedStreams].sort((a, b) => 
                new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
              );
              break;
          }
          
          setStreams(sortedStreams);
          setPagination(pagination);
          setCategory(category);
          setError(null);
        } else {
          throw new Error("Failed to fetch category streams");
        }
      } catch (err) {
        console.error("Error fetching category streams:", err);
        setError("Failed to load streams for this category");
      } finally {
        setIsLoading(false);
      }
    },
    [slug, sortBy]
  );

  useEffect(() => {
    if (slug) {
      fetchCategoryStreams(currentPage, sortBy);
    }
  }, [slug, currentPage, sortBy, fetchCategoryStreams]);

  // Handle pagination change
  const handlePageChange = (page: number) => {
    router.push(`/streams/category/${slug}?page=${page}`);
  };

  // Handle sort change
  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    // Reset to page 1 when changing sort
    if (currentPage !== 1) {
      router.push(`/streams/category/${slug}`);
    }
  };

  return (
    <div className="flex min-h-screen w-full relative bg-background">
      <main className="flex-1 p-4 lg:p-6 w-full max-w-[2000px] mx-auto">
        <div className="mb-6">
          <Link
            href="/streams"
            className="text-gray-400 hover:text-white transition-colors mb-4 inline-block"
          >
            ← Back to All Streams
          </Link>

          <div className="flex items-start justify-between gap-4 mt-2 mb-6">
            <div className="flex-1">
              <Title level={2} className="text-white mb-2">
                {isLoading ? "Loading..." : category?.name || "Category"}
              </Title>

              {category?.description && (
                <p className="text-gray-400 mt-1 max-w-3xl">
                  {category.description}
                </p>
              )}
            </div>

            {/* Filter Dropdown */}
            {!isLoading && streams.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <FilterOutlined className="text-gray-400" />
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-44"
                  size="small"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                >
                  <Option value="viewers_desc">Most Viewers</Option>
                  <Option value="viewers_asc">Least Viewers</Option>
                  <Option value="recent">Recently Started</Option>
                  <Option value="oldest">Oldest First</Option>
                </Select>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 40, color: "white" }}
                  spin
                />
              }
            />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {streams.length > 0 ? (
              <div className="w-full">
                {/* Streams Container - Horizontal Scrolling */}
                <div className="relative">
                  <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2"
                       style={{
                         scrollbarWidth: 'none',
                         msOverflowStyle: 'none',
                       }}>
                    {streams.map((stream) => (
                      <div key={stream.id} className="flex-shrink-0 w-60">
                        <StreamCard stream={stream} />
                      </div>
                    ))}
                  </div>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      current={pagination.page}
                      total={pagination.totalStreams}
                      pageSize={pagination.limit}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Empty
                description="No streams found in this category"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ color: "white", marginTop: "2rem" }}
              />
            )}
          </>
        )}
      </main>

      {/* Add custom styles to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
