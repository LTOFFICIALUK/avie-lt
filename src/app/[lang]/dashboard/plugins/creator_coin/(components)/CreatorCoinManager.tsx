"use client";
import React, { useState, useEffect } from "react";
import { Tabs, Typography, Button, Empty, Spin, message, Steps } from "antd";
import { PlusOutlined, ReloadOutlined, LoadingOutlined } from "@ant-design/icons";
import api from "@/lib/api";

import TokenCreationForm from "./TokenCreationForm";
import TokenCreatedModal from "./TokenCreatedModal";
import WalletRequiredAlert from "./WalletRequiredAlert";
import TokenListItem from "./TokenListItem";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

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

interface PoolData {
  id: string;
  poolAddress: string;
  pairWith: string;
  initialLiquidity: number;
  lpTokensMinted: number;
}

const CreatorCoinManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasWallet, setHasWallet] = useState(true); // Assume wallet is connected initially, will be updated on component mount
  const [showCreatedModal, setShowCreatedModal] = useState(false);
  const [createdToken, setCreatedToken] = useState<TokenData | null>(null);
  const [creationStep, setCreationStep] = useState(0);
  const [creationMessage, setCreationMessage] = useState("");

  useEffect(() => {
    fetchUserTokens();
  }, []);

  const fetchUserTokens = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/solana/tokens");
      if (response.data) {
        setTokens(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching tokens:", error);
      
      // If the error is because user has no wallet connected
      if (error.response?.status === 400 && error.response?.data?.error?.includes("no wallet")) {
        setHasWallet(false);
      } else {
        message.error("Failed to load tokens. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = async (tokenData: any) => {
    try {
      setCreationStep(1);
      setCreationMessage("Creating token on Solana blockchain...");
      
      // Create the token
      const response = await api.post("/api/solana/tokens", tokenData);
      const createdTokenData = response.data;
      
      // If user wants to create a liquidity pool
      if (tokenData.createPool && createdTokenData) {
        setCreationStep(2);
        setCreationMessage(`Creating liquidity pool with ${tokenData.poolPairWith}...`);
        
        // Create the liquidity pool
        const poolResponse = await api.post(`/api/solana/tokens/${createdTokenData.id}/pool`, {
          pairWith: tokenData.poolPairWith,
          initialLiquidity: tokenData.initialLiquidity
        });
        
        // Update the created token data with pool information
        if (poolResponse.data) {
          createdTokenData.liquidityPools = [poolResponse.data];
        }
        
        setCreationStep(3);
        setCreationMessage("Your token and liquidity pool are ready!");
      } else {
        setCreationStep(2);
        setCreationMessage("Your token is ready!");
      }
      
      if (createdTokenData) {
        setCreatedToken(createdTokenData);
        setShowCreatedModal(true);
        fetchUserTokens(); // Refresh the token list
      }
      
      return createdTokenData;
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes("no wallet")) {
        setHasWallet(false);
      }
      throw error; // Re-throw to be handled by the form component
    } finally {
      // Reset creation steps after a delay
      setTimeout(() => {
        setCreationStep(0);
        setCreationMessage("");
      }, 2000);
    }
  };

  const handleConnectWallet = () => {
    // Open wallet connect modal logic here
    message.info("Wallet connection modal would open here");
    // This would typically trigger your wallet connection flow
    // For now, we'll just show a message
  };

  const handleViewTokenDetails = (tokenId: string) => {
    // Navigate to token details page or open a modal with details
    message.info(`View details for token ${tokenId}`);
  };

  const renderCreationSteps = () => {
    if (creationStep === 0) {
      return null;
    }
    
    const items = [
      {
        title: 'Create Token',
        status: creationStep >= 1 ? 'finish' : 'wait' as 'finish' | 'wait',
      },
      {
        title: 'Create Liquidity Pool',
        status: creationStep === 0 ? 'wait' : 
                creationStep === 1 ? 'wait' : 
                creationStep >= 2 ? 'finish' : 'wait' as 'finish' | 'wait',
      },
      {
        title: 'Complete',
        status: creationStep >= 3 ? 'finish' : 'wait' as 'finish' | 'wait',
      },
    ];

    return (
      <div className="mb-6 mt-6 p-4 bg-[var(--color-gray)] rounded-md">
        <div className="mb-3 flex items-center">
          <LoadingOutlined style={{ fontSize: 18 }} className="mr-2 text-[var(--color-brand)]" />
          <Text className="text-[var(--text-secondary)]">{creationMessage}</Text>
        </div>
        <Steps 
          items={items} 
          current={creationStep - 1} 
          size="small"
        />
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-12">
          <Spin size="large" />
        </div>
      );
    }

    if (activeTab === "1") {
      // Create Token tab
      return (
        <div>
          {!hasWallet && (
            <WalletRequiredAlert onConnectWallet={handleConnectWallet} />
          )}
          {renderCreationSteps()}
          <TokenCreationForm onCreateToken={handleCreateToken} />
        </div>
      );
    } else {
      // My Tokens tab
      return (
        <div>
          {!hasWallet ? (
            <WalletRequiredAlert onConnectWallet={handleConnectWallet} />
          ) : tokens.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="You don't have any tokens yet"
              className="py-12"
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setActiveTab("1")}
              >
                Create Your First Token
              </Button>
            </Empty>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <Title level={4} className="m-0">
                  Your Tokens
                </Title>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchUserTokens}
                >
                  Refresh
                </Button>
              </div>
              <div>
                {tokens.map((token) => (
                  <TokenListItem
                    key={token.id}
                    token={token}
                    onViewDetails={handleViewTokenDetails}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        className="creator-coin-tabs"
      >
        <TabPane tab="Create Token" key="1" />
        <TabPane tab={`My Tokens (${tokens.length})`} key="2" />
      </Tabs>

      {renderContent()}

      <TokenCreatedModal
        visible={showCreatedModal}
        onClose={() => setShowCreatedModal(false)}
        tokenDetails={createdToken}
      />
    </div>
  );
};

export default CreatorCoinManager; 