"use client";
import React from "react";
import { Modal, Typography, Button, Descriptions, Space, Divider, Tag, Alert, Card } from "antd";
import { 
  CopyOutlined, 
  CheckOutlined, 
  DollarOutlined, 
  SwapOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { message } from "antd";

const { Title, Paragraph, Text } = Typography;

interface PoolData {
  id: string;
  poolAddress: string;
  pairWith: string;
  initialLiquidity: number;
  lpTokensMinted: number;
}

interface TokenDetails {
  id: string;
  name: string;
  symbol: string;
  mintAddress: string;
  totalSupply: number;
  decimals: number;
  logoUrl?: string;
  liquidityPools?: PoolData[];
}

interface TokenCreatedModalProps {
  visible: boolean;
  onClose: () => void;
  tokenDetails: TokenDetails | null;
}

const TokenCreatedModal: React.FC<TokenCreatedModalProps> = ({
  visible,
  onClose,
  tokenDetails,
}) => {
  if (!tokenDetails) return null;

  const hasPool = tokenDetails.liquidityPools && tokenDetails.liquidityPools.length > 0;
  const pool = hasPool ? tokenDetails.liquidityPools![0] : null;

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
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      className="creator-coin-modal"
    >
      <div className="text-center mb-6">
        <CheckOutlined
          className="text-[var(--color-brand)] text-4xl mb-3"
          style={{ fontSize: 48 }}
        />
        <Title level={3}>Token Created Successfully!</Title>
        <Paragraph className="text-[var(--text-secondary)]">
          Your token has been created on the Solana blockchain. Here are the details:
        </Paragraph>
      </div>

      <Divider />

      <div className="flex items-center justify-center mb-6">
        {tokenDetails.logoUrl ? (
          <img
            src={tokenDetails.logoUrl}
            alt={tokenDetails.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[var(--color-brand)]"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-[var(--color-gray)] flex items-center justify-center border-4 border-[var(--color-brand)]">
            <DollarOutlined style={{ fontSize: 32 }} />
          </div>
        )}
      </div>

      <Descriptions
        bordered
        column={1}
        size="small"
        className="mb-6"
        labelStyle={{ fontWeight: "bold" }}
      >
        <Descriptions.Item label="Token Name">{tokenDetails.name}</Descriptions.Item>
        <Descriptions.Item label="Token Symbol">
          <Tag color="blue">{tokenDetails.symbol}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Total Supply">
          {tokenDetails.totalSupply.toLocaleString()} {tokenDetails.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Decimals">{tokenDetails.decimals}</Descriptions.Item>
        <Descriptions.Item label="Mint Address">
          <div className="flex items-center justify-between">
            <Text className="mr-2" ellipsis={{ tooltip: tokenDetails.mintAddress }}>
              {tokenDetails.mintAddress}
            </Text>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(tokenDetails.mintAddress, "Mint address")}
              size="small"
            />
          </div>
        </Descriptions.Item>
      </Descriptions>

      {hasPool && pool && (
        <div className="mb-6">
          <Title level={5} className="mb-3">
            <SwapOutlined className="mr-2" /> Liquidity Pool
          </Title>
          <Card size="small" className="bg-[var(--color-gray)]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Text className="text-[var(--text-secondary)] block mb-1">Paired With:</Text>
                <Tag color="green">{pool.pairWith}</Tag>
              </div>
              <div>
                <Text className="text-[var(--text-secondary)] block mb-1">Initial {pool.pairWith} Liquidity:</Text>
                <Text>{pool.initialLiquidity} {pool.pairWith}</Text>
              </div>
              <div>
                <Text className="text-[var(--text-secondary)] block mb-1">LP Tokens Minted:</Text>
                <Text>{pool.lpTokensMinted.toLocaleString()}</Text>
              </div>
              <div>
                <Text className="text-[var(--text-secondary)] block mb-1">Pool Address:</Text>
                <div className="flex items-center">
                  <Text ellipsis className="mr-1" style={{ maxWidth: '120px' }}>
                    {pool.poolAddress}
                  </Text>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(pool.poolAddress, "Pool address")}
                    size="small"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Alert
        message="Important"
        description={
          <>
            <Paragraph className="text-[var(--text-secondary)] text-sm mb-1">
              • Your token has a fixed supply that cannot be changed.
            </Paragraph>
            {hasPool ? (
              <Paragraph className="text-[var(--text-secondary)] text-sm mb-1">
                • Your token is now tradable through the liquidity pool.
              </Paragraph>
            ) : (
              <Paragraph className="text-[var(--text-secondary)] text-sm mb-1">
                • You can create a liquidity pool later to make your token tradable.
              </Paragraph>
            )}
            <Paragraph className="text-[var(--text-secondary)] text-sm mb-0">
              • A 0.5% fee is collected on all transfers to wallet address: 451PoyRuPJ5c5D2n4bNkincs2Y6cN8aor7pUEtJA5WWV
            </Paragraph>
          </>
        }
        type="info"
        showIcon
        className="mb-6"
      />

      <div className="flex justify-end">
        <Space>
          <Button onClick={onClose}>Close</Button>
          <Button
            type="primary"
            icon={<LinkOutlined />}
            onClick={() => window.open(`https://solscan.io/token/${tokenDetails.mintAddress}`, "_blank")}
          >
            View on Solscan
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default TokenCreatedModal; 