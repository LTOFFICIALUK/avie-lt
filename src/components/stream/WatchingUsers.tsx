'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Button, Spin, List } from 'antd';
import { UserOutlined, DownOutlined, UpOutlined, EyeOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';
import axios from 'axios';

const { Text } = Typography;

interface Viewer {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

interface WatchingUsersProps {
  username: string; // streamer's username
  className?: string;
}

export function WatchingUsers({ username, className }: WatchingUsersProps) {
  const [viewers, setViewers] = useState<Viewer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStreamCreator, setIsStreamCreator] = useState(false);

  // Function to fetch viewers
  const fetchViewers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/stream/viewers');
      
      if (response.data.status === 'success') {
        setViewers(response.data.data || []);
        setIsStreamCreator(true);
      } else {
        setViewers([]);
        setError('Failed to load viewers');
      }
    } catch (err: unknown) {
      console.error('Error fetching viewers:', err);
      // Type check err and handle appropriately
      if (axios.isAxiosError(err)) {
        // If we get a 404, it means user is not the creator, which is fine
        if (err.response?.status === 404) {
          setIsStreamCreator(false);
        } else {
          setError('Failed to load viewers');
        }
      } else {
        setError('Failed to load viewers');
      }
      setViewers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch viewers on initial load
  useEffect(() => {
    fetchViewers();

    // Refresh viewers every 30 seconds
    const intervalId = setInterval(fetchViewers, 30000);

    return () => clearInterval(intervalId);
  }, [username]);

  // If this isn't the stream creator, don't show anything
  if (!isStreamCreator && !isLoading) {
    return null;
  }

  // Number of viewers to show when collapsed
  const maxVisibleViewers = 5;

  return (
    <div className={`bg-[var(--color-gray)] rounded-xl border border-zinc-800 p-4 ${className || ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <EyeOutlined style={{ color: 'var(--color-lightGray)' }} />
          <Text strong style={{ color: 'white' }}>Watching Users</Text>
        </div>
        <Text style={{ color: 'var(--color-lightGray)' }}>
          {viewers.length} {viewers.length === 1 ? 'viewer' : 'viewers'}
        </Text>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spin size="small" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-2">{error}</div>
      ) : viewers.length === 0 ? (
        <div className="text-center py-2 text-zinc-500">No one is watching right now</div>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={isExpanded ? viewers : viewers.slice(0, maxVisibleViewers)}
            className="no-scrollbar"
            renderItem={(viewer) => (
              <List.Item className="px-0 py-1 border-b border-zinc-800/30">
                <div className="flex items-center gap-3 w-full">
                  <Avatar 
                    size={32} 
                    src={viewer.avatarUrl || undefined}
                    icon={!viewer.avatarUrl && <UserOutlined />}
                    style={{ 
                      backgroundColor: '#2d2d2d',
                      border: '1px solid #3a3a3a',
                    }}
                  >
                    {!viewer.avatarUrl && viewer.displayName?.[0]?.toUpperCase()}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Text style={{ color: 'white' }} ellipsis>{viewer.displayName}</Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
          
          {viewers.length > maxVisibleViewers && (
            <Button 
              type="text" 
              size="small" 
              onClick={() => setIsExpanded(!isExpanded)}
              icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
              style={{ color: 'var(--color-lightGray)', width: '100%', marginTop: '8px' }}
            >
              {isExpanded ? 'Show less' : `Show all ${viewers.length} viewers`}
            </Button>
          )}
        </>
      )}
    </div>
  );
} 