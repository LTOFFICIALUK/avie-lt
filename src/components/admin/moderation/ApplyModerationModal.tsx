'use client';

import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Button, 
  Radio, 
  InputNumber, 
  message,
  Typography,
  Space,
  Divider
} from 'antd';
import { BugOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import api from '@/lib/api';
import UserSearchModal from './UserSearchModal';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

type User = {
  id: string;
  displayName: string;
  email?: string;
};

type ApplyModerationModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedUserId?: string | null;
};

const ApplyModerationModal: React.FC<ApplyModerationModalProps> = ({
  visible,
  onClose,
  onSuccess,
  preselectedUserId
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [durationType, setDurationType] = useState<'temporary' | 'permanent'>('temporary');
  const [moderationType, setModerationType] = useState<string>('BAN');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setDurationType('temporary');
      setModerationType('BAN');
      
      // If there's a preselected user, fetch their info
      if (preselectedUserId) {
        fetchUserInfo(preselectedUserId);
      } else {
        setSelectedUser(null);
      }
    }
  }, [visible, preselectedUserId, form]);

  // Fetch user info if preselected
  const fetchUserInfo = async (userId: string) => {
    try {
      const response = await api.get(`/api/profile/${userId}`);
      setSelectedUser({
        id: response.data.id,
        displayName: response.data.displayName,
        email: response.data.email
      });
      form.setFieldsValue({
        userId: response.data.id,
      });
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      message.error('Failed to load user information');
    }
  };

  const handleUserSelected = (userId: string, displayName: string) => {
    setSelectedUser({
      id: userId,
      displayName
    });
    form.setFieldsValue({
      userId
    });
    setShowUserSearchModal(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Construct the payload
      const payload: Record<string, any> = {
        targetUserId: values.userId,
        type: values.type,
        scope: values.scope,
        reason: values.reason
      };
      
      // Add duration if temporary
      if (durationType === 'temporary') {
        const durationInMinutes = 
          (values.durationUnit === 'minutes' ? values.duration : 0) +
          (values.durationUnit === 'hours' ? values.duration * 60 : 0) +
          (values.durationUnit === 'days' ? values.duration * 60 * 24 : 0);
        
        payload.duration = durationInMinutes;
      }
      
      // Add streamId if scope is stream related
      if (['STREAM', 'STREAM_CHAT'].includes(values.scope) && values.streamId) {
        payload.streamId = values.streamId;
      }
      
      // Make the API call
      await api.post('/api/moderation', payload);
      
      message.success(`${values.type} applied successfully`);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Failed to apply moderation action:', error);
      message.error('Failed to apply moderation action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Apply Moderation Action"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            type: 'BAN',
            scope: 'GLOBAL',
            durationUnit: 'hours',
            duration: 1
          }}
        >
          <div className="mb-4">
            <Title level={5}>Target User</Title>
            {selectedUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-gray)] flex items-center justify-center mr-2">
                    <UserOutlined />
                  </div>
                  <div>
                    <Text strong>{selectedUser.displayName}</Text>
                    {selectedUser.email && (
                      <div>
                        <Text type="secondary" className="text-xs">
                          {selectedUser.email}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  type="default" 
                  size="small"
                  onClick={() => setShowUserSearchModal(true)}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Button 
                icon={<SearchOutlined />} 
                onClick={() => setShowUserSearchModal(true)}
                block
              >
                Search for a user
              </Button>
            )}

            <Form.Item
              name="userId"
              hidden
              rules={[{ required: true, message: 'Please select a user' }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Divider />

          <Title level={5}>Moderation Details</Title>
          
          <Form.Item
            name="type"
            label="Action Type"
            rules={[{ required: true, message: 'Please select an action type' }]}
          >
            <Select onChange={(value) => setModerationType(value)}>
              <Option value="BAN">Ban</Option>
              <Option value="TIMEOUT">Timeout</Option>
              <Option value="WARNING">Warning</Option>
              <Option value="MUTE">Mute</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="scope"
            label="Scope"
            rules={[{ required: true, message: 'Please select a scope' }]}
          >
            <Select>
              <Option value="GLOBAL">Global (All platform)</Option>
              <Option value="STREAM">Stream (Specific stream)</Option>
              <Option value="CHAT">Chat (All chats)</Option>
              <Option value="STREAM_CHAT">Stream Chat (Specific stream chat)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.scope !== currentValues.scope
            }
          >
            {({ getFieldValue }) => {
              const scope = getFieldValue('scope');
              return ['STREAM', 'STREAM_CHAT'].includes(scope) ? (
                <Form.Item
                  name="streamId"
                  label="Stream ID"
                  rules={[{ required: true, message: 'Please enter a stream ID' }]}
                >
                  <Input placeholder="Enter stream ID" />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>

          <Form.Item
            name="durationType"
            label="Duration"
          >
            <Radio.Group 
              onChange={(e) => setDurationType(e.target.value)}
              value={durationType}
            >
              <Radio value="temporary">Temporary</Radio>
              <Radio value="permanent">Permanent</Radio>
            </Radio.Group>
          </Form.Item>

          {durationType === 'temporary' && (
            <Space align="start">
              <Form.Item
                name="duration"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <InputNumber min={1} />
              </Form.Item>

              <Form.Item
                name="durationUnit"
                rules={[{ required: true, message: 'Please select a unit' }]}
              >
                <Select style={{ width: 100 }}>
                  <Option value="minutes">Minutes</Option>
                  <Option value="hours">Hours</Option>
                  <Option value="days">Days</Option>
                </Select>
              </Form.Item>
            </Space>
          )}

          <Form.Item
            name="reason"
            label="Reason"
            rules={[
              { required: true, message: 'Please provide a reason' },
              { min: 3, message: 'Reason must be at least 3 characters' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Explain why this action is being taken..."
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-4">
            <Space className="w-full justify-end">
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                danger 
                htmlType="submit" 
                loading={loading}
                disabled={!selectedUser}
              >
                Apply {moderationType}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* User Search Modal */}
      {showUserSearchModal && (
        <UserSearchModal
          visible={showUserSearchModal}
          onClose={() => setShowUserSearchModal(false)}
          onUserSelected={handleUserSelected}
        />
      )}
    </>
  );
};

export default ApplyModerationModal; 