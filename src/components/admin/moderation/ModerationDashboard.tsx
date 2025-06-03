'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Input, 
  Select, 
  Button, 
  Card, 
  Tag, 
  Popconfirm, 
  message,
  Typography,
  Space,
  Pagination,
  Empty,
  Tooltip,
  Spin
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  UserOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import api from '@/lib/api';
import { format, formatDistance } from 'date-fns';
import UserSearchModal from './UserSearchModal';
import ApplyModerationModal from './ApplyModerationModal';

const { Title, Text } = Typography;
const { Option } = Select;

// Types
export type ModerationAction = {
  id: string;
  type: 'BAN' | 'TIMEOUT' | 'WARNING' | 'MUTE';
  scope: 'GLOBAL' | 'STREAM' | 'CHAT' | 'STREAM_CHAT';
  reason: string;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
  targetUser?: {
    id: string;
    displayName: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    role: string;
  };
  user?: {
    id: string;
    displayName: string;
    email: string;
    fullName: string | null;
    walletAddress: string | null;
    profileImageUrl: string | null;
  };
  moderator?: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    role: string;
  };
  streamId?: string | null;
  stream?: {
    id: string;
    title: string;
  } | null;
  timeRemaining?: {
    ms: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
  } | null;
};

const ModerationDashboard: React.FC = () => {
  // State for search, filters, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [moderationType, setModerationType] = useState<string | undefined>(undefined);
  const [moderationScope, setModerationScope] = useState<string | undefined>(undefined);
  const [activeOnly, setActiveOnly] = useState<string | undefined>(undefined);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [showApplyModerationModal, setShowApplyModerationModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  
  // Table data
  const [moderations, setModerations] = useState<ModerationAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fetch moderation data when search/filters/pagination change
  useEffect(() => {
    fetchModerations();
  }, [searchQuery, moderationType, moderationScope, activeOnly, page, pageSize, sortField, sortDirection, selectedUserId]);

  const fetchModerations = async () => {
    try {
      setLoading(true);
      
      // Construct query parameters
      const params: Record<string, string | number> = {
        page,
        limit: pageSize,
        sortBy: sortField,
        sortDir: sortDirection
      };
      
      if (searchQuery) params.query = searchQuery;
      if (moderationType) params.type = moderationType;
      if (moderationScope) params.scope = moderationScope;
      if (activeOnly !== undefined) params.active = activeOnly === 'true' ? 'true' : 'false';
      
      const response = await api.get('/api/moderation/search', { params });
      
      setModerations(response.data.moderations);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch moderation data:', error);
      message.error('Failed to load moderation data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveModeration = async (id: string) => {
    try {
      await api.delete(`/api/moderation/${id}`);
      message.success('Moderation action removed successfully');
      fetchModerations();
    } catch (error) {
      console.error('Failed to remove moderation:', error);
      message.error('Failed to remove moderation action');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setModerationType(undefined);
    setModerationScope(undefined);
    setActiveOnly(undefined);
    setSelectedUserId(null);
    setSelectedUserName(null);
    setPage(1);
  };

  const handleUserSelected = (userId: string, displayName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(displayName);
    setShowUserSearchModal(false);
  };

  const handleApplyModeration = () => {
    fetchModerations();
    setShowApplyModerationModal(false);
  };

  // Define table columns
  const columns = [
    {
      title: 'User',
      dataIndex: ['targetUser'],
      key: 'user',
      render: (targetUser: ModerationAction['targetUser']) => {
        // Handle case where targetUser might be undefined
        if (!targetUser) {
          return (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[var(--color-gray)] flex items-center justify-center mr-2 flex-shrink-0">
                <UserOutlined />
              </div>
              <div>
                <Text strong>Unknown User</Text>
                <div>
                  <Text type="secondary" className="text-xs">
                    User data not available
                  </Text>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[var(--color-gray)] flex items-center justify-center mr-2 flex-shrink-0 overflow-hidden">
              {targetUser.avatarUrl ? (
                <img 
                  src={targetUser.avatarUrl} 
                  alt={targetUser.displayName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserOutlined />
              )}
            </div>
            <div>
              <Text strong>{targetUser.displayName}</Text>
              <div>
                <Text type="secondary" className="text-xs">
                  {targetUser.email}
                </Text>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          BAN: 'red',
          TIMEOUT: 'orange',
          WARNING: 'gold',
          MUTE: 'blue'
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: 'Scope',
      dataIndex: 'scope',
      key: 'scope',
      render: (scope: string) => <Tag>{scope}</Tag>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      render: (reason: string) => (
        <Tooltip title={reason}>
          <span>{reason}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: unknown, record: ModerationAction) => {
        if (!record.expiresAt) {
          return <Tag color="red">Permanent</Tag>;
        }
        
        const now = new Date();
        const expiresAt = new Date(record.expiresAt);
        
        if (now > expiresAt) {
          return <Tag color="default">Expired</Tag>;
        }
        
        return (
          <Tooltip title={format(expiresAt, 'PPpp')}>
            <Tag icon={<ClockCircleOutlined />} color="blue">
              {formatDistance(expiresAt, now, { addSuffix: true })}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, record: ModerationAction) => (
        <Tag color={record.active ? 'success' : 'default'}>
          {record.active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Moderator',
      key: 'moderator',
      render: (_: unknown, record: ModerationAction) => {
        if (!record.moderator) {
          return <Text type="secondary">System</Text>;
        }
        return <Text type="secondary">{record.moderator.displayName}</Text>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Tooltip title={format(new Date(date), 'PPpp')}>
          {format(new Date(date), 'PP')}
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: ModerationAction) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              type="text"
              onClick={() => {/* View details implementation */}}
            />
          </Tooltip>
          {record.active && (
            <Popconfirm
              title="Remove this moderation action?"
              description="This will deactivate the moderation action and allow the user access again."
              onConfirm={() => handleRemoveModeration(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                type="text"
                size="small"
                icon={<CloseCircleOutlined />}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>Moderation Dashboard</Title>
        <Button 
          type="primary"
          onClick={() => setShowApplyModerationModal(true)}
          icon={<StopOutlined />}
        >
          Apply Moderation
        </Button>
      </div>

      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by username, email, etc..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              allowClear
            />
          </div>

          <Space wrap>
            <Button 
              icon={<UserOutlined />} 
              onClick={() => setShowUserSearchModal(true)}
            >
              {selectedUserName ? `User: ${selectedUserName}` : 'Select User'}
            </Button>

            <Select
              placeholder="Type"
              style={{ width: 120 }}
              value={moderationType}
              onChange={(value) => {
                setModerationType(value);
                setPage(1);
              }}
              allowClear
            >
              <Option value="BAN">Ban</Option>
              <Option value="TIMEOUT">Timeout</Option>
              <Option value="WARNING">Warning</Option>
              <Option value="MUTE">Mute</Option>
            </Select>

            <Select
              placeholder="Scope"
              style={{ width: 140 }}
              value={moderationScope}
              onChange={(value) => {
                setModerationScope(value);
                setPage(1);
              }}
              allowClear
            >
              <Option value="GLOBAL">Global</Option>
              <Option value="STREAM">Stream</Option>
              <Option value="CHAT">Chat</Option>
              <Option value="STREAM_CHAT">Stream Chat</Option>
            </Select>

            <Select
              placeholder="Status"
              style={{ width: 120 }}
              value={activeOnly}
              onChange={(value) => {
                setActiveOnly(value);
                setPage(1);
              }}
              allowClear
            >
              <Option value="true">Active</Option>
              <Option value="false">Inactive</Option>
            </Select>

            <Tooltip title="Reset Filters">
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleResetFilters}
              />
            </Tooltip>
          </Space>
        </div>

        <div className="overflow-x-auto">
          <Table
            dataSource={moderations}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={false}
            locale={{
              emptyText: (
                <Empty 
                  description="No moderation actions found" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                />
              )
            }}
          />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            {total > 0 && (
              <Text type="secondary">
                Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} entries
              </Text>
            )}
          </div>
          
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(newPage) => setPage(newPage)}
            onShowSizeChange={(_, newPageSize) => {
              setPageSize(newPageSize);
              setPage(1);
            }}
            showSizeChanger
            showQuickJumper
          />
        </div>
      </Card>

      {/* User Search Modal */}
      {showUserSearchModal && (
        <UserSearchModal
          visible={showUserSearchModal}
          onClose={() => setShowUserSearchModal(false)}
          onUserSelected={handleUserSelected}
        />
      )}

      {/* Apply Moderation Modal */}
      {showApplyModerationModal && (
        <ApplyModerationModal
          visible={showApplyModerationModal}
          onClose={() => setShowApplyModerationModal(false)}
          onSuccess={handleApplyModeration}
          preselectedUserId={selectedUserId}
        />
      )}
    </div>
  );
};

export default ModerationDashboard; 