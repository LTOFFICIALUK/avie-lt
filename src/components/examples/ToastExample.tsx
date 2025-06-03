'use client';

import React from 'react';
import { Button, Space, Card, Typography } from 'antd';
import { useToast } from '@/providers/ToastProvider';

const { Title, Text } = Typography;

export function ToastExample() {
  const toast = useToast();

  return (
    <Card title="Toast Notification Examples" style={{ maxWidth: 800, margin: '20px auto' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5}>Toast Notifications (Larger)</Title>
        <Text style={{ color: 'var(--text-secondary)' }}>
          These notifications are larger and more detailed, ideal for important messages.
        </Text>
        <Space wrap>
          <Button 
            type="primary" 
            onClick={() => toast.success('Your action was completed successfully!', 'Great job!')}
          >
            Success Toast
          </Button>
          
          <Button 
            danger 
            onClick={() => toast.error('There was a problem processing your request.', 'Error')}
          >
            Error Toast
          </Button>
          
          <Button 
            onClick={() => toast.info('Remember to complete your profile for better recommendations.', 'Information')}
          >
            Info Toast
          </Button>
          
          <Button 
            onClick={() => toast.warning('Your session will expire in 5 minutes.', 'Warning')}
          >
            Warning Toast
          </Button>
        </Space>

        <Title level={5} style={{ marginTop: 24 }}>Message Toasts (Smaller)</Title>
        <Text style={{ color: 'var(--text-secondary)' }}>
          These are smaller, less intrusive messages for quick notifications.
        </Text>
        <Space wrap>
          <Button 
            type="primary" 
            onClick={() => toast.message.success('Profile updated successfully!')}
          >
            Success Message
          </Button>
          
          <Button 
            danger 
            onClick={() => toast.message.error('Failed to save changes')}
          >
            Error Message
          </Button>
          
          <Button 
            onClick={() => toast.message.info('New message received')}
          >
            Info Message
          </Button>
          
          <Button 
            onClick={() => toast.message.warning('Low balance warning')}
          >
            Warning Message
          </Button>
          
          <Button 
            onClick={() => toast.message.loading('Processing payment...')}
          >
            Loading Message
          </Button>
        </Space>
        
        <Title level={5} style={{ marginTop: 24 }}>Custom Positions</Title>
        <Text style={{ color: 'var(--text-secondary)' }}>
          You can customize the position of toast notifications.
        </Text>
        <Space wrap>
          <Button 
            onClick={() => toast.success('Toast at top position', 'Position Demo', { position: 'top' })}
          >
            Top Position
          </Button>
          
          <Button 
            onClick={() => toast.info('Toast at bottom left position', 'Position Demo', { position: 'bottomLeft' })}
          >
            Bottom Left
          </Button>
          
          <Button 
            onClick={() => toast.warning('Toast at top right position', 'Position Demo', { position: 'topRight' })}
          >
            Top Right
          </Button>
        </Space>
        
        <Button 
          style={{ marginTop: 16 }}
          onClick={() => toast.closeAll()}
        >
          Close All Toasts
        </Button>
      </Space>
    </Card>
  );
} 