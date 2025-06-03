import React from "react";
import { Button, Typography, Empty, Popconfirm } from "antd";
import { DeleteOutlined, LinkOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface RestreamDestination {
  id: string;
  name: string;
  rtmpUrl: string;
  streamKey: string;
}

interface RestreamListProps {
  destinations: RestreamDestination[];
  onDeleteDestination: (id: string) => Promise<boolean>;
}

export const RestreamList: React.FC<RestreamListProps> = ({
  destinations,
  onDeleteDestination,
}) => {
  if (!destinations.length) {
    return (
      <div className="flex items-center justify-center py-6">
        <Empty
          description="No destinations configured yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {destinations.map((destination) => (
        <div
          key={destination.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-card/50 border border-border gap-4"
        >
          <div className="space-y-1">
            <div className="font-medium">{destination.name}</div>
            <Text style={{ color: 'var(--text-secondary)' }} className="text-sm">
              {destination.rtmpUrl}
            </Text>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="text"
              icon={<LinkOutlined />}
              onClick={() => window.open(destination.rtmpUrl, '_blank')}
              className="h-9 w-9 p-0 hover:bg-card/50"
              style={{ color: 'var(--text-secondary)' }}
            />
            <Popconfirm
              title="Delete this destination?"
              description="Are you sure you want to delete this multistream destination?"
              onConfirm={() => onDeleteDestination(destination.id)}
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                className="h-9 w-9 p-0 hover:bg-card/50"
              />
            </Popconfirm>
          </div>
        </div>
      ))}
    </div>
  );
}; 