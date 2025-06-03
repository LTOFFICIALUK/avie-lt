"use client";
import React from "react";
import { Card, Typography, Button, Tag, Space, Tooltip, Badge } from "antd";
import { DollarOutlined, CopyOutlined, ExportOutlined, SwapOutlined } from "@ant-design/icons";
import { message } from "antd";

const { Title, Text } = Typography;

interface PoolData {
  id: string;
  poolAddress: string;
  pairWith: string;
  initialLiquidity: number;
  lpTokensMinted: number;
}

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  mintAddress: string;
  totalSupply: number;
  decimals: number;
  logoUrl?: string;
  isVerified?: boolean;
  liquidityPools?: PoolData[];
}

interface TokenListItemProps {
  token: TokenData;
  onViewDetails: (tokenId: string) => void;
}

const TokenListItem: React.FC<TokenListItemProps> = ({ token, onViewDetails }) => {
  const hasPool = token.liquidityPools && token.liquidityPools.length > 0;
  const pool = hasPool && token.liquidityPools ? token.liquidityPools[0] : null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success(`${label} copied to clipboard`);
      },
      () => {
        message.error("Failed to copy to clipboard");
      }
    );
  };

  return (
    <Card 
      className="mb-4 hover:shadow-md transition-shadow duration-300"
      actions={[
        <Tooltip title="Copy Mint Address" key="copy">
          <Button 
            type="text" 
            icon={<CopyOutlined />} 
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(token.mintAddress, "Mint address");
            }}
          >
            Copy Address
          </Button>
        </Tooltip>,
        <Tooltip title="View on Solscan" key="solscan">
          <Button 
            type="text" 
            icon={<ExportOutlined />} 
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://solscan.io/token/${token.mintAddress}`, "_blank");
            }}
          >
            View on Solscan
          </Button>
        </Tooltip>,
      ]}
      onClick={() => onViewDetails(token.id)}
      hoverable
    >
      <div className="flex items-center">
        <div className="mr-4">
          {token.logoUrl ? (
            <img
              src={token.logoUrl}
              alt={token.name}
              className="w-14 h-14 rounded-full object-cover border border-[var(--color-gray)]"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[var(--color-gray)] flex items-center justify-center">
              <DollarOutlined style={{ fontSize: 24 }} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1 flex-wrap gap-1">
            <Title level={5} className="mb-0 mr-2">
              {token.name}
            </Title>
            <Tag color="blue">{token.symbol}</Tag>
            {token.isVerified && <Tag color="green">Verified</Tag>}
            {hasPool && (
              <Badge status="success">
                <Tag icon={<SwapOutlined />} color="purple">
                  Tradable
                </Tag>
              </Badge>
            )}
          </div>
          <Text className="text-[var(--text-secondary)] block mb-1" ellipsis>
            Mint: {token.mintAddress}
          </Text>
          <div className="flex justify-between items-center">
            <Text className="text-[var(--text-secondary)]">
              Supply: {token.totalSupply.toLocaleString()} {token.symbol}
            </Text>
            {hasPool && pool && (
              <Text className="text-[var(--text-secondary)]">
                Pool: {pool.pairWith}
              </Text>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TokenListItem; 