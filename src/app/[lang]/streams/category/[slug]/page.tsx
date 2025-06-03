"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Typography, Spin, Pagination, Empty } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import api from "@/lib/api";
import { StreamCard } from "@/components/stream/StreamCard";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Category, Stream } from "@/types/stream";

const { Title } = Typography;

interface PaginationInfo {
  page: number;
  limit: number;
  totalStreams: number;
  totalPages: number;
}

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

  // Fetch streams by category
  const fetchCategoryStreams = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);

        const response = await api.get(`/api/stream/streams/category/${slug}`, {
          params: {
            page,
            limit: 12,
          },
        });

        if (response.data.status === "success") {
          const { streams, pagination, category } = response.data.data;
          setStreams(streams || []);
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
    [slug]
  );

  useEffect(() => {
    if (slug) {
      fetchCategoryStreams(currentPage);
    }
  }, [slug, currentPage, fetchCategoryStreams]);

  // Handle pagination change
  const handlePageChange = (page: number) => {
    router.push(`/streams/category/${slug}?page=${page}`);
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

          <Title level={2} className="text-white mt-2 mb-2">
            {isLoading ? "Loading..." : category?.name || "Category"}
          </Title>

          {category?.description && (
            <p className="text-gray-400 mt-1 mb-6 max-w-3xl">
              {category.description}
            </p>
          )}
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
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                {streams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            ) : (
              <Empty
                description="No streams found in this category"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ color: "white", marginTop: "2rem" }}
              />
            )}

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
          </>
        )}
      </main>
    </div>
  );
}
