'use client';

import React, { useEffect, useState } from 'react';
import { ShareAltOutlined, HeartOutlined, HeartFilled, FlagOutlined, MoreOutlined, GiftOutlined, ScissorOutlined } from '@ant-design/icons';
import { Typography, Button, Space, Tag, Dropdown, Modal, Form, Input, message, Avatar } from 'antd';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { DonationModal } from '../donation/DonationModal';
import { ClipSuccessModal } from './ClipSuccessModal';
import { ShareModal } from '@/components/stream/Share';
import ReportModal from './ReportModal';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface VideoTitleProps {
  title: string;
  views: number;
  timestamp: string;
  tags?: string[];
  username: string;
  streamId: string;
  avatarUrl?: string;
  followerCount?: number;
  videoCount?: number;
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  isSubscribing?: boolean;
}

export function VideoTitle({ title, views, timestamp, tags = [], username, streamId, avatarUrl, followerCount, videoCount, isSubscribed, onSubscribe, isSubscribing}: VideoTitleProps) {
  const { lang } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const [isClipSuccessModalOpen, setIsClipSuccessModalOpen] = useState(false);
  const [clipData, setClipData] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [clipForm] = Form.useForm();
  const [isClipLoading, setIsClipLoading] = useState(false);

  useEffect(() => {
    // Check if user has already liked the stream
    const checkLikeStatus = async () => {
      try {
        if (!streamId) return;
        
        const [likeResponse, countResponse] = await Promise.all([
          api.get(`/api/stream/${streamId}/liked`),
          api.get(`/api/stream/${streamId}/likes`)
        ]);
        setIsLiked(likeResponse.data.data.liked);
        setLikeCount(countResponse.data.data.likes);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    if (streamId) {
      checkLikeStatus();
    }
  }, [streamId]);

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleLike = async () => {
    try {
      if (!streamId) return;
      
      // Optimistically update UI
      setIsLiked(!isLiked);
      setLikeCount(prev => !isLiked ? prev + 1 : prev - 1);
      
      // Make API call in background
      const response = await api.post(`/api/stream/${streamId}/like`);
      
      // If API call fails, revert the optimistic update
      if (response.data.status !== 'success') {
        setIsLiked(isLiked);
        setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      console.error('Error toggling like:', error);
    }
  };

  const handleDonate = () => {
    setIsDonationModalOpen(true);
  };

  const handleReport = () => {
    setIsReportModalOpen(true);
  };

  const handleClip = () => {
    setIsClipModalOpen(true);
  };

  const handleClipCreate = async (values: { title: string; description?: string }) => {
    if (!streamId) return;
    
    setIsClipLoading(true);
    try {
      message.loading('Creating clip... This may take 1-2 minutes', 0);
      
      const response = await api.post('/api/stream/clip', {
        streamId,
        title: values.title,
        description: values.description || '',
        timestamp: Math.floor(Date.now() / 1000)
      }, {
        timeout: 120000 // 2 minutes timeout for clip creation
      });
      
      message.destroy(); // Clear the loading message
      
      if (response.status === 200 && response.data.status === 'success') {
        message.success('Clip created successfully!');
        setClipData(response.data.data);
        setIsClipModalOpen(false);
        setIsClipSuccessModalOpen(true);
        clipForm.resetFields();
      } else {
        message.error('Failed to create clip. Please try again.');
      }
    } catch (error: any) {
      message.destroy(); // Clear the loading message
      console.error('Error creating clip:', error);
      
      // Check if it's a timeout or network error
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        message.error('Clip creation is taking longer than expected. Please check back later.');
      } else {
        message.error('Failed to create clip. Please try again.');
      }
    } finally {
      setIsClipLoading(false);
    }
  };
  
  // Dropdown menu items for mobile view
  const moreMenuItems = [
    {
      key: 'share',
      icon: <ShareAltOutlined />,
      label: 'Share',
      onClick: handleShare
    },
    {
      key: 'clip',
      icon: <ScissorOutlined />,
      label: 'Clip',
      onClick: handleClip
    },
    {
      key: 'report',
      icon: <FlagOutlined />,
      label: 'Report',
      onClick: handleReport
    }
  ];

  return (
    <div className="flex flex-col gap-1 px-1 border-none">
      {/* Title and Actions Section - Responsive Layout */}
      <div className="flex flex-wrap justify-between items-start gap-3">
        {/* Profile Picture and Title Column */}
        <div className="flex-1 min-w-0 flex items-start gap-4" style={{ minWidth: '300px' }}>
          {/* Profile Picture */}
          <Link href={`/${lang}/profile/${username}`}>
            <Avatar 
              size={64}
              src={avatarUrl || `https://api.dicebear.com/6.x/pixel-art/svg?seed=${username}`}
              style={{ 
                backgroundColor: '#2d2d2d',
                border: '3px solid #84eef5',
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              className="hover:scale-105"
            >
              {username[0]?.toUpperCase() || '?'}
            </Avatar>
          </Link>
          
          {/* Title and Creator Info */}
          <div className="flex-1 min-w-0">
            <Title level={3} style={{ 
              margin: 0, 
              color: '#ffffff', 
              marginBottom: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {title}
            </Title>
            
            {/* Creator Username and Following Button */}
            <div className="flex items-center gap-2" style={{ marginBottom: '2px' }}>
              <Link href={`/${lang}/profile/${username}`}>
                <div style={{ 
                  color: '#ffffff', 
                  fontSize: '18px', 
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                className="hover:underline"
                >
                  {username}
                </div>
              </Link>
              
              {/* Following Button */}
              {onSubscribe && (
                <Button
                  onClick={onSubscribe}
                  loading={isSubscribing}
                  type={isSubscribed ? "text" : "primary"}
                  size="small"
                  style={{
                    height: '24px',
                    backgroundColor: isSubscribed ? 'var(--color-gray)' : '#84eef5',
                    borderColor: isSubscribed ? 'rgba(255,255,255,0.2)' : '#84eef5',
                    borderRadius: '12px',
                    color: isSubscribed ? '#ffffff' : '#000000',
                    fontSize: '11px',
                    fontWeight: 'normal',
                    padding: '0 8px',
                    flexShrink: 0
                  }}
                >
                  {isSubscribed ? "Following" : "Follow"}
                </Button>
              )}
            </div>
            
            {/* Follower and Video Count */}
            <div className="flex items-center gap-2" style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              <span>{followerCount?.toLocaleString() || 0} followers</span>
              <span>•</span>
              <span>{videoCount?.toLocaleString() || 0} videos</span>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons - Responsive positioning */}
        <div className="flex sm:hidden items-center gap-2 flex-shrink-0">
          {/* Donate Button */}
          <Button
            type="text" 
            icon={<GiftOutlined />}
            onClick={handleDonate}
            style={{ 
              backgroundColor: 'var(--color-brand)',
              borderColor: 'rgba(132, 238, 245, 0.2)',
              borderRadius: '20px',
              height: '28px',
              color: 'black',
              fontSize: '12px',
              fontWeight: 'normal',
              padding: '0 8px'
            }}
          >
            <span className="hidden xs:inline">Donate</span>
          </Button>
          
          {/* Clip Button (Mobile) */}
          <Button
            type="text"
            icon={<ScissorOutlined />}
            onClick={handleClip}
            disabled={!streamId}
            style={{ 
              backgroundColor: 'var(--color-gray)',
              borderColor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              borderRadius: '20px',
              height: '28px',
              fontSize: '12px',
              fontWeight: 'normal',
              padding: '0 8px'
            }}
          >
            <span className="hidden xs:inline">Clip</span>
          </Button>
          
          {/* Like Button */}
          <Button
            type="text"
            icon={isLiked ? <HeartFilled style={{ color: '#84eef5' }} /> : <HeartOutlined />}
            onClick={handleLike}
            disabled={!streamId}
            style={{ 
              backgroundColor: isLiked ? 'rgba(132, 238, 245, 0.1)' : 'var(--color-gray)',
              borderColor: isLiked ? 'rgba(132, 238, 245, 0.2)' : 'rgba(255,255,255,0.2)',
              color: isLiked ? '#84eef5' : '#ffffff',
              borderRadius: '20px',
              height: '28px',
              fontSize: '12px',
              fontWeight: 'normal',
              padding: '0 8px'
            }}
          >
            {likeCount}
          </Button>

          {/* More Button with Dropdown */}
          <Dropdown 
            menu={{ items: moreMenuItems }} 
            trigger={['click']} 
            placement="bottomRight"
            overlayStyle={{ 
              background: 'var(--color-gray)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }}
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              style={{ 
                backgroundColor: 'var(--color-gray)',
                borderColor: 'rgba(255,255,255,0.2)',
                borderRadius: '20px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 'normal'
              }}
            />
          </Dropdown>
        </div>

        {/* Desktop Action Buttons - Responsive positioning */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          {/* Donate Button */}
          <Button
            type="text" 
            icon={<GiftOutlined />}
            onClick={handleDonate}
            style={{ 
              backgroundColor: 'var(--color-brand)',
              borderColor: 'rgba(132, 238, 245, 0.2)',
              borderRadius: '20px',
              height: '32px',
              color: 'black',
              fontSize: '12px',
              fontWeight: 'normal'
            }}
          >
            Donate
          </Button>
          
          {/* Clip Button (Desktop) */}
          <Button
            type="text"
            icon={<ScissorOutlined />}
            onClick={handleClip}
            disabled={!streamId}
            style={{ 
              backgroundColor: 'var(--color-gray)',
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '20px',
              height: '32px',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 'normal'
            }}
          >
            Clip
          </Button>
          
          {/* Share Button */}
          <Button
            type="text" 
            icon={<ShareAltOutlined />}
            onClick={handleShare}
            style={{ 
              backgroundColor: 'var(--color-gray)',
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '20px',
              height: '32px',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 'normal'
            }}
          >
            Share
          </Button>
          
          {/* Like Button */}
          <Button
            type="text"
            icon={isLiked ? <HeartFilled style={{ color: '#84eef5' }} /> : <HeartOutlined />}
            onClick={handleLike}
            disabled={!streamId}
            style={{ 
              backgroundColor: isLiked ? 'rgba(132, 238, 245, 0.1)' : 'var(--color-gray)',
              borderColor: isLiked ? 'rgba(132, 238, 245, 0.2)' : 'rgba(255,255,255,0.2)',
              color: isLiked ? '#84eef5' : '#ffffff',
              borderRadius: '20px',
              height: '32px',
              fontSize: '12px',
              fontWeight: 'normal'
            }}
          >
            {likeCount}
          </Button>

          {/* Report Button */}
          <Button
            type="text" 
            icon={<FlagOutlined />}
            onClick={handleReport}
            style={{ 
              backgroundColor: 'var(--color-gray)',
              borderColor: 'rgba(255,255,255,0.2)',
              borderRadius: '20px',
              height: '32px',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 'normal'
            }}
          >
            Report
          </Button>
        </div>
      </div>

      {/* Tags and Stats */}
      <div>
        <Space size={[8, 8]} wrap>
          {tags.map((tag) => (
            <Tag 
              key={tag}
              style={{ 
                backgroundColor: 'var(--color-gray)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'var(--text-secondary)',
                borderRadius: '9999px'
              }}
            >
              {tag}
            </Tag>
          ))}
        </Space>

      </div>

      {/* Donation Modal */}
      <DonationModal
        open={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        streamerName={username}
      />

      {/* Clip Creation Modal */}
      <Modal
        title="Create a Clip"
        open={isClipModalOpen}
        onCancel={() => setIsClipModalOpen(false)}
        footer={null}
        centered
        style={{ 
          backgroundColor: 'var(--color-background)',
          borderRadius: '12px'
        }}
      >
        <Form
          form={clipForm}
          layout="vertical"
          onFinish={handleClipCreate}
        >
          <Form.Item
            name="title"
            label="Clip Title"
            rules={[{ required: true, message: 'Please enter a title for your clip' }]}
          >
            <Input placeholder="Give your clip a catchy title" maxLength={100} />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description (Optional)"
          >
            <TextArea 
              placeholder="Add some details about this clip" 
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={500}
            />
          </Form.Item>
          
          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsClipModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={isClipLoading}
                style={{ backgroundColor: 'var(--color-brand)', color: 'black' }}
              >
                Create Clip
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Report Modal */}
      <ReportModal
        visible={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        streamId={streamId}
        streamTitle={title}
      />

      {/* Clip Success Modal */}
      <ClipSuccessModal
        open={isClipSuccessModalOpen}
        onClose={() => setIsClipSuccessModalOpen(false)}
        clipData={clipData}
      />

      {/* Share Modal */}
      <ShareModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={title}
        description={`Watch ${username}'s live stream!`}
      />
    </div>
  );
} 