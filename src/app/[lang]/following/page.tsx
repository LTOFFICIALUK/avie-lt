'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { UserDeleteOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Button, Spin, Alert } from 'antd';

interface Creator {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  isLive: boolean;
  followedAt: string;
  followers?: number;
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

  const formatViewers = (count: number): string => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  // Separate live creators from offline creators
  const liveCreators = creators.filter(creator => creator.isLive);
  const offlineCreators = creators.filter(creator => !creator.isLive);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {creators.length === 0 ? (
        <div className="text-center py-16">
          <UsergroupAddOutlined className="text-6xl text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">You're not following anyone yet</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Start following creators to see their content here and get notified when they go live
          </p>
          <Link href={`/${lang}/browse`}>
            <Button 
              type="primary" 
              size="large"
              className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-darker)] border-[var(--color-brand)] text-white font-medium px-8 h-12 rounded-lg"
            >
              Discover Creators
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Live Now Section */}
          {liveCreators.length > 0 && (
            <section>
              {/* Section Header */}
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h2 className="text-2xl font-bold text-white">Live Now</h2>
                  <span className="text-sm text-gray-400 bg-red-500/10 px-2 py-1 rounded-full">
                    {liveCreators.length} live
                  </span>
                </div>
              </div>

              {/* Live Streams Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {liveCreators.map((creator) => (
                  <div key={creator.id} className="group">
                    {/* Stream Card */}
                    <Link href={`/${lang}/streams/${creator.displayName}`}>
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                        {creator.stream?.thumbnail ? (
                          <Image 
                            src={creator.stream.thumbnail} 
                            alt={creator.stream.title || "Live stream"} 
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center border border-gray-700/50">
                            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                        
                        {/* Live Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></span>
                            Live
                          </span>
                        </div>

                        {/* Viewer Count */}
                        {creator.stream?.viewers && (
                          <div className="absolute bottom-3 right-3">
                            <span className="bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
                              {formatViewers(creator.stream.viewers)} viewers
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Stream Info */}
                    <div className="mt-3 space-y-2">
                      {/* Category */}
                      {creator.stream?.category && (
                        <Link href={`/${lang}/category/${creator.stream.category.slug}`}>
                          <p className="text-purple-400 text-xs font-medium uppercase tracking-wide hover:text-purple-300 transition-colors">
                            {creator.stream.category.name}
                          </p>
                        </Link>
                      )}

                      {/* Stream Title */}
                      <Link href={`/${lang}/streams/${creator.displayName}`}>
                        <h3 className="text-white text-sm font-semibold line-clamp-2 leading-tight hover:text-purple-300 transition-colors cursor-pointer">
                          {creator.stream?.title || "Live Stream"}
                        </h3>
                      </Link>

                      {/* Creator Info */}
                      <div className="flex items-center justify-between">
                        <Link href={`/${lang}/profile/${creator.displayName}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-600">
                            {creator.avatarUrl ? (
                              <Image
                                src={creator.avatarUrl}
                                alt={creator.displayName}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                {creator.displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-gray-300 text-xs font-medium">{creator.displayName}</span>
                        </Link>

                        {/* Follower Count */}
                        <p className="text-gray-400 text-xs mb-1">
                          {creator.followers ? formatFollowers(creator.followers) : '0'} followers
                        </p>

                        <Button 
                          onClick={() => handleUnfollow(creator.id, creator.displayName)}
                          icon={<UserDeleteOutlined />}
                          size="small"
                          className="bg-gray-800/50 hover:bg-red-600 text-gray-300 hover:text-white border border-gray-600/50 hover:border-red-600 transition-all duration-200 text-xs h-7 px-3 rounded-md"
                          title="Unfollow"
                        >
                          Unfollow
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Followed Creators Section */}
          {offlineCreators.length > 0 && (
            <section>
              {/* Section Header with Divider */}
              <div className="w-full mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-6"></div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Followed Creators</h2>
                  <span className="text-sm text-gray-400">
                    {offlineCreators.length} offline
                  </span>
                </div>
              </div>

              {/* Followed Creators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0">
                {offlineCreators.map((creator) => (
                  <div key={creator.id} className="group flex flex-col items-center text-center p-2">
                    {/* Circular Avatar */}
                    <Link href={`/${lang}/profile/${creator.displayName}`}>
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 mb-1">
                        {creator.avatarUrl ? (
                          <Image 
                            src={creator.avatarUrl} 
                            alt={creator.displayName} 
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800/50 border border-gray-700/50">
                            <span className="text-gray-400 text-lg font-medium">
                              {creator.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Creator Name */}
                    <Link href={`/${lang}/profile/${creator.displayName}`}>
                      <h3 className="text-white text-xs font-medium hover:text-purple-300 transition-colors cursor-pointer mb-1 max-w-full truncate">
                        {creator.displayName}
                      </h3>
                    </Link>

                    {/* Follower Count */}
                    <p className="text-gray-400 text-xs mb-1">
                      {creator.followers ? formatFollowers(creator.followers) : '0'} followers
                    </p>

                    {/* Unfollow Button */}
                    <Button 
                      onClick={() => handleUnfollow(creator.id, creator.displayName)}
                      icon={<UserDeleteOutlined />}
                      size="small"
                      className="bg-gray-800/50 hover:bg-red-600 text-gray-300 hover:text-white border border-gray-600/50 hover:border-red-600 transition-all duration-200 text-xs h-7 px-3 rounded-md"
                      title="Unfollow"
                    >
                      Unfollow
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowingPage;
