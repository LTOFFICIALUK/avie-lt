'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { UserDeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Spin, Alert, Typography } from 'antd';

const { Title, Text } = Typography;

interface Creator {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  isLive: boolean;
  followedAt: string;
  stream: {
    id: string;
    title: string;
    thumbnail: string | null;
    playbackUrl: string | null;
    viewers: number;
    startedAt: string;
    category: {
      name: string;
      slug: string;
    } | null;
  } | null;
}

const FollowingPage = () => {
  const { lang } = useParams();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/profile/subscriptions');
        if (response.data.status === 'success') {
          setCreators(response.data.data);
        } else {
          setError('Failed to load following creators');
        }
      } catch (err) {
        console.error('Error fetching following creators:', err);
        setError('Failed to load following creators');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  const handleUnfollow = async (creatorId: string, displayName: string) => {
    try {
      const response = await api.delete(`/api/profile/subscribe/${displayName}`);
      if (response.status === 200) {
        setCreators(prevCreators => prevCreators.filter(creator => creator.id !== creatorId));
      }
    } catch (err) {
      console.error('Error unfollowing creator:', err);
      alert('Failed to unfollow creator');
    }
  };

  // Separate live creators from offline creators
  const liveCreators = creators.filter(creator => creator.isLive);
  const offlineCreators = creators.filter(creator => !creator.isLive);
  
  // Sort all creators - live first, then offline
  const sortedCreators = [...liveCreators, ...offlineCreators];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {creators.length === 0 ? (
        <div className="text-center py-12">
          <UsergroupAddOutlined style={{ fontSize: '64px', color: 'var(--text-secondary)', marginBottom: '16px' }} />
          <Title level={2} style={{ fontSize: '24px', marginBottom: '8px' }}>You're not following anyone yet</Title>
          <Text style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '24px' }}>
            Start following creators to see their content here
          </Text>
          <Link href={`/${lang}/browse`}>
            <Button type="primary" style={{ backgroundColor: 'var(--color-brand)', borderColor: 'var(--color-brand)' }}>
              Discover Creators
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Live Creators Section */}
          {liveCreators.length > 0 && (
            <div className="mb-10">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#FF4D4F',
                  borderRadius: '50%',
                  marginRight: '8px',
                  animation: 'pulse 2s infinite'
                }}></span>
                <Title level={2} style={{ margin: 0 }}>Live Now</Title>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {liveCreators.map((creator) => (
                  <div key={creator.id} className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
                    <Link href={`/${lang}/streams/${creator.displayName}`}>
                      <div className="relative aspect-video">
                        {creator.stream?.thumbnail ? (
                          <Image 
                            src={creator.stream.thumbnail} 
                            alt={creator.stream.title || "Live stream"} 
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="bg-zinc-800 w-full h-full flex items-center justify-center">
                            <span className="text-zinc-500">No thumbnail</span>
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md flex items-center">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></span>
                          LIVE
                        </div>
                        {creator.stream?.viewers && (
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                            {creator.stream.viewers} viewers
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Link href={`/${lang}/profile/${creator.displayName}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-800">
                            {creator.avatarUrl && (
                              <Image
                                src={creator.avatarUrl}
                                alt={creator.displayName}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <span className="font-medium" style={{ marginLeft: '8px' }}>{creator.displayName}</span>
                        </Link>
                        <Button 
                          onClick={() => handleUnfollow(creator.id, creator.displayName)}
                          icon={<UserDeleteOutlined />}
                          type="text"
                          className="text-zinc-400 hover:text-red-500"
                          style={{ color: 'var(--text-secondary)' }}
                          title="Unfollow"
                        />
                      </div>
                      <Link href={`/${lang}/streams/${creator.displayName}`}>
                        <h3 className="font-medium truncate hover:text-gray-300 transition-colors cursor-pointer">
                          {creator.stream?.title || "Live Stream"}
                        </h3>
                      </Link>
                      {creator.stream?.category && (
                        <Link href={`/${lang}/category/${creator.stream.category.slug}`} className="text-sm text-zinc-400 mt-1 inline-block hover:text-zinc-300 transition-colors">
                          {creator.stream.category.name}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Followed Creators */}
          <div>
            <Title level={2} style={{ marginBottom: '16px' }}>All Followed Creators</Title>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedCreators.map((creator) => (
                <div key={creator.id} 
                  className="bg-zinc-900 rounded-lg overflow-hidden transition-transform hover:scale-105"
                  style={creator.isLive ? { border: '2px solid #FF4D4F' } : {}}
                >
                  <Link href={`/${lang}/profile/${creator.displayName}`}>
                    <div className="relative aspect-square">
                      {creator.avatarUrl ? (
                        <Image 
                          src={creator.avatarUrl} 
                          alt={creator.displayName} 
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-zinc-800 w-full h-full flex items-center justify-center">
                          <span className="text-zinc-500 text-4xl">
                            {creator.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {creator.isLive && (
                        <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></span>
                          LIVE
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <Link href={`/${lang}/profile/${creator.displayName}`} className="truncate font-medium hover:text-gray-300 transition-colors">
                        {creator.displayName}
                      </Link>
                      <Button 
                        onClick={() => handleUnfollow(creator.id, creator.displayName)}
                        icon={<UserDeleteOutlined />}
                        type="text"
                        size="small"
                        className="text-zinc-400 hover:text-red-500 ml-1 flex-shrink-0"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Unfollow"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default FollowingPage;
