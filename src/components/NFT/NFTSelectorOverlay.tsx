"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Button, Tabs, Spin, Typography, Space, Tooltip, Input, Tag, Alert } from 'antd';
import { 
  ReloadOutlined, 
  WalletOutlined, 
  InfoCircleOutlined, 
  ExclamationCircleOutlined, 
  CloseOutlined,
  CheckCircleOutlined,
  RightCircleOutlined
} from '@ant-design/icons';
import { NFTCard } from './NFTCard';
import { useNFT } from './NFTProvider';
import { useEthereumWallet } from '../EthereumWalletButton';
import { NFT } from '@/types/nft';
import MultiWalletExample from '../MultiWalletExample';
import { useWallet } from '@solana/wallet-adapter-react';

const { Text, Title } = Typography;
const { Search } = Input;

interface NFTSelectorOverlayProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (nft: NFT | null) => void;
  selectedNft: NFT | null;
  title?: string;
  description?: string;
}

export function NFTSelectorOverlay({
  visible,
  onClose,
  onSelect,
  selectedNft,
  title = "Select an NFT",
  description = "Choose an NFT from your wallet to use for your character"
}: NFTSelectorOverlayProps) {
  const {
    solanaWallet,
    ethereumWallet,
    solanaLoading,
    ethereumLoading,
    solanaNFTs,
    ethereumNFTs,
    fetchSolanaNFTs,
    fetchEthereumNFTs,
    ethereumConnected: providerEthereumConnected
  } = useNFT();
  
  // Get Ethereum wallet connection directly from the wallet context
  const { connected: ethereumDirectConnected, account: ethereumDirectAccount } = useEthereumWallet();
  
  // Get Solana wallet connection directly from the wallet context
  const { connected: solanaDirectConnected, publicKey: solanaPublicKey } = useWallet();
  
  // Also check window.ethereum directly (for development/debugging)
  const [windowEthereumAccounts, setWindowEthereumAccounts] = useState<string[] | null>(null);
  
  // Zastavice za sledenje, ali smo že preverili NFT-je za posamezno denarnico
  const [nftsChecked, setNftsChecked] = useState({
    ethereum: false,
    solana: false
  });

  // Stanje uporabniškega vmesnika
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Combine the two sources of truth for Ethereum connection
  // But give priority to ethereumDirectAccount (from EthereumWalletButton) when available
  const hasDirectWindowEthereum = !!(windowEthereumAccounts && windowEthereumAccounts.length > 0);
  
  // Special case for MetaMask - ignore non-MetaMask providers when MetaMask is selected
  let isEthereumConnected = false;
  let ethereumAccount: string | null = null;
  
  try {
    const savedWallet = typeof window !== 'undefined' ? 
      localStorage.getItem('livestreamcoin-ethereum-wallet') : null;
    
    // If MetaMask is explicitly selected, only consider MetaMask connections
    if (savedWallet === 'MetaMask') {
      // First check direct connection
      if (ethereumDirectConnected && ethereumDirectAccount) {
        isEthereumConnected = true;
        ethereumAccount = ethereumDirectAccount;
      } 
      // Then check for MetaMask in windowEthereumAccounts
      else if (hasDirectWindowEthereum && 
               typeof window !== 'undefined' && 
               (window as any).ethereum?.isMetaMask) {
        isEthereumConnected = true;
        ethereumAccount = windowEthereumAccounts[0];
      }
      // Otherwise use ethereumWallet if MetaMask is selected
      else if (ethereumWallet) {
        isEthereumConnected = true;
        ethereumAccount = ethereumWallet;
      }
    } 
    // Normal case for other wallets
    else {
      isEthereumConnected = providerEthereumConnected || ethereumDirectConnected || hasDirectWindowEthereum;
      ethereumAccount = ethereumDirectConnected && ethereumDirectAccount 
        ? ethereumDirectAccount 
        : ethereumWallet || (windowEthereumAccounts && windowEthereumAccounts[0]);
    }
  } catch (e) {
    console.error("NFTSelectorOverlay - Error processing wallet selection:", e);
    // Fallback to normal behavior
    isEthereumConnected = providerEthereumConnected || ethereumDirectConnected || hasDirectWindowEthereum;
    ethereumAccount = ethereumDirectConnected && ethereumDirectAccount 
      ? ethereumDirectAccount 
      : ethereumWallet || (windowEthereumAccounts && windowEthereumAccounts[0]);
  }

  // Special flag for Solana connection status that combines multiple sources
  const isSolanaConnected = solanaDirectConnected || solanaWallet === "connected-no-key" || !!solanaWallet;
  
  // Debug log Solana wallet state from different sources
  useEffect(() => {
    console.log("NFTSelectorOverlay - Solana wallet state:", {
      directConnected: solanaDirectConnected,
      directPublicKey: solanaPublicKey?.toString(),
      providerSolanaWallet: solanaWallet,
      isSolanaConnected
    });
    
    // Preverimo, če je Phantom povezan tudi preko window.solana
    if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
      const phantomConnected = (window as any).solana.isConnected;
      console.log("NFTSelectorOverlay - Phantom direct from window.solana:", {
        isConnected: phantomConnected,
        publicKey: (window as any).solana.publicKey?.toString()
      });
    }
  }, [solanaDirectConnected, solanaPublicKey, solanaWallet, isSolanaConnected]);

  // Log wallet information for debugging
  useEffect(() => {
    console.log("NFTSelectorOverlay - Wallet information:", {
      solanaWallet,
      isSolanaConnected,
      ethereumWallet,
      ethereumDirectConnected,
      ethereumDirectAccount,
      isEthereumConnected
    });
  }, [solanaWallet, ethereumWallet, ethereumDirectConnected, ethereumDirectAccount, isEthereumConnected]);

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

  // Handle select and close
  const handleSelectAndClose = () => {
    onClose();
  };

  // Refresh NFTs when component mounts or wallets change or becomes visible
  useEffect(() => {
    if (visible && (isSolanaConnected || isEthereumConnected)) {
      // Preveri, ali smo že preverili NFT-je
      const shouldCheckEthereum = isEthereumConnected && !nftsChecked.ethereum && !isRefreshing && !ethereumLoading;
      const shouldCheckSolana = isSolanaConnected && !nftsChecked.solana && !isRefreshing && !solanaLoading;
      
      if (shouldCheckEthereum || shouldCheckSolana) {
        console.log("NFTSelectorOverlay - Prvi pregled NFT-jev po prikazu", 
          { shouldCheckEthereum, shouldCheckSolana, ethereumLoading, solanaLoading });
        refreshNFTs();
      } else {
        console.log("NFTSelectorOverlay - NFT-ji že preverjeni, ne osvežujemo", 
          { ethereumChecked: nftsChecked.ethereum, solanaChecked: nftsChecked.solana });
      }
    }
  }, [visible, solanaWallet, isEthereumConnected]);

  // Direct check for wallet when modal becomes visible
  useEffect(() => {
    if (visible) {
      // If we already have an account from EthereumWalletButton, prioritize it
      if (ethereumDirectConnected && ethereumDirectAccount) {
        console.log("NFTSelectorOverlay - Already connected through EthereumWalletButton:", 
          ethereumDirectAccount.slice(0, 6) + '...' + ethereumDirectAccount.slice(-4));
        return;
      }
      
      // Check localStorage first to determine which wallet to use
      let savedWallet: string | null = null;
      try {
        if (typeof window !== 'undefined') {
          savedWallet = localStorage.getItem('livestreamcoin-ethereum-wallet');
          console.log("NFTSelectorOverlay - Using wallet from localStorage:", savedWallet, 
            "and window.ethereum is:", typeof window !== 'undefined' ? 
            {
              detected: !!(window as any).ethereum,
              isMetaMask: !!(window as any).ethereum?.isMetaMask,
              isPhantom: !!(window as any).ethereum?.isPhantom,
              isCoinbase: !!(window as any).ethereum?.isCoinbaseWallet,
              hasProviders: !!(window as any).ethereum?.providers
            } : 'undefined');
        }
      } catch (e) {
        console.error("NFTSelectorOverlay - Error reading localStorage:", e);
      }
      
      // Samo enkrat preveri račune
      if (!windowEthereumAccounts) {
        // Detect available wallets
        const isPhantom = typeof window !== 'undefined' && !!(window as any).ethereum?.isPhantom;
        const isMetaMask = typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask;
        
        // Determine which wallet to use based on saved preference
        // If user explicitly selected Phantom, use it regardless
        const explicitPhantom = savedWallet === 'Phantom';
        // Otherwise use Phantom only if no other wallet is available
        const defaultToPhantom = !savedWallet && isPhantom && !isMetaMask;
        const usePhantom = explicitPhantom || defaultToPhantom;
        
        // Use MetaMask if selected or no preference and available
        const useMetaMask = savedWallet === 'MetaMask' || (!savedWallet && isMetaMask);
        
        console.log("NFTSelectorOverlay - Refresh wallet decision:", { 
          savedWallet, 
          isPhantom, 
          isMetaMask, 
          explicitPhantom, 
          defaultToPhantom,
          usePhantom, 
          ethereumDirectConnected,
          ethereumDirectAccount
        });
        
        // Only proceed if we have the correct provider available
        const shouldUseProvider = 
          (useMetaMask && isMetaMask) || 
          (usePhantom && isPhantom) || 
          (typeof window !== 'undefined' && (window as any).ethereum);
          
        if (shouldUseProvider) {
          console.log(`NFTSelectorOverlay - Using ${useMetaMask ? 'MetaMask' : usePhantom ? 'Phantom' : 'available'} wallet`);
          
          // Force check accounts samo enkrat
          (window as any).ethereum.request({ method: 'eth_accounts' })
            .then((accounts: string[]) => {
              if (accounts && accounts.length > 0) {
                console.log(`NFTSelectorOverlay - Wallet returned accounts:`, accounts);
                setWindowEthereumAccounts(accounts);
              } else {
                console.log("NFTSelectorOverlay - No accounts returned from wallet");
                // Postavi prazno tabelo, da ne poskušamo več
                setWindowEthereumAccounts([]);
              }
            })
            .catch((err: any) => {
              console.error("NFTSelectorOverlay - Error getting wallet accounts:", err);
              // Postavi prazno tabelo, da ne poskušamo več
              setWindowEthereumAccounts([]);
            });
        } else {
          console.log("NFTSelectorOverlay - No compatible Ethereum wallet detected");
          // Postavi prazno tabelo, da ne poskušamo več
          setWindowEthereumAccounts([]);
        }
      }
    }
  }, [visible, ethereumDirectAccount, ethereumDirectConnected]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    console.log(`NFTSelectorOverlay - Tab changed to ${tab}, connection status:`, {
      isEthereumConnected,
      ethereumNFTs: ethereumNFTs.length,
      solanaWallet: !!solanaWallet
    });
    
    setActiveTab(tab);
    
    // Ne poskušaj več osvežiti, če smo že preverili
    if (tab === 'ethereum' && isEthereumConnected && ethereumNFTs.length === 0 && !nftsChecked.ethereum) {
      console.log("NFTSelectorOverlay - Ethereum tab selected with no NFTs, fetching once...");
      fetchEthereumNFTs().then(() => {
        setNftsChecked(prev => ({ ...prev, ethereum: true }));
      });
    }
    
    // Similarly for Solana
    if (tab === 'solana' && isSolanaConnected && solanaNFTs.length === 0 && !nftsChecked.solana) {
      console.log("NFTSelectorOverlay - Solana tab selected with no NFTs, fetching once...");
      fetchSolanaNFTs().then(() => {
        setNftsChecked(prev => ({ ...prev, solana: true }));
      });
    }
  };

  // Refresh NFTs from both chains
  const refreshNFTs = async () => {
    // Skip if already refreshing
    if (isRefreshing) {
      console.log("NFTSelectorOverlay - Already refreshing, skipping duplicate refresh");
      return;
    }
    
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Check localStorage first for saved wallet preference
      let savedWallet: string | null = null;
      try {
        if (typeof window !== 'undefined') {
          savedWallet = localStorage.getItem('livestreamcoin-ethereum-wallet');
          console.log("NFTSelectorOverlay - Refresh using wallet from localStorage:", savedWallet);
        }
      } catch (e) {
        console.error("NFTSelectorOverlay - Error reading localStorage in refreshNFTs:", e);
      }
      
      // Check what wallets are available in window.ethereum
      let detectedWallets = {
        hasMetaMask: false,
        hasPhantom: false,
        hasCoinbase: false
      };
      
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        detectedWallets = {
          hasMetaMask: !!(window as any).ethereum?.isMetaMask,
          hasPhantom: !!(window as any).ethereum?.isPhantom,
          hasCoinbase: !!(window as any).ethereum?.isCoinbaseWallet
        };
        
        console.log("NFTSelectorOverlay - Detected wallet types:", detectedWallets);
      }
      
      // Determine which wallet to use based on saved preference
      let walletToUse = '';
      
      // If user explicitly selected Phantom, use it
      const explicitPhantom = savedWallet === 'Phantom';
      // If user explicitly selected MetaMask, use it
      const explicitMetaMask = savedWallet === 'MetaMask';
      // Otherwise use Phantom only if no other wallet is available
      const defaultToPhantom = !savedWallet && detectedWallets.hasPhantom && !detectedWallets.hasMetaMask;
      
      if (explicitMetaMask && detectedWallets.hasMetaMask) {
        walletToUse = 'MetaMask';
      } else if (explicitPhantom || defaultToPhantom) {
        walletToUse = 'Phantom';
      } else if (detectedWallets.hasMetaMask) {
        walletToUse = 'MetaMask';
      } else if (detectedWallets.hasPhantom) {
        walletToUse = 'Phantom';
      } else if (detectedWallets.hasCoinbase) {
        walletToUse = 'Coinbase';
      }
      
      console.log("NFTSelectorOverlay - Wallet selection decision:", {
        savedWallet,
        detectedWallets,
        explicitPhantom,
        explicitMetaMask,
        defaultToPhantom,
        walletToUse,
        ethereumDirectConnected,
        ethereumDirectAccount: ethereumDirectAccount ? 
          `${ethereumDirectAccount.slice(0, 6)}...${ethereumDirectAccount.slice(-4)}` : null
      });
      
      // For Solana - samo če še nismo preverili
      if (isSolanaConnected && !nftsChecked.solana) {
        try {
          console.log("NFTSelectorOverlay - Refreshing Solana NFTs");
          await fetchSolanaNFTs();
          setNftsChecked(prev => ({ ...prev, solana: true }));
        } catch (error) {
          console.error("NFTSelectorOverlay - Error fetching Solana NFTs:", error);
          setError(`Solana NFT error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setNftsChecked(prev => ({ ...prev, solana: true }));
        }
      }
      
      // If using MetaMask, we need special handling
      if (walletToUse === 'MetaMask') {
        console.log("NFTSelectorOverlay - Using MetaMask wallet");
        
        // First check EthereumWalletButton direct connection - most reliable source
        if (ethereumDirectConnected && ethereumDirectAccount) {
          try {
            console.log("NFTSelectorOverlay - Refreshing Ethereum NFTs using connected MetaMask account:", 
              `${ethereumDirectAccount.slice(0, 6)}...${ethereumDirectAccount.slice(-4)}`);
            
            await fetchEthereumNFTs();
            
            // Mark as checked
            setNftsChecked(prev => ({ ...prev, ethereum: true }));
            setIsRefreshing(false);
            return;
          } catch (error) {
            console.error("NFTSelectorOverlay - Error fetching Ethereum NFTs with direct connection:", error);
            setError(`Error fetching NFTs: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setNftsChecked(prev => ({ ...prev, ethereum: true }));
            setIsRefreshing(false);
            return;
          }
        }
        
        // MetaMask samo enkrat preveri
        if (!nftsChecked.ethereum) {
          // Poskusi s providers tabelo
          if (typeof window !== 'undefined' && (window as any).ethereum?.providers?.length > 0) {
            try {
              console.log("NFTSelectorOverlay - Checking providers array for MetaMask refresh");
              const providers = (window as any).ethereum.providers;
              const metamaskProvider = providers.find((p: any) => p.isMetaMask && !p.isPhantom);
              
              if (metamaskProvider) {
                console.log("NFTSelectorOverlay - Found MetaMask in providers array for refresh");
                const accounts = await metamaskProvider.request({ method: 'eth_accounts' });
                
                if (accounts && accounts.length > 0) {
                  console.log("NFTSelectorOverlay - Found MetaMask accounts from providers array:", accounts);
                  setWindowEthereumAccounts(accounts);
                  await fetchEthereumNFTs();
                  setNftsChecked(prev => ({ ...prev, ethereum: true }));
                } else {
                  console.log("NFTSelectorOverlay - No accounts found from MetaMask providers array");
                  setNftsChecked(prev => ({ ...prev, ethereum: true }));
                }
              }
            } catch (err) {
              console.error("NFTSelectorOverlay - Error accessing MetaMask providers array for refresh:", err);
              setNftsChecked(prev => ({ ...prev, ethereum: true }));
            }
          }
          // Direct window.ethereum poskusi enkrat
          else if (typeof window !== 'undefined' && (window as any).ethereum?.isMetaMask && !(window as any).ethereum?.isPhantom) {
            try {
              console.log("NFTSelectorOverlay - Checking MetaMask directly for refresh");
              const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
              if (accounts && accounts.length > 0) {
                console.log("NFTSelectorOverlay - Found MetaMask accounts for refresh:", accounts);
                setWindowEthereumAccounts(accounts);
                await fetchEthereumNFTs();
              } else {
                console.log("NFTSelectorOverlay - No MetaMask accounts found for refresh");
              }
              setNftsChecked(prev => ({ ...prev, ethereum: true }));
            } catch (err) {
              console.error("NFTSelectorOverlay - Error accessing MetaMask for refresh:", err);
              setNftsChecked(prev => ({ ...prev, ethereum: true }));
            }
          } else {
            console.log("NFTSelectorOverlay - MetaMask not available for refresh or masked by Phantom");
            setNftsChecked(prev => ({ ...prev, ethereum: true }));
          }
        } else {
          console.log("NFTSelectorOverlay - Ethereum NFTs already checked, skipping refresh");
        }
      } 
      // Handle Phantom wallet
      else if (walletToUse === 'Phantom') {
        console.log("NFTSelectorOverlay - Using Phantom wallet");
        
        // Za Ethereum - samo en pregled
        if (isEthereumConnected && !nftsChecked.ethereum) {
          const accountToUse = (ethereumDirectConnected && ethereumDirectAccount) 
            ? ethereumDirectAccount
            : ethereumAccount || (windowEthereumAccounts && windowEthereumAccounts[0]);
            
          console.log("NFTSelectorOverlay - Refreshing Ethereum NFTs with Phantom...", {
            usingAccount: accountToUse ? `${accountToUse.slice(0, 6)}...${accountToUse.slice(-4)}` : null
          });
          
          try {
            await fetchEthereumNFTs();
            setNftsChecked(prev => ({ ...prev, ethereum: true }));
          } catch (error) {
            console.error("NFTSelectorOverlay - Error fetching Ethereum NFTs with Phantom:", error);
            setError(`Error fetching NFTs: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setNftsChecked(prev => ({ ...prev, ethereum: true }));
          }
        } else {
          console.log("NFTSelectorOverlay - Ethereum NFTs already checked or not connected with Phantom, skipping refresh");
        }
      }
      // Standard flow za druge denarnice
      else {
        // Za Ethereum - samo en pregled
        if (isEthereumConnected && !nftsChecked.ethereum) {
          const accountToUse = (ethereumDirectConnected && ethereumDirectAccount) 
            ? ethereumDirectAccount
            : ethereumAccount || (windowEthereumAccounts && windowEthereumAccounts[0]);
            
          console.log("NFTSelectorOverlay - Refreshing Ethereum NFTs with standard flow...", {
            usingAccount: accountToUse ? `${accountToUse.slice(0, 6)}...${accountToUse.slice(-4)}` : null
          });
          
          try {
            await fetchEthereumNFTs();
            setNftsChecked(prev => ({ ...prev, ethereum: true }));
          } catch (error) {
            console.error("NFTSelectorOverlay - Error fetching Ethereum NFTs:", error);
            setError(`Error fetching NFTs: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setNftsChecked(prev => ({ ...prev, ethereum: true }));
          }
        } else {
          console.log("NFTSelectorOverlay - Ethereum NFTs already checked or not connected, skipping refresh");
        }
      }
    } catch (error) {
      console.error('Error refreshing NFTs:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      
      // Tudi v primeru napake označimo kot preverjeno
      setNftsChecked(prev => ({
        ethereum: true,
        solana: true
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  // No wallets connected state
  const NoWalletsConnected = () => (
    <div className="text-center p-6 md:p-8 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--background-secondary)]">
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <WalletOutlined className="text-2xl md:text-3xl text-[var(--color-brand)] mb-3" />
          <Title level={4} className="m-0 text-base md:text-xl">Connect Your Wallet</Title>
          <Text type="secondary" className="text-xs md:text-sm">Connect a wallet to view and select your NFTs</Text>
        </div>
        
        <div className="my-3">
          <MultiWalletExample />
        </div>
        
        <Text type="secondary" className="text-xs">
          Compatible with Solana and Ethereum wallets
        </Text>
      </Space>
    </div>
  );

  // No NFTs state
  const NoNFTsState = () => (
    <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
      <ExclamationCircleOutlined className="text-2xl md:text-3xl text-[var(--text-secondary)] mb-3" />
      <Title level={4} className="m-0 text-base md:text-xl">No NFTs Found</Title>
      <Text type="secondary" className="mb-5 text-xs md:text-sm">
        We couldn't find any NFTs in your connected wallet
      </Text>
      <Button 
        icon={<ReloadOutlined />} 
        onClick={refreshNFTs}
        loading={isRefreshing}
      >
        Refresh NFTs
      </Button>
    </div>
  );

  // Get content based on current tab
  const getContent = () => {
    // Loading state
    if ((solanaLoading && activeTab !== 'ethereum') || 
        (ethereumLoading && activeTab !== 'solana') || 
        isRefreshing) {
      return (
        <div className="py-10 text-center flex flex-col items-center justify-center">
          <Spin size="large" />
          <div className="mt-3">
            <Text type="secondary">Loading your NFTs...</Text>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <Alert
          message="Error loading NFTs"
          description={error}
          type="error"
          showIcon
          className="mb-4"
          action={
            <Button 
              size="small" 
              onClick={refreshNFTs}
              disabled={isRefreshing}
            >
              Try Again
            </Button>
          }
        />
      );
    }

    // No wallets connected state
    if (activeTab === 'solana' && !isSolanaConnected) {
      return (
        <Alert
          message="Solana wallet not connected"
          description="Connect your Solana wallet to see your NFTs"
          type="info"
          showIcon
          icon={<WalletOutlined />}
          className="mb-4"
        />
      );
    }
    
    if (activeTab === 'ethereum' && !isEthereumConnected) {
      return (
        <Alert
          message="Ethereum wallet not connected"
          description="Connect your Ethereum wallet to see your NFTs"
          type="info"
          showIcon
          icon={<WalletOutlined />}
          className="mb-4"
        />
      );
    }
    
    if (activeTab === 'all' && !isSolanaConnected && !isEthereumConnected) {
      return <NoWalletsConnected />;
    }

    // Show provider information if connected
    const providerInfo = typeof window !== 'undefined' && (window as any).ethereum ? 
      ((window as any).ethereum.isMetaMask ? 'MetaMask' : 
       (window as any).ethereum.isPhantom ? 'Phantom (Ethereum)' : 
       (window as any).ethereum.isCoinbaseWallet ? 'Coinbase Wallet' : 
       'Ethereum Wallet') : null;

    // No NFTs in the selected category
    let currentNFTs: NFT[] = [];
    if (activeTab === 'solana') {
      currentNFTs = filteredNFTs.solana;
    } else if (activeTab === 'ethereum') {
      currentNFTs = filteredNFTs.ethereum;
    } else {
      currentNFTs = filteredNFTs.all;
    }
    
    if (currentNFTs.length === 0) {
      let connectedMessage = '';
      if (activeTab === 'ethereum' && isEthereumConnected) {
        connectedMessage = providerInfo ? 
          `Connected to ${providerInfo}` : 
          'Ethereum wallet connected';
      } else if (activeTab === 'solana' && isSolanaConnected) {
        connectedMessage = 'Solana wallet connected';
      }
      
      return (
        <div className="text-center py-5 flex flex-col items-center">
          {connectedMessage && (
            <Alert
              message={connectedMessage}
              type="success"
              showIcon
              className="w-fit mx-auto mb-4 max-w-full"
            />
          )}
          <NoNFTsState />
        </div>
      );
    }

    // Display NFTs
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {currentNFTs.map((nft) => (
          <NFTCard
            key={nft.id}
            nft={nft}
            selected={selectedNft?.id === nft.id}
            onClick={handleSelectNFT}
            showChain={activeTab === 'all'}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width="95%"
      centered
      title={
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="font-bold text-lg">{title}</span>
            <div className="text-sm text-[var(--text-secondary)]">
              {description}
            </div>
          </div>
          {selectedNft && (
            <Tag color="success" className="m-0">
              <CheckCircleOutlined /> NFT Selected
            </Tag>
          )}
        </div>
      }
      footer={
        <div className="flex justify-between flex-wrap gap-2">
          <Button onClick={onClose} icon={<CloseOutlined />}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<RightCircleOutlined />}
            onClick={handleSelectAndClose}
            disabled={!selectedNft}
          >
            Use Selected NFT
          </Button>
        </div>
      }
      styles={{
        content: {
          background: 'var(--background)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-color)',
          maxWidth: '800px',
          width: '100%',
          margin: '0 auto',
        },
        header: {
          background: 'var(--background)',
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 18px',
        },
        body: {
          padding: '18px',
          maxHeight: '70vh',
          overflow: 'auto',
        },
        footer: {
          background: 'var(--background)',
          borderTop: '1px solid var(--border-color)',
          padding: '16px 18px',
        },
        mask: {
          backdropFilter: 'blur(4px)',
          background: 'rgba(0, 0, 0, 0.75)',
        },
      }}
    >
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 flex-wrap gap-3">
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="middle"
            className="w-full mb-4 md:mb-0"
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
                    {isSolanaConnected ? 
                      <Tooltip title="Solana Wallet Connected">
                        <span className="text-green-500 text-base ml-1 inline-block translate-y-px">•</span>
                      </Tooltip> : 
                      <Tooltip title="Solana Wallet Not Connected">
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
                    {isEthereumConnected ? 
                      <Tooltip title="Ethereum Wallet Connected">
                        <span className="text-green-500 text-base ml-1 inline-block translate-y-px">•</span>
                      </Tooltip> : 
                      <Tooltip title="Ethereum Wallet Not Connected">
                        <ExclamationCircleOutlined className="ml-1 text-orange-500 text-xs" />
                      </Tooltip>
                    }
                  </span>
                )
              }
            ]}
          />
        
          <div className="flex gap-2 items-center w-full md:w-auto">
            <Search
              placeholder="Search NFTs..."
              className="w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={setSearchTerm}
              allowClear
              size="middle"
            />
            
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                // Skip if already refreshing
                if (isRefreshing) {
                  console.log("NFTSelectorOverlay - Already refreshing, skipping duplicate refresh from button");
                  return;
                }
                
                // Check localStorage first to determine which wallet to use
                let savedWallet: string | null = null;
                try {
                  if (typeof window !== 'undefined') {
                    savedWallet = localStorage.getItem('livestreamcoin-ethereum-wallet');
                    console.log("NFTSelectorOverlay - Refresh with wallet from localStorage:", savedWallet);
                  }
                } catch (e) {
                  console.error("NFTSelectorOverlay - Error reading localStorage on refresh:", e);
                }
                
                // Special handling for MetaMask
                if (savedWallet === 'MetaMask') {
                  // Check providers array first if available
                  if (typeof window !== 'undefined' && (window as any).ethereum?.providers?.length > 0) {
                    try {
                      console.log("NFTSelectorOverlay - Checking providers array for MetaMask on Refresh button");
                      const providers = (window as any).ethereum.providers;
                      // Find MetaMask but not Phantom's MetaMask
                      const metamaskProvider = providers.find((p: any) => p.isMetaMask && !p.isPhantom);
                      
                      if (metamaskProvider) {
                        console.log("NFTSelectorOverlay - Found MetaMask in providers array on Refresh button");
                        
                        metamaskProvider.request({ method: 'eth_accounts' })
                          .then((accounts: string[]) => {
                            if (accounts && accounts.length > 0) {
                              console.log("NFTSelectorOverlay - Found MetaMask accounts from providers array on Refresh:", accounts);
                              setWindowEthereumAccounts(accounts);
                            }
                            refreshNFTs();
                          })
                          .catch((err: any) => {
                            console.error("NFTSelectorOverlay - Error on refresh from MetaMask providers array:", err);
                            refreshNFTs();
                          });
                        
                        return;
                      }
                    } catch (err) {
                      console.error("NFTSelectorOverlay - Error accessing providers array on Refresh:", err);
                    }
                  }
                  
                  // If no providers array or MetaMask not found, try direct window.ethereum
                  if (typeof window !== 'undefined' && (window as any).ethereum?.isMetaMask && !(window as any).ethereum?.isPhantom) {
                    console.log("NFTSelectorOverlay - Checking MetaMask directly on Refresh button");
                    
                    (window as any).ethereum.request({ method: 'eth_accounts' })
                      .then((accounts: string[]) => {
                        if (accounts && accounts.length > 0) {
                          console.log("NFTSelectorOverlay - Found MetaMask accounts on Refresh:", accounts);
                          setWindowEthereumAccounts(accounts);
                        }
                        refreshNFTs();
                      })
                      .catch((err: any) => {
                        console.error("NFTSelectorOverlay - Error on refresh from MetaMask:", err);
                        refreshNFTs();
                      });
                    
                    return;
                  }
                  
                  console.log("NFTSelectorOverlay - MetaMask selected but not detected for Refresh");
                  refreshNFTs();
                  return;
                }
                
                // Detect available wallets
                const isPhantom = typeof window !== 'undefined' && !!(window as any).ethereum?.isPhantom;
                const isMetaMask = typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask;
                
                // Determine which wallet to use based on saved preference
                // If user explicitly selected Phantom, use it regardless
                const explicitPhantom = savedWallet === 'Phantom';
                // Otherwise use Phantom only if no other wallet is available
                const defaultToPhantom = !savedWallet && isPhantom && !isMetaMask;
                const usePhantom = explicitPhantom || defaultToPhantom;
                
                console.log("NFTSelectorOverlay - Refresh wallet decision:", { 
                  savedWallet, 
                  isPhantom, 
                  isMetaMask, 
                  explicitPhantom, 
                  defaultToPhantom,
                  usePhantom, 
                  ethereumDirectConnected,
                  ethereumDirectAccount
                });
                
                // Force check with the appropriate wallet if needed
                let shouldForceCheck = false;
                
                // If we have a preference for MetaMask but no account, check directly
                if ((savedWallet === 'MetaMask' || (!savedWallet && isMetaMask)) && isMetaMask && !ethereumDirectAccount) {
                  shouldForceCheck = true;
                }
                
                // If we have a preference for Phantom but no account, check directly 
                if (usePhantom && isPhantom && !hasDirectWindowEthereum) {
                  shouldForceCheck = true;
                }
                
                if (shouldForceCheck && (typeof window !== 'undefined' && (window as any).ethereum)) {
                  console.log(`NFTSelectorOverlay - Force checking ${usePhantom ? 'Phantom' : 'MetaMask'} on refresh`);
                  
                  // Prioritize MetaMask if explicitly selected
                  if (savedWallet === 'MetaMask' && isMetaMask) {
                    (window as any).ethereum.request({ method: 'eth_accounts' })
                      .then((accounts: string[]) => {
                        if (accounts && accounts.length > 0) {
                          console.log(`NFTSelectorOverlay - Refresh found accounts from MetaMask:`, accounts);
                          setWindowEthereumAccounts(accounts);
                        }
                        refreshNFTs();
                      })
                      .catch((err: any) => {
                        console.error(`NFTSelectorOverlay - Error on refresh from MetaMask:`, err);
                        refreshNFTs();
                      });
                  }
                  // Otherwise if Phantom is explicitly selected
                  else if (usePhantom && isPhantom) {
                    (window as any).ethereum.request({ method: 'eth_accounts' })
                      .then((accounts: string[]) => {
                        if (accounts && accounts.length > 0) {
                          console.log(`NFTSelectorOverlay - Refresh found accounts from Phantom:`, accounts);
                          setWindowEthereumAccounts(accounts);
                        }
                        refreshNFTs();
                      })
                      .catch((err: any) => {
                        console.error(`NFTSelectorOverlay - Error on refresh from Phantom:`, err);
                        refreshNFTs();
                      });
                  }
                  // Generic wallet check
                  else {
                    (window as any).ethereum.request({ method: 'eth_accounts' })
                      .then((accounts: string[]) => {
                        if (accounts && accounts.length > 0) {
                          console.log(`NFTSelectorOverlay - Refresh found accounts:`, accounts);
                          setWindowEthereumAccounts(accounts);
                        }
                        refreshNFTs();
                      })
                      .catch((err: any) => {
                        console.error(`NFTSelectorOverlay - Error on refresh:`, err);
                        refreshNFTs();
                      });
                  }
                } else {
                  console.log("NFTSelectorOverlay - No specific wallet detected, proceeding with refresh");
                  refreshNFTs();
                }
              }}
              loading={isRefreshing}
              disabled={!isSolanaConnected && !isEthereumConnected && !(typeof window !== 'undefined' && !!(window as any).ethereum)}
            >
              Refresh
            </Button>
          </div>
        </div>
        
        {getContent()}
      </div>
    </Modal>
  );
} 