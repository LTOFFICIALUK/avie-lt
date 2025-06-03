"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, Empty, Spin, Button, Alert, Typography, Card, Space, Tooltip, Input } from 'antd';
import { ReloadOutlined, WalletOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { NFTCard } from './NFTCard';
import { useNFT } from './NFTProvider';
import { useEthereumWallet } from '../EthereumWalletButton';
import { NFT } from '@/types/nft';
import MultiWalletExample from '../MultiWalletExample';

const { Text } = Typography;
const { Search } = Input;

interface NFTSelectorProps {
  onSelect: (nft: NFT | null) => void;
  selectedNft: NFT | null;
  metadataOnly?: boolean;
  showEmptyState?: boolean;
}

export function NFTSelector({
  onSelect,
  selectedNft,
  metadataOnly = false,
  showEmptyState = true,
}: NFTSelectorProps) {
  const {
    solanaWallet,
    ethereumWallet,
    solanaLoading,
    ethereumLoading,
    solanaNFTs,
    ethereumNFTs,
    fetchSolanaNFTs,
    fetchEthereumNFTs,
  } = useNFT();
  
  // Get direct Ethereum wallet connection
  const { connected: ethereumDirectConnected, account: ethereumDirectAccount } = useEthereumWallet();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh NFTs when wallets change
  useEffect(() => {
    if (solanaWallet || ethereumWallet) {
      refreshNFTs();
    }
  }, [solanaWallet, ethereumWallet]);

  // Log wallet connection status and fix any detection issues
  useEffect(() => {
    // If Ethereum is connected but not detected in NFTProvider, trigger refresh
    if (ethereumDirectConnected && ethereumDirectAccount && !ethereumWallet) {
      fetchEthereumNFTs();
    }
  }, [solanaWallet, ethereumWallet, ethereumDirectConnected, ethereumDirectAccount, fetchEthereumNFTs]);

  // Filter NFTs based on search term
  const filteredNFTs = {
    solana: (solanaNFTs || []).filter(nft => 
      nft.metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.tokenAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.tokenId?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    ethereum: (ethereumNFTs || []).filter(nft => 
      nft.metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.tokenAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.tokenId?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    all: [...(solanaNFTs || []), ...(ethereumNFTs || [])].filter(nft => 
      nft.metadata?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.tokenAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.tokenId?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  // Handle NFT selection
  const handleSelectNFT = (nft: NFT) => {
    onSelect(selectedNft?.id === nft.id ? null : nft);
  };

  // Refresh NFTs from both chains
  const refreshNFTs = async () => {
    setIsRefreshing(true);
    
    try {
      if (solanaWallet) {
        await fetchSolanaNFTs();
      }
      
      if (ethereumWallet || ethereumDirectConnected) {
        await fetchEthereumNFTs();
      }
    } catch (error) {
      console.error('Error refreshing NFTs:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // No wallets connected state
  const NoWalletsConnected = () => (
    <Card 
      className="text-center p-5 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--background-secondary)]"
    >
      <Space direction="vertical" className="w-full">
        <Text type="secondary">Connect a wallet to display your NFTs</Text>
        <div className="my-4">
          <MultiWalletExample />
        </div>
        <Text type="secondary" className="text-xs">
          Compatible with Solana and Ethereum wallets
        </Text>
      </Space>
    </Card>
  );

  // No NFTs state
  const NoNFTsState = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <Space direction="vertical" className="w-full">
          <Text>No NFTs found in your wallet</Text>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={refreshNFTs}
            loading={isRefreshing}
          >
            Refresh
          </Button>
        </Space>
      }
    />
  );

  // Get display content based on current state
  const getContent = () => {
    // Loading state
    if ((solanaLoading && activeTab !== 'ethereum') || (ethereumLoading && activeTab !== 'solana') || isRefreshing) {
      return (
        <div className="py-10 text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text type="secondary">Loading your NFTs...</Text>
          </div>
        </div>
      );
    }

    // No wallets connected
    if (!solanaWallet && !(ethereumWallet || ethereumDirectConnected) && showEmptyState) {
      return <NoWalletsConnected />;
    }

    // No NFTs in the selected category
    const currentNFTs = filteredNFTs[activeTab as keyof typeof filteredNFTs] || [];
    if (currentNFTs.length === 0) {
      if ((activeTab === 'solana' && !solanaWallet) || 
          (activeTab === 'ethereum' && !(ethereumWallet || ethereumDirectConnected))) {
        return (
          <Alert
            message="Wallet not connected"
            description={`Connect your ${activeTab === 'solana' ? 'Solana' : 'Ethereum'} wallet to see your NFTs`}
            type="info"
            showIcon
            icon={<WalletOutlined />}
            className="mb-4"
          />
        );
      }
      
      return <NoNFTsState />;
    }

    // Display NFTs
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {currentNFTs.map((nft) => (
          <NFTCard
            key={nft.id}
            nft={nft}
            selected={selectedNft?.id === nft.id}
            onClick={handleSelectNFT}
            showChain={activeTab === 'all'}
            imageOnly={metadataOnly}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="small"
          className="mb-4 sm:mb-0"
          items={[
            {
              key: 'all',
              label: 'All NFTs'
            },
            {
              key: 'solana',
              label: (
                <span>
                  Solana
                  {solanaWallet ? 
                    <Tooltip title="Wallet connected">
                      <span className="text-green-500 text-base ml-1 inline-block translate-y-px">•</span>
                    </Tooltip> : 
                    <Tooltip title="Wallet not connected">
                      <ExclamationCircleOutlined className="ml-1 text-orange-500 text-xs" />
                    </Tooltip>
                  }
                </span>
              )
            },
            {
              key: 'ethereum',
              label: (
                <span>
                  Ethereum
                  {(ethereumWallet || ethereumDirectConnected) ? 
                    <Tooltip title="Wallet connected">
                      <span className="text-green-500 text-base ml-1 inline-block translate-y-px">•</span>
                    </Tooltip> : 
                    <Tooltip title="Wallet not connected">
                      <ExclamationCircleOutlined className="ml-1 text-orange-500 text-xs" />
                    </Tooltip>
                  }
                </span>
              )
            }
          ]}
        />
      
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <Search
            placeholder="Search NFTs..."
            className="w-full max-w-[260px]"
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={setSearchTerm}
            allowClear
            size="small"
          />
          
          <Button
            icon={<ReloadOutlined />}
            onClick={refreshNFTs}
            loading={isRefreshing}
            disabled={!solanaWallet && !(ethereumWallet || ethereumDirectConnected)}
            size="small"
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {getContent()}
    </div>
  );
} 