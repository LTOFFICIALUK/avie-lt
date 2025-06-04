"use client";

import React, { useEffect, useState } from "react";
import { Typography, Spin, Input, Card, Empty } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/stream";

const { Title } = Typography;
const { Meta } = Card;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/categories", {
        params: {
          limit: 100, // Get more categories at once
        },
      });

      if (response.data.status === "success") {
        const categoriesData = response.data.data.categories || [];
        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
        setError(null);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          (category.description &&
            category.description.toLowerCase().includes(query))
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  // Default placeholder image if category has no image
  const defaultCategoryImage =
    "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1000";

  return (
    <div className="flex min-h-screen w-full relative bg-background">
      <main className="flex-1 p-4 lg:p-6 w-full max-w-[2000px] mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link
                href="/streams"
                className="text-gray-400 hover:text-white transition-colors mb-2 inline-block"
              >
                ← Back to Streams
              </Link>
              <Title level={2} className="text-white mt-2 mb-1">
                Browse Categories
              </Title>
              <p className="text-gray-400">Discover streams by categories</p>
            </div>

            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                maxWidth: "300px",
                background: "#1f1f23",
                borderColor: "#2f2f35",
              }}
              className="text-white"
              allowClear
            />
          </div>

          {/* Divider Line */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-6"></div>

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
              {filteredCategories.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/streams/category/${category.slug}`}
                    >
                      <Card
                        hoverable
                        cover={
                          <div className="aspect-video relative bg-gray-800 overflow-hidden">
                            <Image
                              src={category.imageUrl || defaultCategoryImage}
                              alt={category.name}
                              fill
                              objectFit="cover"
                              className="transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-md">
                              {category._count.streams} live
                            </div>
                          </div>
                        }
                        className="bg-secondary border-none"
                      >
                        <Meta
                          title={
                            <span className="text-white">{category.name}</span>
                          }
                          description={
                            <span className="text-gray-400 line-clamp-2">
                              {category.description ||
                                `Explore ${category.name} streams`}
                            </span>
                          }
                        />
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Empty
                  description="No categories found matching your search"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ color: "var(--text-secondary)", marginTop: "3rem" }}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
