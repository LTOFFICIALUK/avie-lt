'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Avatar, Button, message, Spin, Divider } from 'antd';
import { UserOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, ShareAltOutlined, HeartOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';
import Link from 'next/link';
import { ClipCard } from '@/components/stream/ClipCard';

const { Title, Text, Paragraph } = Typography;

interface Clip {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration: number;
  viewCount: number;
  createdAt: string;
  playbackUrl?: string;
  clipUrl: string;
  streamer: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  clipper: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  stream: {
    title: string;
  };
}

export default function ClipViewerPage() {
  const params = useParams();
  const { id, lang } = params;
  const [clip, setClip] = useState<Clip | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedClips, setRelatedClips] = useState<Clip[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClip(id as string);
      fetchRelatedClips();
    }
  }, [id]);

  const fetchClip = async (clipId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/stream/clip/${clipId}`);
      
      if (response.data.status === 'success') {
        setClip(response.data.data);
      } else {
        message.error('Clip not found');
      }
    } catch (error: any) {
      console.error('Error fetching clip:', error);
      if (error.response?.status === 404) {
        message.error('Clip not found');
      } else {
        message.error('Failed to load clip');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedClips = async () => {
    try {
      const response = await api.get('/api/stream/clips/all?limit=8&sortBy=views');
      if (response.data.status === 'success') {
        setRelatedClips(response.data.data.clips.filter((c: Clip) => c.id !== id));
      }
    } catch (error) {
      console.error('Error fetching related clips:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const clipDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - clipDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: clip?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('Link copied to clipboard!');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
    message.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!clip) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <Title level={2} style={{ color: 'var(--text-primary)' }}>
            Clip not found
          </Title>
          <Text style={{ color: 'var(--text-secondary)' }}>
            The clip you're looking for doesn't exist or has been removed.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              {clip.playbackUrl ? (
                <iframe
                  src={clip.playbackUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Text style={{ color: 'var(--text-secondary)' }}>
                    Video player not available
                  </Text>
                </div>
              )}
            </div>

            {/* Clip Info */}
            <div className="space-y-4">
              <Title level={2} style={{ color: 'var(--text-primary)', margin: 0 }}>
                {clip.title}
              </Title>

              {/* Stats and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-1">
                    <EyeOutlined />
                    {clip.viewCount.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockCircleOutlined />
                    {formatDuration(clip.duration)}
                  </div>
                  <span>{formatTimeAgo(clip.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    icon={<HeartOutlined />}
                    onClick={handleLike}
                    type={isLiked ? "primary" : "text"}
                    style={{
                      backgroundColor: isLiked ? 'var(--color-brand)' : 'var(--color-gray)',
                      borderColor: isLiked ? 'var(--color-brand)' : 'var(--color-gray)',
                      color: isLiked ? '#ffffff' : 'var(--text-primary)'
                    }}
                  >
                    Like
                  </Button>
                  <Button
                    icon={<ShareAltOutlined />}
                    onClick={handleShare}
                    style={{
                      backgroundColor: 'var(--color-gray)',
                      borderColor: 'var(--color-gray)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    Share
                  </Button>
                </div>
              </div>

              <Divider style={{ borderColor: 'var(--color-gray)' }} />

              {/* Creator Info */}
              <div className="flex items-center gap-3">
                <Link href={`/${lang}/profile/${clip.streamer.displayName}`}>
                  <Avatar
                    size={48}
                    src={clip.streamer.avatarUrl}
                    icon={!clip.streamer.avatarUrl && <UserOutlined />}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/${lang}/profile/${clip.streamer.displayName}`}>
                      <Text strong style={{ color: 'var(--text-primary)', cursor: 'pointer' }} className="hover:opacity-80">
                        {clip.streamer.displayName}
                      </Text>
                    </Link>
                    {clip.streamer.isVerified && (
                      <CheckCircleOutlined style={{ color: 'var(--color-brand)', fontSize: '14px' }} />
                    )}
                  </div>
                  <Text style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    From stream: {clip.stream.title}
                  </Text>
                  {clip.clipper.id !== clip.streamer.id && (
                    <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      Clipped by {clip.clipper.displayName}
                    </Text>
                  )}
                </div>
              </div>

              {/* Description */}
              {clip.description && (
                <div>
                  <Paragraph style={{ color: 'var(--text-primary)', marginBottom: 0 }}>
                    {clip.description}
                  </Paragraph>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Related Clips */}
          <div className="lg:col-span-1">
            <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
              Related Clips
            </Title>
            <div className="space-y-4">
              {relatedClips.slice(0, 6).map((relatedClip) => (
                <div key={relatedClip.id} className="transform scale-90 origin-top-left">
                  <ClipCard clip={relatedClip} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 