'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Select, Empty, Pagination, Spin, message } from 'antd';
import { PlusOutlined, ScissorOutlined } from '@ant-design/icons';
import { ClipCard, ClipCardSkeleton } from '@/components/stream/ClipCard';
import { api } from '@/lib/api';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Option } = Select;

interface Clip {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration: number;
  viewCount: number;
  createdAt: string;
  streamer: {
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  clipper: {
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  stream: {
    title: string;
  };
}

interface ClipsResponse {
  clips: Clip[];
  pagination: {
    page: number;
    limit: number;
    totalClips: number;
    totalPages: number;
  };
}

export default function ClipsPage() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClips, setTotalClips] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('recent');

  const fetchClips = async (page: number = 1, sort: string = 'recent') => {
    try {
      setLoading(true);
      const response = await api.get(`/api/stream/clips?page=${page}&limit=20&sortBy=${sort}`);
      
      if (response.data.status === 'success') {
        const data: ClipsResponse = response.data.data;
        setClips(data.clips);
        setTotalClips(data.pagination.totalClips);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      }
    } catch (error: any) {
      console.error('Error fetching clips:', error);
      if (error.response?.status === 401) {
        message.error('Please log in to view your clips');
      } else {
        message.error('Failed to load clips');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips(currentPage, sortBy);
  }, [currentPage, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchClips(page, sortBy);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchClips(1, value);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Title level={1} style={{ color: 'var(--text-primary)', margin: 0, fontSize: '32px' }}>
              My Clips
            </Title>
            <Text style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              Manage and view your created clips
            </Text>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <Select
              value={sortBy}
              onChange={handleSortChange}
              style={{ width: 140 }}
              size="large"
            >
              <Option value="recent">Most Recent</Option>
              <Option value="views">Most Viewed</Option>
              <Option value="duration">Longest</Option>
            </Select>

            {/* Create clip button */}
            <Link href="/browse">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{
                  backgroundColor: 'var(--color-brand)',
                  borderColor: 'var(--color-brand)',
                  height: '40px'
                }}
              >
                Create Clip
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-gray)' }}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--color-brand)' }}>
                  {totalClips}
                </div>
                <Text style={{ color: 'var(--text-secondary)' }}>Total Clips</Text>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--color-brand)' }}>
                  {clips.reduce((total, clip) => total + clip.viewCount, 0).toLocaleString()}
                </div>
                <Text style={{ color: 'var(--text-secondary)' }}>Total Views</Text>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ClipCardSkeleton key={index} />
            ))}
          </div>
        ) : clips.length === 0 ? (
          <div className="text-center py-16">
            <ScissorOutlined 
              style={{ 
                fontSize: '64px', 
                color: 'var(--text-secondary)', 
                marginBottom: '16px' 
              }} 
            />
            <Title level={2} style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              No clips yet
            </Title>
            <Text style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '24px' }}>
              Start watching streams and create your first clip!
            </Text>
            <Link href="/browse">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: 'var(--color-brand)',
                  borderColor: 'var(--color-brand)',
                }}
              >
                Browse Streams
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Clips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {clips.map((clip) => (
                <ClipCard key={clip.id} clip={clip} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  current={currentPage}
                  total={totalClips}
                  pageSize={20}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} of ${total} clips`
                  }
                  className="custom-pagination"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
