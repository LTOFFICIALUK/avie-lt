'use client';

import React from 'react';
import { Avatar, Button, Typography } from 'antd';
import { UserOutlined, CheckOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const { Text, Title } = Typography;

interface MobileAccountSubscribeProps {
  username: string;
  streamTitle: string;
  streamDuration: string;
  viewers: number;
  streamerInfo: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    isVerified: boolean;
  } | null;
  isSubscribed: boolean;
  onSubscribe: () => void;
  isLoading: boolean;
}

export function MobileAccountSubscribe({ 
  username, 
  streamTitle,
  streamDuration,
  viewers,
  streamerInfo,
  isSubscribed, 
  onSubscribe,
  isLoading
}: MobileAccountSubscribeProps) {
  const { lang } = useParams();
  
  if (!streamerInfo) return null;

  return (
    <div className="flex items-start w-full">
      {/* Avatar */}
      <Link 
        href={`/${lang}/profile/${username}`} 
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Avatar
          size={56}
          icon={!streamerInfo.avatarUrl && <UserOutlined />}
          src={streamerInfo.avatarUrl || undefined}
          style={{ 
            backgroundColor: 'var(--color-gray)',
            border: '2px solid var(--color-brand)',
          }}
        />
      </Link>

      {/* Info & Title */}
      <div className="ml-3 flex-1 min-w-0">
        {/* Username and Verification Badge */}
        <div className="flex items-center gap-2">
          <Link 
            href={`/${lang}/profile/${username}`}
            className="hover:opacity-80 transition-opacity"
          >
            <Title level={4} style={{ margin: 0, color: '#ffffff', cursor: 'pointer' }}>
              {streamerInfo.displayName}
            </Title>
          </Link>
          
          {streamerInfo.isVerified && (
            <div className="bg-[#00ffff]/5 border border-[#00ffff]/20 text-[#00ffff] text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
              <CheckOutlined style={{ fontSize: '12px' }} />
              <span>Verified</span>
            </div>
          )}
        </div>
        
        {/* Stream Title */}
        <Text 
          style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '14px',
            display: 'block',
            marginTop: '4px',
            lineHeight: '1.3'
          }}
          ellipsis={{ tooltip: true }}
        >
          {streamTitle}
        </Text>
        
        {/* Stream Duration */}
        <div className="mt-2">
          <Text
            style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
            }}
          >
            <div className="flex items-center gap-2">
              <ClockCircleOutlined style={{ fontSize: '14px' }} />
              <span>Started streaming {streamDuration}</span>
            </div>
          </Text>
          
          {/* Viewer Count */}
          <Text 
            style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '13px',
            }}
          >
            <div className="flex items-center gap-2">
              <EyeOutlined style={{ fontSize: '14px' }} />
              <span>{viewers.toLocaleString()} Viewers</span>
            </div>
          </Text>
        </div>
      </div>
    </div>
  );
} 