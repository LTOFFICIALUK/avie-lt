"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, useRef } from 'react';
import { WalletOutlined, LoadingOutlined, DisconnectOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// Key for storing Solana wallet choice
const SOLANA_WALLET_STORAGE_KEY = 'livestreamcoin-solana-wallet';

// A simplified Solana wallet button that mirrors EthereumWalletButton
export default function SolanaWalletButton({ 
  className,
  onConnectToAccount 
}: { 
  className?: string;
  onConnectToAccount?: (address: string) => Promise<void>;
}) {
  const { publicKey, connected, connecting, disconnect, select, wallets } = useWallet();
  const [showError, setShowError] = useState(false);
  const [connectionTimeout, setConnectionTimeout] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoConnectAttempted = useRef(false);
  
  // Save the wallet name when connected
  useEffect(() => {
    if (connected && publicKey) {
      // Find the connected wallet's name
      const connectedWallet = wallets.find(w => 
        w.adapter.publicKey?.toString() === publicKey.toString()
      );
      
      if (connectedWallet) {
        // Save to localStorage for reconnection after refresh
        localStorage.setItem(SOLANA_WALLET_STORAGE_KEY, connectedWallet.adapter.name);
      }
    } else if (!connected) {
      // If disconnected, remove saved wallet
      localStorage.removeItem(SOLANA_WALLET_STORAGE_KEY);
    }
  }, [connected, publicKey, wallets]);
  
  // Try to reconnect on startup if saved wallet exists
  useEffect(() => {
    if (!connected && !connecting && !autoConnectAttempted.current && wallets.length > 0) {
      const savedWallet = localStorage.getItem(SOLANA_WALLET_STORAGE_KEY);
      
      if (savedWallet) {
        
        // Find the matching wallet adapter
        const walletToConnect = wallets.find(w => 
          w.adapter.name === savedWallet && 
          w.readyState === WalletReadyState.Installed
        );
        
        if (walletToConnect) {
          // Set timeout to ensure the adapter is fully initialized
          setTimeout(() => {
            try {
              select(walletToConnect.adapter.name);
            } catch (err) {
              console.error('Error selecting saved wallet:', err);
              localStorage.removeItem(SOLANA_WALLET_STORAGE_KEY);
            }
          }, 500);
        } else {
          console.warn('Saved wallet not available:', savedWallet);
          localStorage.removeItem(SOLANA_WALLET_STORAGE_KEY);
        }
      }
      
      autoConnectAttempted.current = true;
    }
  }, [wallets, connected, connecting, select]);

  // Handle connect to account button click
  const handleConnectToAccount = async () => {
    if (publicKey && onConnectToAccount) {
      await onConnectToAccount(publicKey.toString());
    }
  };
  
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Effect to handle connection timeout
  useEffect(() => {
    if (connecting && !connected) {
      // Set timeout for connection
      timeoutRef.current = setTimeout(() => {
        if (connecting && !connected) {
          setConnectionTimeout(true);
        }
      }, 8000); // 8 second timeout
    } else {
      // Clear timeout if we're no longer connecting
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Reset timeout flag if connected
      if (connected) {
        setConnectionTimeout(false);
        setDebugInfo(null);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [connecting, connected]);
  
  // Log the state of each wallet adapter
  const logWalletStates = () => {
    const states = wallets.map(wallet => ({
      name: wallet.adapter.name,
      ready: wallet.readyState,
      installed: wallet.readyState === WalletReadyState.Installed,
      loadable: wallet.readyState === WalletReadyState.Loadable,
    }));
    
    const readableStates = states.map(s => 
      `${s.name}: ${s.ready === WalletReadyState.Installed ? 'Installed' : 
        s.ready === WalletReadyState.Loadable ? 'Loadable' : 
        s.ready === WalletReadyState.NotDetected ? 'Not Detected' : 
        s.ready === WalletReadyState.Unsupported ? 'Unsupported' : 'Unknown'}`
    ).join(', ');
    
    setDebugInfo(`Wallets: ${readableStates}`);
    return states;
  };
  
  // Find available wallet
  const getFirstAvailableWallet = (): WalletName | null => {
    // We no longer want to auto-select any wallet - let the user choose from the modal
    return null;
  };
  
  // Handle connection
  const handleConnect = () => {
    setConnectionTimeout(false);
    setShowError(false);
    
    // Skip wallet auto-selection and go straight to the modal
    try {
      // Always use the wallet-adapter-button approach which is more reliable
      const walletModalButton = document.querySelector('.wallet-adapter-button-trigger') as HTMLElement;
      if (walletModalButton) {
        walletModalButton.click();
      } else {
        setShowError(true);
        setDebugInfo('Wallet button not found in DOM');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setShowError(true);
      setDebugInfo(error instanceof Error ? error.message : 'Unknown error');
    }
  };
  
  // Reset any errors and try again
  const handleRetry = () => {
    setShowError(false);
    setConnectionTimeout(false);
    setDebugInfo(null);
    
    // Disconnect first to reset state
    if (connecting) {
      try {
        disconnect();
      } catch (e) {
        console.error('Error disconnecting:', e);
      }
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center relative w-full">
      {!connected ? (
        <div className="w-full">
          <button
            onClick={handleConnect}
            disabled={connecting && !connectionTimeout && !showError}
            className={className || 'flex justify-center items-center h-9 px-4 w-full bg-[var(--color-gray)] hover:bg-[#222224] transition-colors text-white rounded-md text-sm font-medium border border-[rgba(255,255,255,0.1)]'}
          >
            {connecting && !connectionTimeout && !showError ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingOutlined spin style={{ fontSize: '16px' }} />
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <WalletOutlined style={{ fontSize: '16px', color: 'var(--color-brand)' }} />
                <span>{showError ? 'Try Again' : 'Connect Solana Wallet'}</span>
              </div>
            )}
          </button>
          
          {(showError || connectionTimeout) && (
            <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <ExclamationCircleOutlined style={{ fontSize: '12px' }} />
              <span>{connectionTimeout ? 'Connection timed out.' : 'Failed to connect wallet.'} </span>
              <button 
                onClick={handleRetry}
                className="text-[var(--color-brand)] hover:underline"
              >
                Reset
              </button>
            </div>
          )}
          
          {debugInfo && (
            <div className="mt-1 text-xs text-gray-400 break-words">
              {debugInfo}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full">
          <div className="p-2 w-full bg-[#0a0f0f] rounded-md border border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white flex items-center gap-1">
                <WalletOutlined style={{ fontSize: '14px', color: 'var(--color-brand)' }} />
                {publicKey ? formatAddress(publicKey.toString()) : ''}
              </span>
              <button
                onClick={() => disconnect()}
                className="text-xs flex items-center gap-1 text-[var(--color-brand)] hover:text-[var(--color-brand-darker)] transition-colors"
              >
                <DisconnectOutlined style={{ fontSize: '12px' }} />
                Disconnect
              </button>
            </div>
          </div>
          
          {/* Add connect to account button if onConnectToAccount is provided */}
          {onConnectToAccount && publicKey && (
            <button 
              onClick={handleConnectToAccount}
              className="mt-2 w-full flex justify-center items-center h-8 px-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-md text-xs font-medium"
            >
              Connect this wallet to your account
            </button>
          )}
        </div>
      )}
      
      <div className="absolute opacity-0 pointer-events-none">
        <WalletMultiButton />
      </div>
    </div>
  );
} 