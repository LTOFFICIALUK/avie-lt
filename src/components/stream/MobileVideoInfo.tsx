"use client";

import React, { useState } from "react";
import { Button, Space, Tag, message, Dropdown, Menu, Modal, Form, Input } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  ScissorOutlined,
  FlagOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { api } from '@/lib/api';
import { ClipSuccessModal } from './ClipSuccessModal';
import { ShareModal } from '@/components/stream/Share';
import ReportModal from "./ReportModal";

const { TextArea } = Input;

interface MobileVideoInfoProps {
  streamId: string;
  title: string;
  tags: string[] | undefined;
  likeCount: number;
  isLiked: boolean;
  onLike: () => void;
  username: string;
  isSubscribed: boolean;
  onSubscribe: () => void;
  isSubscribing: boolean;
}

export function MobileVideoInfo({
  streamId,
  title,
  tags = [],
  likeCount,
  isLiked,
  onLike,
  username,
  isSubscribed,
  onSubscribe,
  isSubscribing,
}: MobileVideoInfoProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const [isClipSuccessModalOpen, setIsClipSuccessModalOpen] = useState(false);
  const [clipData, setClipData] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [clipForm] = Form.useForm();
  const [isClipLoading, setIsClipLoading] = useState(false);

  const handleShare = () => {
    setIsShareModalOpen(true);
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

  // Dropdown menu for More options
  const moreMenuItems = [
    {
      key: "report",
      icon: <FlagOutlined />,
      label: "Report",
      onClick: handleReport,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Action Buttons - All in one row */}
      <div className="grid grid-cols-4 gap-2">
        {/* Follow Button */}
        <Button
          type={isSubscribed ? "default" : "primary"}
          icon={isSubscribed ? <UserDeleteOutlined /> : <UserAddOutlined />}
          onClick={onSubscribe}
          loading={isSubscribing}
          size="middle"
          className="flex items-center justify-center"
          style={{
            backgroundColor: isSubscribed
              ? "var(--color-gray)"
              : "var(--color-brand)",
            borderColor: isSubscribed ? "rgba(255,255,255,0.1)" : "transparent",
            color: isSubscribed ? "white" : "black",
            borderRadius: "20px",
            width: "100%",
            fontWeight: isSubscribed ? "normal" : "500",
            fontSize: "12px",
          }}
        >
          {isSubscribed ? "Unfollow" : "Follow"}
        </Button>

        {/* Like Button */}
        <Button
          type={isLiked ? "primary" : "default"}
          icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
          onClick={onLike}
          className="flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-gray)",
            borderColor: isLiked ? "var(--color-brand)" : "rgba(255,255,255,0.1)",
            color: isLiked ? "var(--color-brand)" : "white",
            borderRadius: "20px",
            width: "100%",
            fontWeight: "normal",
            fontSize: "12px",
          }}
          size="middle"
        >
          {likeCount}
        </Button>

        {/* Share Button */}
        <Button
          type="default"
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          size="middle"
          className="flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-gray)",
            borderColor: "rgba(255,255,255,0.1)",
            color: "white",
            borderRadius: "20px",
            width: "100%",
            fontWeight: "normal",
            fontSize: "12px",
          }}
        >
          Share
        </Button>

        {/* Clip Button */}
        <Button
          type="default"
          icon={<ScissorOutlined />}
          onClick={handleClip}
          disabled={!streamId}
          className="flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-gray)",
            borderColor: "rgba(255,255,255,0.1)",
            color: "white",
            borderRadius: "20px",
            width: "100%",
            fontWeight: "normal",
            fontSize: "12px",
          }}
        >
          Clip
        </Button>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <Space size={[8, 8]} wrap>
          {tags.map((tag) => (
            <Tag
              key={tag}
              style={{
                backgroundColor: "var(--color-gray)",
                borderColor: "rgba(255,255,255,0.2)",
                color: "var(--text-secondary)",
                borderRadius: "9999px",
                padding: "4px 10px",
              }}
            >
              {tag}
            </Tag>
          ))}
        </Space>
      )}

      {/* Report Modal */}
      <ReportModal
        visible={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        streamId={streamId}
        streamTitle={title}
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
