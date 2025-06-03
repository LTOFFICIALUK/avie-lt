"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { StarFilled, StarOutlined, DeleteOutlined } from '@ant-design/icons';

// Define wallet type
export type WalletData = {
  id: string;
  address: string;
  type: 'ethereum' | 'solana';
  isPrimary: boolean;
  userId: string;
};

// Props for the WalletList component
type WalletListProps = {
  solanaWallets: WalletData[];
  ethereumWallets: WalletData[];
  setPrimaryWallet: (walletId: string) => Promise<void>;
  disconnectWallet: (walletId: string) => Promise<void>;
  isSettingPrimary: boolean;
  activeTab?: 'solana' | 'ethereum';
  onTabChange?: (tab: 'solana' | 'ethereum') => void;
};

const WalletList: React.FC<WalletListProps> = ({
  solanaWallets,
  ethereumWallets,
  setPrimaryWallet,
  disconnectWallet,
  isSettingPrimary,
  activeTab = 'solana',
  onTabChange
}) => {
  const [currentTab, setCurrentTab] = useState<'solana' | 'ethereum'>(activeTab);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle tab change
  const handleTabChange = (tab: 'solana' | 'ethereum') => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Handle opening blockchain explorer
  const openExplorer = (address: string, type: 'ethereum' | 'solana') => {
    let url = '';
    if (type === 'ethereum') {
      // Ethereum mainnet explorer
      url = `https://etherscan.io/address/${address}`;
    } else {
      // Solana mainnet explorer
      url = `https://explorer.solana.com/address/${address}`;
    }
    window.open(url, '_blank');
  };

  const getWalletLogo = (type: 'ethereum' | 'solana') => {
    return type === 'ethereum' ? '/images/tokens/eth-logo.png' : '/images/tokens/sol-logo.png';
  };

  // Get wallets based on current tab
  const currentWallets = currentTab === 'solana' ? solanaWallets : ethereumWallets;

  return (
    <div className="wallet-list bg-[#070C0C] rounded-lg border border-[#18181b] overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#18181b]">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            currentTab === 'solana' 
              ? 'text-white border-b-2 border-[var(--color-brand)]' 
              : 'text-[#999999] hover:text-white'
          }`}
          onClick={() => handleTabChange('solana')}
        >
          <div className="flex items-center justify-center gap-2">
            <Image 
              src="/images/tokens/sol-logo.png"
              alt="Solana"
              width={16}
              height={16}
              className="rounded-full"
            />
            Solana
          </div>
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            currentTab === 'ethereum' 
              ? 'text-white border-b-2 border-[var(--color-brand)]' 
              : 'text-[#999999] hover:text-white'
          }`}
          onClick={() => handleTabChange('ethereum')}
        >
          <div className="flex items-center justify-center gap-2">
            <Image 
              src="/images/tokens/eth-logo.png"
              alt="Ethereum"
              width={16}
              height={16}
              className="rounded-full"
            />
            Ethereum
          </div>
        </button>
      </div>

      {/* Wallet List */}
      <div className="p-3">
        {currentWallets.length > 0 ? (
          <div className="space-y-2">
            {currentWallets.map((wallet) => (
              <div 
                key={wallet.id}
                className="p-2 bg-[#101616] rounded-md border border-[#18181b] flex items-center"
              >
                {/* Wallet Logo */}
                <div className="mr-3">
                  <Image 
                    src={getWalletLogo(wallet.type)}
                    alt={wallet.type}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
                
                {/* Wallet Address */}
                <div className="flex-1 truncate">
                  <p className="text-sm text-white truncate">
                    {formatAddress(wallet.address)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 ml-2">
                  {/* Star Button */}
                  <button
                    onClick={() => setPrimaryWallet(wallet.id)}
                    disabled={isSettingPrimary || wallet.isPrimary}
                    className={`p-1.5 rounded-full hover:bg-[#18181b] transition-colors ${
                      wallet.isPrimary ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
                    }`}
                    title={wallet.isPrimary ? "Primary wallet" : "Set as primary wallet"}
                  >
                    {wallet.isPrimary ? <StarFilled /> : <StarOutlined />}
                  </button>
                  
                  {/* Explorer Button */}
                  <button
                    onClick={() => openExplorer(wallet.address, wallet.type)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-[#18181b] transition-colors"
                    title="View on blockchain explorer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => disconnectWallet(wallet.id)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-[#18181b] transition-colors"
                    title="Remove wallet"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-[#999999]">No {currentTab} wallets connected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletList; 