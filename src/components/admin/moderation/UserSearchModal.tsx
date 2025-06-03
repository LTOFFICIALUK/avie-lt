'use client';

import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Input, 
  List, 
  Avatar, 
  Typography, 
  Button,
  Empty,
  Spin,
  message
} from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const { Text } = Typography;

type User = {
  id: string;
  displayName: string;
  email: string;
  fullName: string | null;
  walletAddress: string | null;
  profileImageUrl: string | null;
  role: string;
};

type UserSearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onUserSelected: (userId: string, displayName: string) => void;
};

const UserSearchModal: React.FC<UserSearchModalProps> = ({
  visible,
  onClose,
  onUserSelected,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query to avoid too many requests
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Fetch users when debounced search query changes
  useEffect(() => {
    if (debouncedSearchQuery.length >= 2) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [debouncedSearchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profile/search', {
        params: {
          query: debouncedSearchQuery,
          limit: 10,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to search users:', error);
      message.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Search Users"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={600}
    >
      <div className="mb-4">
        <Input
          placeholder="Search by username, email, wallet..."
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="large"
        />
        <Text type="secondary" className="mt-1 block text-xs">
          Enter at least 2 characters to search
        </Text>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : users.length > 0 ? (
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              key={user.id}
              className="cursor-pointer hover:bg-[var(--color-gray-light)] rounded-md p-2 transition-colors"
              onClick={() => onUserSelected(user.id, user.displayName)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={user.profileImageUrl}
                    icon={!user.profileImageUrl && <UserOutlined />}
                  />
                }
                title={<span>{user.displayName}</span>}
                description={
                  <div>
                    <div>{user.email}</div>
                    {user.fullName && <div>Name: {user.fullName}</div>}
                    {user.walletAddress && (
                      <div>
                        Wallet:{' '}
                        {user.walletAddress.substring(0, 6) +
                          '...' +
                          user.walletAddress.substring(
                            user.walletAddress.length - 4
                          )}
                      </div>
                    )}
                  </div>
                }
              />
              <div>
                <Text type="secondary">{user.role}</Text>
              </div>
            </List.Item>
          )}
        />
      ) : searchQuery.length >= 2 ? (
        <Empty
          description="No users found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Empty
          description="Search for users"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Modal>
  );
};

export default UserSearchModal; 