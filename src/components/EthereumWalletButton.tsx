"use client";

import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import { LoadingOutlined, WalletOutlined, DisconnectOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// Define more specific types for ethereum functionality
type EthereumRequestMethod = 'eth_accounts' | 'eth_requestAccounts' | string;

// More specific type for the handler function
type AccountsChangedHandler = (accounts: string[]) => void;

// Simplified type for window.ethereum
type EthereumProvider = {
  request: (args: { method: EthereumRequestMethod; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, handler: AccountsChangedHandler) => void;
  removeListener: (eventName: string, handler: AccountsChangedHandler) => void;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isWalletConnect?: boolean;
  isExodus?: boolean;
  isTrust?: boolean;
  isOperaWallet?: boolean;
  isBraveWallet?: boolean;
  isTokenPocket?: boolean;
  isImToken?: boolean;
  isStatus?: boolean;
  provider?: EthereumProvider;
  isPhantom?: boolean;
  _events?: any;
  _state?: any;
};

// Wallet info type
type WalletInfo = {
  name: string;
  icon: string;
  description: string;
  installed: boolean;
  provider?: EthereumProvider;
};

// Create a context for Ethereum wallet state
type EthereumWalletContextType = {
  account: string | null;
  connected: boolean;
  connecting: boolean;
  walletName: string | null;
  availableWallets: WalletInfo[];
  disconnect: () => void;
  connect: (provider?: EthereumProvider) => Promise<string | null>;
  showWalletModal: () => void;
};

const EthereumWalletContext = createContext<EthereumWalletContextType>({
  account: null,
  connected: false,
  connecting: false,
  walletName: null,
  availableWallets: [],
  disconnect: () => {},
  connect: async () => null,
  showWalletModal: () => {},
});

// Key for storing Ethereum wallet choice
const ETH_WALLET_STORAGE_KEY = 'livestreamcoin-ethereum-wallet';

// Hook to use the Ethereum wallet context
export const useEthereumWallet = () => useContext(EthereumWalletContext);

// Provider component for Ethereum wallet
export function EthereumWalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Clear Phantom-specific items that might interfere with Ethereum
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Keys that might be used by Phantom for Ethereum
    const phantomKeys = [
      'phantom-ethereum',
      'phantom.ethereum.selectedAccount',
      'phantom.ethereum'
    ];
    
    // Check and clear these keys
    phantomKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`Clearing Phantom Ethereum key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Also ensure our storage key uses the consistent name
    const oldKey = localStorage.getItem(ETH_WALLET_STORAGE_KEY);
    const newKey = localStorage.getItem('livestreamcoin-ethereum-wallet');
    
    if (oldKey && !newKey) {
      localStorage.setItem('livestreamcoin-ethereum-wallet', oldKey);
    } else if (newKey && !oldKey) {
      localStorage.setItem(ETH_WALLET_STORAGE_KEY, newKey);
    }
  }, []);

  // Save wallet choice to localStorage
  const saveWalletChoice = useCallback((name: string | null) => {
    if (typeof window !== 'undefined') {
      if (name) {
        console.log(`Saving Ethereum wallet choice: ${name}`);
        localStorage.setItem('livestreamcoin-ethereum-wallet', name);
      } else {
        console.log('Clearing Ethereum wallet choice');
        localStorage.removeItem('livestreamcoin-ethereum-wallet');
      }
    }
  }, []);

  // Detect available wallets
  const detectWallets = (): WalletInfo[] => {
    const wallets: WalletInfo[] = [];
    
    if (typeof window === 'undefined') return wallets;
    
    const ethereum = (window as any).ethereum;
    
    // Check for injected providers
    if (ethereum) {
      // Check for multiple providers in the providers array
      const providers: EthereumProvider[] = ethereum.providers || [ethereum];
      const isPhantomInstalled = typeof window !== 'undefined' && 
                                 (window as any).phantom !== undefined;
      
      // If phantom is installed, log it
      if (isPhantomInstalled) {
        console.log('Phantom wallet detected - will prioritize MetaMask for ETH');
      }
      
      for (const provider of providers) {
        // Skip if this is Phantom's Ethereum provider
        const isPhantomProvider = provider.isPhantom || 
                                 (provider._events && 
                                  provider._state && 
                                  typeof provider._state === 'object' && 
                                  provider._state.hasOwnProperty('phantomNetworks'));
        
        if (isPhantomProvider) {
          console.log('Skipping Phantom\'s Ethereum provider to avoid conflicts');
          continue;
        }
        
        if (provider.isMetaMask) {
          wallets.push({
            name: 'MetaMask',
            icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
            description: 'Connect to your MetaMask Wallet',
            installed: true,
            provider
          });
        } else if (provider.isCoinbaseWallet) {
          wallets.push({
            name: 'Coinbase Wallet',
            icon: 'https://static.opencrypto.io/icons/wallets/coinbase/icon.svg',
            description: 'Connect to your Coinbase Wallet',
            installed: true,
            provider
          });
        } else if (provider.isWalletConnect) {
          wallets.push({
            name: 'WalletConnect',
            icon: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg',
            description: 'Connect with WalletConnect',
            installed: true,
            provider
          });
        } else if (provider.isExodus) {
          wallets.push({
            name: 'Exodus',
            icon: 'https://www.exodus.com/img/logos/exodus-logo-wordmark-black.svg',
            description: 'Connect to your Exodus Wallet',
            installed: true,
            provider
          });
        } else if (provider.isTrust) {
          wallets.push({
            name: 'Trust Wallet',
            icon: 'https://trustwallet.com/assets/images/favicon.png',
            description: 'Connect to your Trust Wallet',
            installed: true,
            provider
          });
        } else if (provider.isBraveWallet) {
          wallets.push({
            name: 'Brave Wallet',
            icon: 'https://brave.com/static-assets/images/brave-logo-full-color.svg',
            description: 'Connect to Brave Browser Wallet',
            installed: true,
            provider
          });
        } else if (!wallets.some(w => w.name === 'MetaMask') && !provider.isMetaMask && !provider.isCoinbaseWallet && !provider.isWalletConnect) {
          // Generic fallback for unknown provider
          wallets.push({
            name: 'Browser Wallet',
            icon: 'https://img.icons8.com/ios/50/000000/wallet--v1.png',
            description: 'Connect to your browser wallet',
            installed: true,
            provider
          });
        }
      }
      
      // If we only got the fallthrough provider, check if it's one of the known ones
      if (wallets.length === 0 && ethereum) {
        if (ethereum.isMetaMask) {
          wallets.push({
            name: 'MetaMask',
            icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
            description: 'Connect to your MetaMask Wallet',
            installed: true,
            provider: ethereum
          });
        } else if (ethereum.isCoinbaseWallet) {
          wallets.push({
            name: 'Coinbase Wallet',
            icon: 'https://static.opencrypto.io/icons/wallets/coinbase/icon.svg',
            description: 'Connect to your Coinbase Wallet',
            installed: true,
            provider: ethereum
          });
        } else {
          wallets.push({
            name: 'Browser Wallet',
            icon: 'https://img.icons8.com/ios/50/000000/wallet--v1.png',
            description: 'Connect to your browser wallet',
            installed: true,
            provider: ethereum
          });
        }
      }
    }
    
    // Add WalletConnect option if not already added (requires additional setup)
    if (!wallets.some(w => w.name === 'WalletConnect')) {
      wallets.push({
        name: 'WalletConnect',
        icon: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg',
        description: 'Scan with WalletConnect to connect',
        installed: false
      });
    }
    
    // Always add MetaMask as an option if not installed
    if (!wallets.some(w => w.name === 'MetaMask')) {
      wallets.push({
        name: 'MetaMask',
        icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
        description: 'Install MetaMask browser extension',
        installed: false
      });
    }
    
    return wallets;
  };

  // Get correct Ethereum provider
  const getEthereumProvider = (): EthereumProvider | undefined => {
    if (typeof window === 'undefined') return undefined;
    
    // First check if we have a saved wallet preference
    let savedWallet: string | null = null;
    try {
      savedWallet = localStorage.getItem(ETH_WALLET_STORAGE_KEY);
      console.log('getEthereumProvider - Saved wallet preference:', savedWallet);
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    
    // HACK: Get the metamask provider directly from providers array if it exists
    // This is needed when Phantom is installed, as Phantom overrides window.ethereum
    if (savedWallet === 'MetaMask' && (window as any).ethereum?.providers?.length > 0) {
      console.log('Looking for MetaMask in providers array because it was explicitly selected');
      const providers = (window as any).ethereum.providers as EthereumProvider[];
      const metamaskProvider = providers.find(p => p.isMetaMask && !p.isPhantom);
      
      if (metamaskProvider) {
        console.log('Found explicit MetaMask provider in providers array');
        return metamaskProvider;
      }
    }
    
    // HACK: Get Phantom directly if selected, needed for compatibility
    if (savedWallet === 'Phantom' && (window as any).ethereum?.isPhantom) {
      console.log('Using Phantom directly because it was explicitly selected');
      return (window as any).ethereum;
    }
    
    const ethereum = (window as { ethereum?: EthereumProvider }).ethereum;
    if (!ethereum) return undefined;
    
    // If ethereum.providers exists, we have multiple providers
    if ((ethereum as any).providers) {
      const providers = (ethereum as any).providers as EthereumProvider[];
      
      // First try to find provider matching saved wallet if it exists
      if (savedWallet) {
        // Look for matching provider based on saved wallet name
        if (savedWallet === 'MetaMask') {
          const metamask = providers.find(p => p.isMetaMask && !p.isPhantom);
          if (metamask) {
            console.log('Found saved MetaMask provider');
            return metamask;
          }
        } else if (savedWallet === 'Coinbase Wallet') {
          const coinbase = providers.find(p => p.isCoinbaseWallet);
          if (coinbase) {
            console.log('Found saved Coinbase Wallet provider');
            return coinbase;
          }
        } else if (savedWallet === 'Phantom') {
          const phantom = providers.find(p => p.isPhantom);
          if (phantom) {
            console.log('Found saved Phantom provider');
            return phantom;
          }
        }
        
        console.warn(`Could not find saved wallet: ${savedWallet} in providers`);
      }
      
      // If no saved wallet or saved wallet not found, follow default priority
      
      // First try to find MetaMask (but not Phantom's MetaMask)
      const metamask = providers.find(p => p.isMetaMask && !p.isPhantom);
      if (metamask) return metamask;
      
      // Then try Coinbase Wallet
      const coinbase = providers.find(p => p.isCoinbaseWallet);
      if (coinbase) return coinbase;
      
      // Then try other non-Phantom wallets
      const nonPhantom = providers.find(p => {
        // Check if it's Phantom's provider
        const isPhantomProvider = p.isPhantom || 
                           (p._events && 
                            p._state && 
                            typeof p._state === 'object' && 
                            p._state.hasOwnProperty('phantomNetworks'));
        
        return !isPhantomProvider;
      });
      
      if (nonPhantom) return nonPhantom;
    }
    
    // If we're here, we don't have providers array or couldn't find a match
    
    // If user explicitly selected Phantom, use it
    if (savedWallet === 'Phantom' && ethereum.isPhantom) {
      console.log('User explicitly selected Phantom, using it');
      return ethereum;
    }
    
    // Otherwise, check if it's Phantom and only use if explicitly requested
    const isPhantomProvider = ethereum.isPhantom || 
                            (ethereum._events && 
                             ethereum._state && 
                             typeof ethereum._state === 'object' && 
                             ethereum._state.hasOwnProperty('phantomNetworks'));
                             
    if (isPhantomProvider && savedWallet !== 'Phantom') {
      console.log('Avoiding Phantom\'s Ethereum provider as it was not explicitly selected');
      return undefined;
    }
    
    // Use the main window.ethereum 
    return ethereum;
  };

  // Detect wallets on mount
  useEffect(() => {
    const wallets = detectWallets();
    setAvailableWallets(wallets);
    console.log('Available Ethereum wallets:', wallets);
    
    // Try to auto-connect with saved wallet selection - this runs on page refresh
    const attemptReconnection = async () => {
      if (typeof window !== 'undefined') {
        const savedWallet = localStorage.getItem('livestreamcoin-ethereum-wallet');
        if (savedWallet) {
          console.log('Found saved Ethereum wallet:', savedWallet);
          
          // Only skip Phantom if it wasn't explicitly selected
          const explicitlySelectedPhantom = savedWallet.toLowerCase() === 'phantom';
          if (!explicitlySelectedPhantom && savedWallet.toLowerCase().includes('phantom')) {
            console.log('Skipping reconnection to Phantom wallet for Ethereum (not explicitly selected)');
            localStorage.removeItem('livestreamcoin-ethereum-wallet');
            return;
          }
          
          // Find the matching wallet
          const wallet = wallets.find(w => w.name === savedWallet && w.installed);
          if (wallet && wallet.provider) {
            console.log('Attempting to reconnect to saved wallet:', savedWallet);
            try {
              // Only check for Phantom if it wasn't explicitly selected
              if (!explicitlySelectedPhantom) {
                const isPhantomProvider = wallet.provider.isPhantom || 
                                        (wallet.provider._events && 
                                         wallet.provider._state && 
                                         typeof wallet.provider._state === 'object' && 
                                         wallet.provider._state.hasOwnProperty('phantomNetworks'));
                
                if (isPhantomProvider) {
                  console.log('Skipping reconnection to Phantom provider (not explicitly selected)');
                  localStorage.removeItem('livestreamcoin-ethereum-wallet');
                  return;
                }
              }
              
              await connect(wallet.provider);
              console.log('Successfully reconnected to saved wallet');
            } catch (err) {
              console.error('Failed to auto-connect to saved wallet:', err);
            }
          } else {
            console.warn('Saved wallet not found or not installed:', savedWallet);
          }
        }
      }
    };
    
    // Add a slight delay to ensure provider is ready
    setTimeout(attemptReconnection, 500);
  }, []);

  // Check connection on mount and listen for changes
  useEffect(() => {
    const provider = getEthereumProvider();
    if (!provider) return;
    
    const checkConnection = async () => {
      try {
        // Check if already connected
        console.log("Ethereum checking connection with provider:", provider ? 
          { 
            isMetaMask: provider.isMetaMask, 
            isCoinbase: provider.isCoinbaseWallet,
            isPhantom: provider.isPhantom
          } : 'No provider');
          
        const accounts = await provider.request({ 
          method: 'eth_accounts' 
        }) as string[];
        
        console.log("Ethereum eth_accounts returned:", accounts);
        
        if (accounts && accounts.length > 0) {
          console.log("Ethereum setting account:", accounts[0]);
          setAccount(accounts[0]);
          
          // Try to determine wallet name from provider
          if (provider.isMetaMask) {
            setWalletName('MetaMask');
            saveWalletChoice('MetaMask');
          } else if (provider.isCoinbaseWallet) {
            setWalletName('Coinbase Wallet');
            saveWalletChoice('Coinbase Wallet');
          } else if (provider.isExodus) {
            setWalletName('Exodus');
            saveWalletChoice('Exodus');
          } else if (provider.isTrust) {
            setWalletName('Trust Wallet');
            saveWalletChoice('Trust Wallet');
          } else {
            setWalletName('Ethereum Wallet');
            saveWalletChoice('Ethereum Wallet');
          }
        } else {
          console.log("Ethereum no accounts returned from eth_accounts");
        }
      } catch (error) {
        console.error('Error checking Ethereum connection:', error);
      }
    };
    
    checkConnection();
    
    // Listen for account changes
    const handleAccountsChanged: AccountsChangedHandler = (accounts) => {
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
        setWalletName(null);
        saveWalletChoice(null);
      }
    };
    
    provider.on('accountsChanged', handleAccountsChanged);
    
    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [saveWalletChoice]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Connect wallet function
  const connect = async (selectedProvider?: EthereumProvider) => {
    const provider = selectedProvider || getEthereumProvider();
    
    if (!provider) {
      console.error('No Ethereum provider available');
      
      // Try direct window.ethereum access as fallback
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        console.log('Attempting direct window.ethereum access as fallback');
        try {
          const ethereum = (window as any).ethereum;
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
          
          console.log('Direct connection succeeded, accounts:', accounts);
          if (accounts && accounts.length > 0) {
            const account = accounts[0];
            setAccount(account);
            
            // Try to determine wallet type
            let name = 'Ethereum Wallet';
            if (ethereum.isMetaMask) name = 'MetaMask';
            else if (ethereum.isCoinbaseWallet) name = 'Coinbase Wallet';
            
            setWalletName(name);
            saveWalletChoice(name);
            return account;
          }
        } catch (err) {
          console.error('Direct connection attempt failed:', err);
        }
      }
      
      alert('Please install an Ethereum wallet like MetaMask');
      return null;
    }
    
    try {
      setConnecting(true);
      console.log('Requesting Ethereum accounts from provider:', { 
        isMetaMask: provider.isMetaMask,
        isCoinbase: provider.isCoinbaseWallet,
        isPhantom: provider.isPhantom
      });
      
      const accounts = await provider.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      console.log('Received accounts from provider:', accounts);
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        
        // Determine wallet name
        let detectedWalletName = 'Ethereum Wallet';
        
        if (provider.isMetaMask) {
          detectedWalletName = 'MetaMask';
        } else if (provider.isCoinbaseWallet) {
          detectedWalletName = 'Coinbase Wallet';
        } else if (provider.isExodus) {
          detectedWalletName = 'Exodus';
        } else if (provider.isTrust) {
          detectedWalletName = 'Trust Wallet';
        } else if (provider.isPhantom) {
          detectedWalletName = 'Phantom';
        }
        
        console.log('Setting wallet name:', detectedWalletName);
        setWalletName(detectedWalletName);
        saveWalletChoice(detectedWalletName);
        
        // Close modal after successful connection
        setIsModalOpen(false);
        
        return accounts[0]; // Return the connected account
      } else {
        console.warn('No accounts returned from wallet');
        
        // Try again with direct ethereum access as last resort
        if (typeof window !== 'undefined' && (window as any).ethereum && provider !== (window as any).ethereum) {
          console.log('Trying direct ethereum access after provider failed');
          try {
            const directAccounts = await (window as any).ethereum.request({ 
              method: 'eth_requestAccounts' 
            }) as string[];
            
            if (directAccounts && directAccounts.length > 0) {
              setAccount(directAccounts[0]);
              setWalletName('Ethereum Wallet');
              saveWalletChoice('Ethereum Wallet');
              return directAccounts[0];
            }
          } catch (directErr) {
            console.error('Direct access fallback also failed:', directErr);
          }
        }
        
        return null;
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      
      // Try direct method as last resort
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          console.log('Trying direct connect after error');
          const accounts = await (window as any).ethereum.request({ 
            method: 'eth_requestAccounts' 
          }) as string[];
          
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setWalletName('Ethereum Wallet');
            saveWalletChoice('Ethereum Wallet');
            return accounts[0];
          }
        } catch (e) {
          console.error('Final connection attempt failed:', e);
        }
      }
      
      return null;
    } finally {
      setConnecting(false);
    }
  };

  // Handle disconnection
  const disconnect = () => {
    setAccount(null);
    setWalletName(null);
    saveWalletChoice(null);
  };

  // Show wallet selection modal
  const showWalletModal = () => {
    setIsModalOpen(true);
  };

  const value = {
    account,
    connected: !!account,
    connecting,
    walletName,
    availableWallets,
    disconnect,
    connect,
    showWalletModal
  };

  return (
    <EthereumWalletContext.Provider value={value}>
      {children}
      
      {/* Wallet Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            ref={modalRef}
            className="w-[350px] bg-[#070C0C] rounded-lg border border-[#18181b] shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b border-[#18181b]">
              <h3 className="text-md font-semibold text-white">Connect Ethereum Wallet</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Choose your preferred Ethereum wallet
              </p>
            </div>
            
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {availableWallets.map((wallet, index) => (
                  <button
                    key={index}
                    onClick={() => wallet.installed ? connect(wallet.provider) : window.open(
                      wallet.name === 'MetaMask' 
                        ? 'https://metamask.io/download.html' 
                        : wallet.name === 'WalletConnect'
                        ? 'https://walletconnect.com/wallets'
                        : '#'
                    )}
                    className="w-full p-3 flex items-center justify-between rounded-lg border border-[#18181b] bg-[#0a0f0f] hover:bg-[#101616] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={wallet.icon} alt={wallet.name} className="w-8 h-8 rounded-full" />
                      <div className="text-left">
                        <div className="text-sm font-medium text-white">{wallet.name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {wallet.installed ? wallet.description : `Install ${wallet.name}`}
                        </div>
                      </div>
                    </div>
                    {!wallet.installed && (
                      <span className="text-xs text-[var(--color-brand)]">
                        <ExclamationCircleOutlined /> Install
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-3 bg-[#0a0f0f] border-t border-[#18181b] flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-white bg-[#18181b] hover:bg-[#222224] rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </EthereumWalletContext.Provider>
  );
}

// A simplified Ethereum wallet button
export default function EthereumWalletButton({ 
  className,
  onConnectToAccount,
}: { 
  className?: string;
  onConnectToAccount?: (address: string) => Promise<void>;
}) {
  const { 
    account, 
    connected, 
    connecting, 
    showWalletModal, 
    disconnect 
  } = useEthereumWallet();
  
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle connect to account button click
  const handleConnectToAccount = async () => {
    if (account && onConnectToAccount) {
      await onConnectToAccount(account);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center relative w-full">
      {!connected ? (
        <div className="w-full">
          <button
            onClick={showWalletModal}
            disabled={connecting}
            className={className || 'flex justify-center items-center h-9 px-4 w-full bg-[var(--color-gray)] hover:bg-[#222224] transition-colors text-white rounded-md text-sm font-medium border border-[rgba(255,255,255,0.1)]'}
          >
            {connecting ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingOutlined spin style={{ fontSize: '16px' }} />
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <WalletOutlined style={{ fontSize: '16px', color: 'var(--color-brand)' }} />
                <span>Connect Ethereum Wallet</span>
              </div>
            )}
          </button>
        </div>
      ) : (
        <div className="w-full">
          <div className="p-2 w-full bg-[#0a0f0f] rounded-md border border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white flex items-center gap-1">
                <WalletOutlined style={{ fontSize: '14px', color: 'var(--color-brand)' }} />
                {account ? formatAddress(account) : ''}
              </span>
              <button
                onClick={disconnect}
                className="text-xs flex items-center gap-1 text-[var(--color-brand)] hover:text-[var(--color-brand-darker)] transition-colors"
              >
                <DisconnectOutlined style={{ fontSize: '12px' }} />
                Disconnect
              </button>
            </div>
          </div>
          
          {/* Add connect to account button if onConnectToAccount is provided */}
          {onConnectToAccount && account && (
            <button 
              onClick={handleConnectToAccount}
              className="mt-2 w-full flex justify-center items-center h-8 px-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-md text-xs font-medium"
            >
              Connect this wallet to your account
            </button>
          )}
        </div>
      )}
    </div>
  );
} 