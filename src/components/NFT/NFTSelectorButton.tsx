"use client";

import React, { useState } from 'react';
import { Button, Space, Typography, Badge } from 'antd';
import { WalletOutlined, PictureOutlined } from '@ant-design/icons';
import { NFTSelectorOverlay } from './NFTSelectorOverlay';
import { NFTProvider, useNFT } from './NFTProvider';
import { useEthereumWallet } from '../EthereumWalletButton';
import { NFT } from '@/types/nft';

const { Text } = Typography;

interface NFTSelectorButtonProps {
  onSelect: (data: { useNft: boolean; nft: NFT | null }) => void;
  selectedNft: NFT | null;
  useNft: boolean;
  buttonText?: string;
  buttonType?: 'default' | 'primary' | 'link' | 'text' | 'dashed';
  buttonSize?: 'small' | 'middle' | 'large';
  className?: string;
  showPreview?: boolean;
}

export function NFTSelectorButton({
  onSelect,
  selectedNft,
  useNft,
  buttonText = 'Select NFT',
  buttonType = 'default',
  buttonSize = 'middle',
  className = '',
  showPreview = true,
}: NFTSelectorButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Check for wallet connection
  const { solanaWallet, ethereumWallet, ethereumConnected: providerEthereumConnected } = useNFT();
  const { connected: ethereumDirectConnected, account: ethereumDirectAccount } = useEthereumWallet();
  
  // Direct check of window.ethereum
  const [windowEthereumAccount, setWindowEthereumAccount] = useState<string | null>(null);
  
  // Check window.ethereum directly on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum?.isMetaMask) {
      try {
        console.log("NFTSelectorButton - Direct window.ethereum check - isMetaMask:", !!(window as any).ethereum?.isMetaMask);
        
        // Request accounts
        (window as any).ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts && accounts.length > 0) {
              console.log("NFTSelectorButton - Direct window.ethereum accounts:", accounts);
              setWindowEthereumAccount(accounts[0]);
            } else {
              console.log("NFTSelectorButton - No accounts from direct window.ethereum check");
            }
          })
          .catch((err: any) => {
            console.error("NFTSelectorButton - Error checking direct window.ethereum:", err);
          });
      } catch (err) {
        console.error("NFTSelectorButton - Error accessing window.ethereum:", err);
      }
    }
  }, []);
  
  // Combine connection sources
  const hasDirectWindowEthereum = !!windowEthereumAccount;
  const isEthereumConnected = providerEthereumConnected || ethereumDirectConnected || hasDirectWindowEthereum;
  
  // Log wallet connection status
  React.useEffect(() => {
    console.log("NFTSelectorButton - Wallet status:", {
      solanaConnected: !!solanaWallet,
      ethereumConnected: isEthereumConnected,
      solanaWallet: solanaWallet ? `${solanaWallet.slice(0, 6)}...${solanaWallet.slice(-4)}` : null,
      ethereumWallet: ethereumWallet ? `${ethereumWallet.slice(0, 6)}...${ethereumWallet.slice(-4)}` : null,
      directEthereumAccount: ethereumDirectAccount ? `${ethereumDirectAccount.slice(0, 6)}...${ethereumDirectAccount.slice(-4)}` : null,
      directEthereumConnected: ethereumDirectConnected,
      windowEthereumAccount: windowEthereumAccount ? `${windowEthereumAccount.slice(0, 6)}...${windowEthereumAccount.slice(-4)}` : null,
      hasDirectWindowEthereum
    });
  }, [
    solanaWallet, 
    ethereumWallet, 
    isEthereumConnected, 
    ethereumDirectAccount, 
    ethereumDirectConnected,
    windowEthereumAccount,
    hasDirectWindowEthereum
  ]);

  const handleSelectNft = (nft: NFT | null) => {
    onSelect({
      useNft: true,
      nft
    });
  };

  // Preview component for selected NFT
  const SelectedNFTPreview = () => {
    if (!selectedNft || !showPreview) return null;
    
    // Extract image URL
    const imageUrl = selectedNft.metadata?.image || '';
    const isIpfsUrl = imageUrl.startsWith('ipfs://');
    const formattedImageUrl = isIpfsUrl 
      ? `https://ipfs.io/ipfs/${imageUrl.replace('ipfs://', '')}`
      : imageUrl;
      
    // Format NFT name
    const nftName = selectedNft.metadata?.name || 'Unnamed NFT';
    const shortName = nftName.length > 20 ? `${nftName.substring(0, 20)}...` : nftName;
    
    return (
      <div className="flex items-center gap-3 p-3 mt-3 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg">
        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={formattedImageUrl} 
            alt={nftName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = target.nextElementSibling as HTMLDivElement;
              target.style.display = 'none';
              if (fallback) {
                fallback.style.display = 'flex';
              }
            }}
          />
          <div className="absolute inset-0 hidden items-center justify-center bg-[var(--background-tertiary)] text-[var(--text-secondary)]">
            <PictureOutlined />
          </div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <Text strong title={nftName} className="m-0 whitespace-nowrap overflow-hidden text-ellipsis">{shortName}</Text>
          <Text type="secondary" className="m-0 text-xs">
            {selectedNft.chain.charAt(0).toUpperCase() + selectedNft.chain.slice(1)}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <NFTProvider>
      <div>
        <Button
          type={buttonType}
          size={buttonSize}
          onClick={() => setModalVisible(true)}
          icon={<WalletOutlined />}
          className={className}
        >
          {selectedNft ? 'Change NFT' : buttonText}
          {selectedNft && (
            <Badge status="success" className="ml-2" /> 
          )}
        </Button>
        
        <SelectedNFTPreview />
        
        <NFTSelectorOverlay
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleSelectNft}
          selectedNft={selectedNft}
          title="Select NFT for Character"
          description="Choose an NFT from your wallet to use for character generation"
        />
      </div>
    </NFTProvider>
  );
} 