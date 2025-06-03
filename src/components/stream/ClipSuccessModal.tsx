'use client';

import React from 'react';
import { Modal, Button, Typography, Space, Image } from 'antd';
import { PlayCircleOutlined, ShareAltOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

interface ClipData {
  id: string;
  title: string;
  description: string;
  clipUrl: string;
  playbackUrl: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
}

interface ClipSuccessModalProps {
  open: boolean;
  onClose: () => void;
  clipData: ClipData | null;
}

export function ClipSuccessModal({ open, onClose, clipData }: ClipSuccessModalProps) {
  const params = useParams();
  const lang = params?.lang || 'en';

  if (!clipData) return null;

  // Construct the frontend clip URL
  const frontendClipUrl = `${window.location.origin}/${lang}/clip/${clipData.id}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(frontendClipUrl);
    // You could add a toast notification here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: clipData.title,
        text: `Check out this clip: ${clipData.title}`,
        url: frontendClipUrl,
      });
    } else {
      navigator.clipboard.writeText(frontendClipUrl);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CheckCircleOutlined style={{ color: 'var(--color-brand)', fontSize: '20px' }} />
          <span>Clip Created Successfully!</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={500}
      style={{ 
        backgroundColor: 'var(--color-background)',
        borderRadius: '12px'
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Clip Preview */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {clipData.thumbnailUrl ? (
            <Image
              src={clipData.thumbnailUrl}
              alt={clipData.title}
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
              preview={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <PlayCircleOutlined style={{ fontSize: '48px', color: 'var(--color-brand)' }} />
            </div>
          )}
          
          {/* Duration overlay */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(clipData.duration)}
          </div>
        </div>

        {/* Clip Info */}
        <div>
          <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
            {clipData.title}
          </Title>
          {clipData.description && (
            <Paragraph style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {clipData.description}
            </Paragraph>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>{clipData.viewCount} views</span>
          <span>•</span>
          <span>{clipData.likeCount} likes</span>
          <span>•</span>
          <span>{formatDuration(clipData.duration)} duration</span>
        </div>

        {/* Action Buttons */}
        <Space size="middle" className="w-full justify-center">
          <Link href={`/${lang}/clip/${clipData.id}`}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              style={{
                backgroundColor: 'var(--color-brand)',
                borderColor: 'var(--color-brand)',
                color: 'black'
              }}
            >
              Watch Clip
            </Button>
          </Link>
          
          <Button
            type="default"
            icon={<CopyOutlined />}
            onClick={handleCopyUrl}
            style={{
              backgroundColor: 'var(--color-gray)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'white'
            }}
          >
            Copy Link
          </Button>
          
          <Button
            type="default"
            icon={<ShareAltOutlined />}
            onClick={handleShare}
            style={{
              backgroundColor: 'var(--color-gray)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'white'
            }}
          >
            Share
          </Button>
        </Space>

        {/* Close Button */}
        <div className="flex justify-center pt-2">
          <Button onClick={onClose} size="large">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
} 