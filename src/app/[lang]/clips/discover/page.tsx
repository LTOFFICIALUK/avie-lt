'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Select, Empty, Pagination, Input, message } from 'antd';
import { SearchOutlined, FireOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { ClipCard, ClipCardSkeleton } from '@/components/stream/ClipCard';
import { api } from '@/lib/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

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

export default function DiscoverClipsPage() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClips, setTotalClips] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('views');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchClips = async (page: number = 1, sort: string = 'views', search: string = '') => {
    try {
      setLoading(true);
      let url = `/api/stream/clips/all?page=${page}&limit=20&sortBy=${sort}`;
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      
      const response = await api.get(url);
      
      if (response.data.status === 'success') {
        const data: ClipsResponse = response.data.data;
        setClips(data.clips);
        setTotalClips(data.pagination.totalClips);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.page);
      }
    } catch (error: any) {
      console.error('Error fetching clips:', error);
      message.error('Failed to load clips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips(currentPage, sortBy, searchQuery);
  }, [currentPage, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchClips(page, sortBy, searchQuery);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchClips(1, value, searchQuery);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    fetchClips(1, sortBy, value);
  };

  const getSortIcon = (sortType: string) => {
    switch (sortType) {
      case 'views':
        return <EyeOutlined />;
      case 'recent':
        return <ClockCircleOutlined />;
      case 'duration':
        return <FireOutlined />;
      default:
        return <EyeOutlined />;
    }
  };

  const getSortLabel = (sortType: string) => {
    switch (sortType) {
      case 'views':
        return 'Most Viewed';
      case 'recent':
        return 'Most Recent';
      case 'duration':
        return 'Longest';
      default:
        return 'Most Viewed';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Title level={1} style={{ color: 'var(--text-primary)', margin: 0, fontSize: '32px' }}>
            Discover Clips
          </Title>
          <Text style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Explore amazing clips from the community
          </Text>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <Search
              placeholder="Search clips by title or creator..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ maxWidth: '400px' }}
            />
          </div>

          {/* Sort dropdown */}
          <Select
            value={sortBy}
            onChange={handleSortChange}
            style={{ width: 160 }}
            size="large"
          >
            <Option value="views">
              <div className="flex items-center gap-2">
                <EyeOutlined />
                Most Viewed
              </div>
            </Option>
            <Option value="recent">
              <div className="flex items-center gap-2">
                <ClockCircleOutlined />
                Most Recent
              </div>
            </Option>
            <Option value="duration">
              <div className="flex items-center gap-2">
                <FireOutlined />
                Longest
              </div>
            </Option>
          </Select>
        </div>

        {/* Current filter indicator */}
        <div className="mb-6 flex items-center gap-2">
          <Text style={{ color: 'var(--text-secondary)' }}>
            Showing clips sorted by:
          </Text>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-brand)', color: '#ffffff' }}>
            {getSortIcon(sortBy)}
            <span className="text-sm font-medium">{getSortLabel(sortBy)}</span>
          </div>
          {searchQuery && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-gray)', color: 'var(--text-primary)' }}>
              <SearchOutlined />
              <span className="text-sm">"{searchQuery}"</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-gray)' }}>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--color-brand)' }}>
                  {totalClips.toLocaleString()}
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
            {Array.from({ length: 12 }).map((_, index) => (
              <ClipCardSkeleton key={index} />
            ))}
          </div>
        ) : clips.length === 0 ? (
          <div className="text-center py-16">
            <SearchOutlined 
              style={{ 
                fontSize: '64px', 
                color: 'var(--text-secondary)', 
                marginBottom: '16px' 
              }} 
            />
            <Title level={2} style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
              {searchQuery ? 'No clips found' : 'No clips available'}
            </Title>
            <Text style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '24px' }}>
              {searchQuery 
                ? `No clips found matching "${searchQuery}". Try a different search term.`
                : 'Be the first to create a clip!'
              }
            </Text>
            {searchQuery && (
              <Button
                type="primary"
                size="large"
                onClick={() => handleSearch('')}
                style={{
                  backgroundColor: 'var(--color-brand)',
                  borderColor: 'var(--color-brand)',
                }}
              >
                Clear Search
              </Button>
            )}
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
