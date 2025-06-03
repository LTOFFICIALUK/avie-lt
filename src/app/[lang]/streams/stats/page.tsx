'use client';

import React from 'react';
import { Chat } from '@/components/stream/chat/Chat';
import { WatchingUsers } from '@/components/stream/WatchingUsers';
import { Tabs } from 'antd';
import { MessageOutlined, EyeOutlined } from '@ant-design/icons';

interface StreamStatsPageProps {
  params: {
    username: string;
    lang: string;
  };
}

export default function StreamStatsPage({ params }: StreamStatsPageProps) {
  const { username } = params;
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Stream Stats</h1>
      
      {/* On Desktop: Side-by-side layout */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-white">Live Chat</h2>
          <div className="h-[600px]">
            <Chat username={username} />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Viewers</h2>
          <WatchingUsers username={username} />
        </div>
      </div>
      
      {/* On Mobile: Tabbed layout */}
      <div className="md:hidden">
        <Tabs
          defaultActiveKey="chat"
          animated={{ tabPane: true }}
          items={[
            {
              key: 'chat',
              label: (
                <span className="flex items-center gap-2">
                  <MessageOutlined />
                  Live Chat
                </span>
              ),
              children: (
                <div className="h-[500px]">
                  <Chat username={username} />
                </div>
              ),
            },
            {
              key: 'viewers',
              label: (
                <span className="flex items-center gap-2">
                  <EyeOutlined />
                  Viewers
                </span>
              ),
              children: (
                <div className="min-h-[200px]">
                  <WatchingUsers username={username} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
