import React, { useState, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEthereumWallet } from '@/components/EthereumWalletButton';
import { useToast } from '@/providers/ToastProvider';
import { walletService } from '@/lib/walletService';
import SolanaWalletButton from '@/components/SolanaWalletButton';
import EthereumWalletButton from '@/components/EthereumWalletButton';
import WalletList, { WalletData } from '@/components/wallet/WalletList';

type WalletModalManagerProps = {
  onClose?: () => void;
};

const WalletModalManager: React.FC<WalletModalManagerProps> = ({ onClose }) => {
  const { connected: solanaConnected, publicKey: solanaPublicKey } = useWallet();
  const { connected: ethConnected, account: ethAccount } = useEthereumWallet();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isConnectingBackend, setIsConnectingBackend] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);
  const [backendWallets, setBackendWallets] = useState<WalletData[]>([]);
  const [activeTab, setActiveTab] = useState<'solana' | 'ethereum'>('solana');

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
          type: 'solana' as const,
          isPrimary: true,
          userId: result.wallet.userId
        }
      ]);
      
      // Set active tab to Solana
      setActiveTab('solana');
      
      // Close modal after successful connection
      if (onClose) {
        setTimeout(() => onClose(), 1000);
      }
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
          type: 'ethereum' as const,
          isPrimary: true,
          userId: result.wallet.userId
        }
      ]);
      
      // Set active tab to Ethereum
      setActiveTab('ethereum');
      
      // Close modal after successful connection
      if (onClose) {
        setTimeout(() => onClose(), 1000);
      }
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingOutlined style={{ fontSize: "24px", color: "var(--color-brand)" }} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h4 className="text-md font-semibold text-white mb-2">Connect Wallet</h4>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          Choose your preferred blockchain network to start donating
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
      
      {/* Connecting Status */}
      {isConnectingBackend && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <LoadingOutlined className="text-yellow-500" />
            <span className="text-yellow-500 text-sm">Connecting wallet to your account...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletModalManager; 