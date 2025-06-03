import React from 'react';
import { Card, Tooltip } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

interface XPStatCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  loading?: boolean;
  color?: string;
  tooltip?: string;
}

const XPStatCard: React.FC<XPStatCardProps> = ({
  label,
  value,
  icon = <TrophyOutlined />,
  loading = false,
  color = 'var(--color-brand)', // Default to brand color
  tooltip,
}) => {
  const content = (
    <div className="flex flex-col h-full py-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex-shrink-0 text-lg" style={{ color }}>{icon}</span>
        <span className="font-medium text-sm text-zinc-300 truncate">{label}</span>
      </div>
      
      <div className="flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-bold truncate" style={{ color }}>
          {value.toLocaleString()}
        </div>
        <div className="text-xs text-zinc-400 uppercase tracking-wide flex-shrink-0 ml-1">AP</div>
      </div>
    </div>
  );

  return tooltip ? (
    <Tooltip title={tooltip} placement="top">
      <Card 
        loading={loading}
        className="h-full shadow-sm bg-zinc-800/40 border-zinc-700 hover:border-zinc-600 transition-colors"
        bordered={true}
        bodyStyle={{ padding: '12px 16px' }}
      >
        {content}
      </Card>
    </Tooltip>
  ) : (
    <Card 
      loading={loading}
      className="h-full shadow-sm bg-zinc-800/40 border-zinc-700 hover:border-zinc-600 transition-colors"
      bordered={true}
      bodyStyle={{ padding: '12px 16px' }}
    >
      {content}
    </Card>
  );
};

export default XPStatCard; 