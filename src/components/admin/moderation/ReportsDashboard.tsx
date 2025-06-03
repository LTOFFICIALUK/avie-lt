'use client';

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Pagination, 
  Select, 
  Empty, 
  Tooltip,
  Popconfirm,
  message,
  Badge,
  Avatar,
  Modal
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FlagOutlined,
  EyeOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LoadingOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import api from '@/lib/api';
import { format } from 'date-fns';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

type StreamReport = {
  id: string;
  reason: string;
  description: string | null;
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED';
  createdAt: string;
  reporterId: string;
  streamId: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reporter: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    email: string;
    role: string;
  };
  stream: {
    id: string;
    title: string;
    thumbnail: string | null;
    isLive: boolean;
    user: {
      id: string;
      displayName: string;
      avatarUrl: string | null;
    };
  };
};

type ReportDetailModalProps = {
  report: StreamReport | null;
  visible: boolean;
  onClose: () => void;
  onStatusChange: (reportId: string, status: 'REVIEWED' | 'DISMISSED') => void;
};

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ 
  report, 
  visible, 
  onClose,
  onStatusChange
}) => {
  if (!report) return null;

  return (
    <Modal
      title="Report Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        report.status === 'PENDING' && (
          <Button 
            key="dismiss" 
            danger
            onClick={() => onStatusChange(report.id, 'DISMISSED')}
          >
            Dismiss Report
          </Button>
        ),
        report.status === 'PENDING' && (
          <Button 
            key="reviewed" 
            type="primary"
            onClick={() => onStatusChange(report.id, 'REVIEWED')}
          >
            Mark as Reviewed
          </Button>
        )
      ]}
      width={700}
    >
      <div className="space-y-6">
        {/* Reporter Info */}
        <div>
          <Title level={5}>Reporter</Title>
          <div className="flex items-center gap-3">
            <Avatar 
              size={40} 
              src={report.reporter.avatarUrl} 
              icon={!report.reporter.avatarUrl && <UserOutlined />} 
            />
            <div>
              <div><Text strong>{report.reporter.displayName}</Text></div>
              <div><Text type="secondary">{report.reporter.email}</Text></div>
            </div>
          </div>
        </div>

        {/* Stream Info */}
        <div>
          <Title level={5}>Reported Stream</Title>
          <div className="flex items-start gap-3">
            <div className="w-20 h-12 bg-gray-200 overflow-hidden rounded">
              {report.stream.thumbnail ? (
                <img 
                  src={report.stream.thumbnail} 
                  alt={report.stream.title || 'Stream thumbnail'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <VideoCameraOutlined style={{ color: 'white' }} />
                </div>
              )}
            </div>
            <div>
              <div><Text strong>{report.stream.title || 'Untitled Stream'}</Text></div>
              <div className="flex items-center gap-2">
                <Text type="secondary">by</Text>
                <Avatar 
                  size="small" 
                  src={report.stream.user.avatarUrl} 
                  icon={!report.stream.user.avatarUrl && <UserOutlined />} 
                />
                <Text>{report.stream.user.displayName}</Text>
                {report.stream.isLive && (
                  <Tag color="red">LIVE</Tag>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report Details */}
        <div>
          <Title level={5}>Report Details</Title>
          <div className="space-y-2">
            <div>
              <Text strong>Reason:</Text>
              <Paragraph>{report.reason}</Paragraph>
            </div>
            {report.description && (
              <div>
                <Text strong>Description:</Text>
                <Paragraph>{report.description}</Paragraph>
              </div>
            )}
            <div>
              <Text strong>Reported on:</Text>
              <Paragraph>{format(new Date(report.createdAt), 'PPpp')}</Paragraph>
            </div>
            <div>
              <Text strong>Status:</Text>{' '}
              {report.status === 'PENDING' && <Tag color="gold">Pending</Tag>}
              {report.status === 'REVIEWED' && <Tag color="green">Reviewed</Tag>}
              {report.status === 'DISMISSED' && <Tag color="default">Dismissed</Tag>}
            </div>
            {report.reviewedAt && (
              <div>
                <Text strong>Reviewed on:</Text>
                <Paragraph>{format(new Date(report.reviewedAt), 'PPpp')}</Paragraph>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div>
          <Title level={5}>Actions</Title>
          <Space>
            <Button 
              icon={<EyeOutlined />}
              href={`/channel/${report.stream.user.displayName}`}
              target="_blank"
            >
              View Stream
            </Button>
            <Button
              icon={<FlagOutlined />}
              href={`/admin/moderation?user=${report.stream.user.id}`}
            >
              View User Moderations
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

const ReportsDashboard: React.FC = () => {
  const [reports, setReports] = useState<StreamReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<StreamReport | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');

  // Fetch reports when component mounts or filters change
  useEffect(() => {
    fetchReports();
  }, [page, pageSize, statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/moderation/reports', {
        params: {
          status: statusFilter,
          page,
          limit: pageSize,
          sortBy: 'createdAt',
          sortDir: 'desc'
        }
      });
      
      setReports(response.data.reports);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      message.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (reportId: string, status: 'REVIEWED' | 'DISMISSED') => {
    try {
      setLoading(true);
      await api.put(`/api/moderation/reports/${reportId}`, { status });
      
      message.success(`Report marked as ${status.toLowerCase()}`);
      
      // Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? { ...report, status } : report
        )
      );
      
      setShowReportModal(false);
      fetchReports(); // Refetch to update counters
    } catch (error) {
      console.error('Failed to update report status:', error);
      message.error('Failed to update report status');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setStatusFilter('PENDING');
    setPage(1);
  };

  const viewReportDetails = (report: StreamReport) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const columns = [
    {
      title: 'Stream',
      dataIndex: ['stream'],
      key: 'stream',
      render: (stream: StreamReport['stream']) => (
        <div className="flex items-center">
          <div className="w-12 h-8 bg-gray-200 rounded overflow-hidden mr-2">
            {stream.thumbnail ? (
              <img
                src={stream.thumbnail}
                alt={stream.title || 'Stream thumbnail'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <VideoCameraOutlined style={{ color: 'white' }} />
              </div>
            )}
          </div>
          <div>
            <Text strong>{stream.title || 'Untitled Stream'}</Text>
            <div>
              <Text type="secondary">{stream.user.displayName}</Text>
              {stream.isLive && (
                <Tag color="red" className="ml-2">LIVE</Tag>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Reporter',
      dataIndex: ['reporter'],
      key: 'reporter',
      render: (reporter: StreamReport['reporter']) => (
        <div className="flex items-center">
          <Avatar 
            size="small" 
            src={reporter.avatarUrl} 
            icon={!reporter.avatarUrl && <UserOutlined />}
            className="mr-2"
          />
          <Text>{reporter.displayName}</Text>
        </div>
      )
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
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'PENDING') return <Tag color="gold">Pending</Tag>;
        if (status === 'REVIEWED') return <Tag color="green">Reviewed</Tag>;
        if (status === 'DISMISSED') return <Tag color="default">Dismissed</Tag>;
        return null;
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => format(new Date(createdAt), 'PP')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: StreamReport) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewReportDetails(record)}
            size="small"
          />
          {record.status === 'PENDING' && (
            <>
              <Popconfirm
                title="Mark as reviewed?"
                onConfirm={() => handleChangeStatus(record.id, 'REVIEWED')}
              >
                <Button
                  icon={<CheckCircleOutlined />}
                  size="small"
                  type="text"
                  className="text-green-500 hover:text-green-600"
                />
              </Popconfirm>
              <Popconfirm
                title="Dismiss this report?"
                onConfirm={() => handleChangeStatus(record.id, 'DISMISSED')}
              >
                <Button
                  icon={<CloseCircleOutlined />}
                  size="small"
                  type="text"
                  danger
                />
              </Popconfirm>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>Stream Reports</Title>
        <Badge count={total} showZero={false} offset={[-5, 5]}>
          <Button 
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchReports}
          >
            Refresh
          </Button>
        </Badge>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <FilterOutlined className="mr-2" />
              <span>Status:</span>
            </div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="PENDING">Pending</Option>
              <Option value="REVIEWED">Reviewed</Option>
              <Option value="DISMISSED">Dismissed</Option>
              <Option value="ALL">All</Option>
            </Select>
            
            <Button 
              icon={<ReloadOutlined />} 
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>
          
          <Text>
            {total === 1 ? '1 report found' : `${total} reports found`}
          </Text>
        </div>

        <Table
          dataSource={reports}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: <Empty description="No reports found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }}
        />

        <div className="mt-4 flex justify-end">
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

      {/* Report Details Modal */}
      <ReportDetailModal
        report={selectedReport}
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onStatusChange={handleChangeStatus}
      />
    </div>
  );
};

export default ReportsDashboard; 