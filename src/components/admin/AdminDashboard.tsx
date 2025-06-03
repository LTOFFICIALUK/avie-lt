'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Statistic, 
  Table, 
  Tag, 
  Button,
  Spin,
  Empty,
  Alert,
  Space,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  StopOutlined, 
  BarChartOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  WarningOutlined,
  FlagOutlined,
  DollarOutlined
} from '@ant-design/icons';
import api from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';

const { Title, Text } = Typography;

// Updated type to match API response
type DashboardStats = {
  users: {
    total: number;
    registeredToday: number;
  };
  streams: {
    active: number;
    startedToday: number;
  };
  moderation: {
    active: number;
    createdToday: number;
    pendingReports: number;
    pendingAppeals: number;
  };
  donations: {
    countToday: number;
    amountUsdToday: number;
  };
  timestamp: string;
};

type RecentModeration = {
  id: string;
  type: string;
  scope: string;
  reason: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
  };
  moderator: {
    id: string;
    displayName: string;
  };
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentModerations, setRecentModerations] = useState<RecentModeration[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingModerations, setLoadingModerations] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchRecentModerations();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      // Call the real API endpoint
      const response = await api.get('/api/moderation/dashboard-stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRecentModerations = async () => {
    try {
      setLoadingModerations(true);
      // Fetch real moderation data from API
      const response = await api.get('/api/moderation/search', { 
        params: { 
          limit: 4, 
          active: 'true',
          sortBy: 'createdAt',
          sortDir: 'desc'
        } 
      });
      
      if (response.data?.moderations) {
        // Transform data to match our component needs
        const formattedModerations = response.data.moderations.map((mod: any) => ({
          id: mod.id,
          type: mod.type,
          scope: mod.scope,
          reason: mod.reason || 'No reason provided',
          createdAt: mod.createdAt,
          user: { 
            id: mod.targetUser?.id || 'unknown', 
            displayName: mod.targetUser?.displayName || 'Unknown User' 
          },
          moderator: { 
            id: mod.moderator?.id || 'system', 
            displayName: mod.moderator?.displayName || 'System' 
          }
        }));
        setRecentModerations(formattedModerations);
      }
    } catch (error) {
      console.error('Failed to fetch recent moderations:', error);
      setError('Failed to load recent moderation actions');
    } finally {
      setLoadingModerations(false);
    }
  };

  const moderationColumns = [
    {
      title: 'User',
      dataIndex: ['user', 'displayName'],
      key: 'user',
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
      title: 'Moderator',
      dataIndex: ['moderator', 'displayName'],
      key: 'moderator',
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => format(new Date(date), 'HH:mm'),
    },
  ];

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Title level={2}>Admin Dashboard</Title>
        <Text type="secondary">
          Overview of platform statistics and recent activities
        </Text>
      </div>

      {/* Stats Cards */}
      <Spin spinning={loadingStats} tip="Loading statistics...">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats?.users.total || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
              <div className="mt-2">
                <Text type="secondary">
                  +{stats?.users.registeredToday || 0} today
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Streamers"
                value={stats?.streams.active || 0}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className="mt-2">
                <Text type="secondary">
                  +{stats?.streams.startedToday || 0} today
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Moderations"
                value={stats?.moderation.active || 0}
                prefix={<StopOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
              <div className="mt-2">
                <Text type="secondary">
                  +{stats?.moderation.createdToday || 0} today
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Donations Today"
                value={stats?.donations.countToday || 0}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
              <div className="mt-2">
                <Text type="secondary">
                  ${stats?.donations.amountUsdToday?.toFixed(2) || '0.00'} USD
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Pending Issues Row */}
        <Row gutter={[16, 16]} className="mt-4">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex justify-between items-center">
                <Text strong>Pending Reports</Text>
                <Badge count={stats?.moderation.pendingReports || 0} color="#f50" />
              </div>
              <div className="mt-2">
                <Link href="/en/admin/reports" className="text-[var(--color-brand)]">
                  View Reports
                </Link>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <div className="flex justify-between items-center">
                <Text strong>Pending Appeals</Text>
                <Badge count={stats?.moderation.pendingAppeals || 0} color="#faad14" />
              </div>
              <div className="mt-2">
                <Link href="/en/admin/moderation?filter=appeals" className="text-[var(--color-brand)]">
                  View Appeals
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card
          title={
            <div className="flex justify-between items-center">
              <span>Recent Moderation Actions</span>
              <Link href="/en/admin/moderation">
                <Button type="link">View All</Button>
              </Link>
            </div>
          }
          loading={loadingModerations}
        >
          {recentModerations.length > 0 ? (
            <Table
              dataSource={recentModerations}
              columns={moderationColumns}
              pagination={false}
              rowKey="id"
            />
          ) : (
            <Empty description="No recent moderation actions" />
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Title level={4}>Quick Actions</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link href="/en/admin/moderation">
              <Button type="primary" icon={<StopOutlined />} block size="large">
                Moderation
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link href="/en/admin/reports">
              <Button 
                type="primary" 
                danger 
                icon={<FlagOutlined />} 
                block 
                size="large"
              >
                Reports
                {stats?.moderation.pendingReports ? 
                  <Badge 
                    count={stats.moderation.pendingReports} 
                    style={{ marginLeft: 8 }} 
                  /> : 
                  null
                }
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link href="/en/admin/users">
              <Button type="default" icon={<TeamOutlined />} block size="large">
                Users
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Link href="/en/admin/analytics">
              <Button type="default" icon={<BarChartOutlined />} block size="large">
                Analytics
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard; 