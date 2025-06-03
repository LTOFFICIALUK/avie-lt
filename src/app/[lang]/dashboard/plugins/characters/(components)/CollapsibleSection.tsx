import { ReactNode, useState } from "react";
import { Typography, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  initiallyOpen?: boolean;
}

export function CollapsibleSection({
  title,
  children,
  initiallyOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          cursor: 'pointer',
          padding: '8px 0'
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {title}
        </Text>
        <DownOutlined
          style={{ 
            fontSize: 16,
            color: 'var(--text-secondary)',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </div>

      <div style={{
        height: isOpen ? 'auto' : 0,
        overflow: 'hidden',
        transition: 'height 0.2s ease-out'
      }}>
        <Space direction="vertical" size="small" style={{ width: '100%', padding: '8px 0' }}>
          {children}
        </Space>
      </div>
    </div>
  );
} 