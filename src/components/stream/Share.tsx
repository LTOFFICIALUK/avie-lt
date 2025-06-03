'use client';

import React, { useState } from 'react';
import { Modal, Button, Input, Typography, Space, message } from 'antd';
import { ShareAltOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function ShareModal({ open, onClose, title, description }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      message.success('Link copied to clipboard!');
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      message.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Check out this stream!',
          text: description || 'Watch this amazing live stream',
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copy if native share fails
        handleCopyUrl();
      }
    } else {
      // Fallback to copy if native share is not supported
      handleCopyUrl();
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ShareAltOutlined style={{ color: 'var(--color-brand)', fontSize: '20px' }} />
          <span>Share Stream</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={450}
      style={{ 
        backgroundColor: 'var(--color-background)',
        borderRadius: '12px'
      }}
    >
      <div className="flex flex-col gap-4">
        {/* Description */}
        <Text style={{ color: 'var(--text-secondary)' }}>
          Share this stream with your friends and followers
        </Text>

        {/* URL Input with Copy Button */}
        <div className="flex gap-2">
          <Input
            value={shareUrl}
            readOnly
            style={{
              backgroundColor: 'var(--color-gray)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              flex: 1
            }}
          />
          <Button
            type={copied ? "primary" : "default"}
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopyUrl}
            style={{
              backgroundColor: copied ? 'var(--color-brand)' : 'var(--color-gray)',
              borderColor: copied ? 'var(--color-brand)' : 'rgba(255,255,255,0.1)',
              color: copied ? 'black' : 'white',
              minWidth: '80px'
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        {/* Action Buttons */}
        <Space size="middle" className="w-full justify-center">
          {/* Native Share Button (if supported) */}
          {typeof navigator !== 'undefined' && (
            <Button
              type="primary"
              icon={<ShareAltOutlined />}
              onClick={handleNativeShare}
              style={{
                backgroundColor: 'var(--color-brand)',
                borderColor: 'var(--color-brand)',
                color: 'black'
              }}
            >
              Share
            </Button>
          )}
          
          <Button
            type="default"
            onClick={onClose}
            style={{
              backgroundColor: 'var(--color-gray)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'white'
            }}
          >
            Close
          </Button>
        </Space>

        {/* Additional sharing options could go here */}
        <div className="text-center">
          <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            Anyone with this link can view the stream
          </Text>
        </div>
      </div>
    </Modal>
  );
}
