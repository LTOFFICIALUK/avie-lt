import React, { useMemo } from 'react';
import { Card, Progress, Tooltip } from 'antd';
import { 
  MessageOutlined, 
  EyeOutlined, 
  HeartOutlined, 
  DollarOutlined,
  UserAddOutlined, 
  TeamOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { XPBreakdown } from '@/types/xp';

interface XPSource {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface XPSourceChartProps extends XPBreakdown {
  loading?: boolean;
}

const XPSourceChart: React.FC<XPSourceChartProps> = ({
  chatXP,
  watchTimeXP,
  likedStreamsXP,
  donationsXP,
  uniqueViewersXP,
  newFollowersXP,
  streamChatXP,
  streamTimeXP,
  loading = false,
}) => {
  const sources = useMemo(() => {
    return [
      {
        label: 'Chat Messages',
        value: chatXP,
        icon: <MessageOutlined />,
        color: '#f5c242' // gold
      },
      {
        label: 'Watch Time',
        value: watchTimeXP,
        icon: <EyeOutlined />,
        color: '#52c41a' // green
      },
      {
        label: 'Stream Likes',
        value: likedStreamsXP,
        icon: <HeartOutlined />,
        color: '#ff4d4f' // red
      },
      {
        label: 'Donations',
        value: donationsXP,
        icon: <DollarOutlined />,
        color: '#1890ff' // blue
      },
      {
        label: 'Unique Viewers',
        value: uniqueViewersXP,
        icon: <TeamOutlined />,
        color: '#722ed1' // purple
      },
      {
        label: 'New Followers',
        value: newFollowersXP,
        icon: <UserAddOutlined />,
        color: '#faad14' // gold
      },
      {
        label: 'Stream Chat',
        value: streamChatXP,
        icon: <MessageOutlined />,
        color: '#eb2f96' // pink
      },
      {
        label: 'Stream Time',
        value: streamTimeXP,
        icon: <ClockCircleOutlined />,
        color: '#13c2c2' // cyan
      }
    ].filter(source => source.value > 0) // Only include sources with XP
      .sort((a, b) => b.value - a.value); // Sort by value (descending)
  }, [
    chatXP, 
    watchTimeXP, 
    likedStreamsXP, 
    donationsXP, 
    uniqueViewersXP, 
    newFollowersXP, 
    streamChatXP, 
    streamTimeXP
  ]);

  const totalXP = useMemo(() => {
    return sources.reduce((total, source) => total + source.value, 0);
  }, [sources]);

  return (
    <Card 
      title={
        <div className="flex items-center">
          <span className="text-[var(--color-brand)] mr-2">📊</span>
          <span className="truncate">AP Sources Breakdown</span>
        </div>
      }
      loading={loading}
      className="h-full shadow-sm bg-zinc-800/40 border-zinc-700"
    >
      <div className="space-y-4">
        {sources.length === 0 ? (
          <div className="text-center py-6 text-zinc-400">
            No AP earned yet
          </div>
        ) : (
          sources.map((source, index) => {
            const percentage = Math.round((source.value / totalXP) * 100);
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between flex-wrap">
                  <div className="flex items-center gap-2 min-w-0 max-w-full pr-2">
                    <div style={{ color: source.color }} className="flex-shrink-0">{source.icon}</div>
                    <span className="text-sm truncate">{source.label}</span>
                  </div>
                  <div className="text-sm whitespace-nowrap flex-shrink-0">
                    {source.value.toLocaleString()} AP ({percentage}%)
                  </div>
                </div>
                <Tooltip title={`${percentage}% of your AP comes from ${source.label}`}>
                  <Progress 
                    percent={percentage} 
                    showInfo={false} 
                    strokeColor={source.color}
                    trailColor="rgba(255,255,255,0.1)"
                    size="small"
                  />
                </Tooltip>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default XPSourceChart; 