"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { useEthereumWallet } from "../EthereumWalletButton";
import { useToast } from "@/providers/ToastProvider";
import { walletService } from "../../lib/walletService";
import { WalletOutlined, LoadingOutlined } from "@ant-design/icons";
import WalletList, { WalletData } from './WalletList';
import SolanaWalletButton from "../SolanaWalletButton";
import EthereumWalletButton from "../EthereumWalletButton";

type WalletManagerProps = {
  className?: string;
};

const WalletManager: React.FC<WalletManagerProps> = ({ className }) => {
  const { connected: solanaConnected, publicKey: solanaPublicKey } = useWallet();
  const { connected: ethConnected, account: ethAccount } = useEthereumWallet();
  const toast = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectingBackend, setIsConnectingBackend] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);
  const [backendWallets, setBackendWallets] = useState<WalletData[]>([]);
  const [activeTab, setActiveTab] = useState<'solana' | 'ethereum'>('solana');
  
  const managerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (managerRef.current && !managerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Fetch wallet status from backend
  useEffect(() => {
    const fetchWalletStatus = async () => {
      try {
        setIsLoading(true);
        const response = await walletService.getWalletStatus();
        setBackendWallets(response.wallets || []);
      } catch (error) {
        console.error("Error getting wallet status:", error);
        // If the error is 401, the user is not logged in
        if ((error as any)?.response?.status === 401) {
          setBackendWallets([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletStatus();
  }, []);

  // Set a wallet as primary
  const setPrimaryWallet = async (walletId: string) => {
    try {
      const targetWallet = backendWallets.find(w => w.id === walletId);
      
      if (!targetWallet) {
        toast.error("Wallet not found");
        return;
      }
      
      setIsSettingPrimary(true);
      await walletService.setPrimaryWallet(walletId);
      
      // Update local state
      setBackendWallets(prevWallets => {
        const updatedWallet = prevWallets.find(w => w.id === walletId);
        if (!updatedWallet) return prevWallets;
        
        return prevWallets.map(wallet => {
          if (wallet.type === updatedWallet.type) {
            // Set isPrimary=true for the selected wallet, false for others
            return {
              ...wallet,
              isPrimary: wallet.id === walletId
            };
          }
          return wallet;
        });
      });
      
      toast.success("Primary wallet updated successfully");
    } catch (error) {
      console.error("Error setting primary wallet:", error);
      toast.error((error as Error).message || "Failed to set primary wallet");
    } finally {
      setIsSettingPrimary(false);
    }
  };

  // Disconnect a wallet
  const disconnectWallet = async (walletId: string) => {
    try {
      const wallet = backendWallets.find(w => w.id === walletId);
      if (!wallet) {
        toast.error("Wallet not found");
        return;
      }

      await walletService.disconnectWallet(wallet.address, wallet.type);
      
      // Update local state
      setBackendWallets(prev => prev.filter(w => w.id !== walletId));
      toast.success(`${wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)} wallet disconnected from your account`);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error((error as Error).message || "Failed to disconnect wallet");
    }
  };

  // Handle connecting wallets to backend
  const handleConnectSolanaWallet = async (address: string) => {
    try {
      // Validate the address
      if (!address || address.trim() === '') {
        toast.error("Invalid Solana wallet address");
        return;
      }
      
      setIsConnectingBackend(true);
      
      // Check if already connected
      const existingWallet = backendWallets.find(
        w => w.type === 'solana' && w.address === address
      );
      
      if (existingWallet) {
        toast.info("This Solana wallet is already connected to your account");
        return;
      }
      
      const result = await walletService.connectWallet(address, 'solana');
      toast.success("Solana wallet connected to your account");
      
      // Add to state
      setBackendWallets(prev => [
        ...prev.map(w => w.type === 'solana' ? { ...w, isPrimary: false } : w),
        {
          id: result.wallet.id,
          address: address,
          type: 'solana',
          isPrimary: true,
          userId: result.wallet.userId
        }
      ]);
      
      // Set active tab to Solana
      setActiveTab('solana');
    } catch (error) {
      console.error("Error connecting Solana wallet:", error);
      toast.error((error as Error).message || "Failed to connect Solana wallet");
    } finally {
      setIsConnectingBackend(false);
    }
  };

  const handleConnectEthereumWallet = async (address: string) => {
    try {
      // Validate the address
      if (!address || address.trim() === '') {
        toast.error("Invalid Ethereum wallet address");
        return;
      }
      
      setIsConnectingBackend(true);
      
      // Check if already connected
      const existingWallet = backendWallets.find(
        w => w.type === 'ethereum' && w.address === address
      );
      
      if (existingWallet) {
        toast.info("This Ethereum wallet is already connected to your account");
        return;
      }
      
      const result = await walletService.connectWallet(address, 'ethereum');
      toast.success("Ethereum wallet connected to your account");
      
      // Add to state
      setBackendWallets(prev => [
        ...prev.map(w => w.type === 'ethereum' ? { ...w, isPrimary: false } : w),
        {
          id: result.wallet.id,
          address: address,
          type: 'ethereum',
          isPrimary: true,
          userId: result.wallet.userId
        }
      ]);
      
      // Set active tab to Ethereum
      setActiveTab('ethereum');
    } catch (error) {
      console.error("Error connecting Ethereum wallet:", error);
      toast.error((error as Error).message || "Failed to connect Ethereum wallet");
    } finally {
      setIsConnectingBackend(false);
    }
  };

  // Group wallets by type
  const solanaWallets = backendWallets.filter(w => w.type === 'solana');
  const ethereumWallets = backendWallets.filter(w => w.type === 'ethereum');

  // Get wallets connected in frontend that match backend wallets
  const solanaWalletsConnected = solanaPublicKey ? 
    backendWallets.filter(w => w.type === 'solana' && w.address === solanaPublicKey.toString()) : 
    [];
  
  const ethWalletsConnected = ethAccount ? 
    backendWallets.filter(w => w.type === 'ethereum' && w.address === ethAccount) : 
    [];

  // Primary wallets for status indicators
  const primarySolanaWallet = backendWallets.find(w => w.type === 'solana' && w.isPrimary);
  const primaryEthWallet = backendWallets.find(w => w.type === 'ethereum' && w.isPrimary);
  const hasConnectedBackendWallet = primarySolanaWallet || primaryEthWallet;

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#18181b] hover:bg-[#222224] transition-colors border border-[rgba(255,255,255,0.2)]">
          <LoadingOutlined style={{ fontSize: "18px", color: "var(--color-brand)" }} />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className || ''}`}>
      <div className="relative" ref={managerRef}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#18181b] hover:bg-[#222224] transition-colors border border-[rgba(255,255,255,0.2)]"
          aria-label="Open wallet options"
        >
          <WalletOutlined style={{ fontSize: "18px", color: "var(--color-brand)" }} />
        </button>

        {/* Connected Status Indicator */}
        {hasConnectedBackendWallet && (
          <div className="absolute right-0 bottom-full w-3 h-3 bg-green-500 rounded-full border-2 border-[#070C0C]"></div>
        )}

        {/* Connecting Status Indicator */}
        {isConnectingBackend && (
          <div className="absolute right-0 bottom-full w-3 h-3 bg-yellow-500 rounded-full border-2 border-[#070C0C] animate-pulse"></div>
        )}

        {/* Wallet Panel */}
        {isOpen && (
          <div className="absolute right-0 bottom-full mb-2 z-50 w-80 overflow-hidden">
            <div className="mb-2 p-4 bg-[#070C0C] rounded-lg border border-[#18181b] shadow-lg">
              <h3 className="text-md font-semibold text-white">Connect Wallet</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 mb-3">
                Choose your preferred blockchain network
              </p>
              
              {/* Connection Buttons */}
              <div className="space-y-3">
                {/* Solana Connection */}
                <div className="p-3 rounded-lg bg-[#0a0f0f] border border-[#18181b]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src="/images/tokens/sol-logo.png" alt="Solana" className="w-5 h-5 rounded-full" />
                      <span className="text-white text-sm font-medium">Solana</span>
                    </div>
                    {solanaConnected && (
                      <span className="text-xs text-green-400">Connected</span>
                    )}
                  </div>
                  <SolanaWalletButton 
                    onConnectToAccount={
                      solanaConnected && solanaPublicKey && solanaWalletsConnected.length === 0 ? 
                      handleConnectSolanaWallet : undefined
                    }
                  />
                </div>
                
                {/* Ethereum Connection */}
                <div className="p-3 rounded-lg bg-[#0a0f0f] border border-[#18181b]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src="/images/tokens/eth-logo.png" alt="Ethereum" className="w-5 h-5 rounded-full" />
                      <span className="text-white text-sm font-medium">Ethereum</span>
                    </div>
                    {ethConnected && (
                      <span className="text-xs text-green-400">Connected</span>
                    )}
                  </div>
                  <EthereumWalletButton 
                    onConnectToAccount={
                      ethConnected && ethAccount && ethWalletsConnected.length === 0 ? 
                      handleConnectEthereumWallet : undefined
                    }
                  />
                </div>
              </div>
            </div>
            
            {/* Wallet List Component */}
            {backendWallets.length > 0 && (
              <WalletList 
                solanaWallets={solanaWallets}
                ethereumWallets={ethereumWallets}
                setPrimaryWallet={setPrimaryWallet}
                disconnectWallet={disconnectWallet}
                isSettingPrimary={isSettingPrimary}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletManager; 