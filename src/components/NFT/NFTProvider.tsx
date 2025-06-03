"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEthereumWallet } from '../EthereumWalletButton';
import { NFT, NFTProviderState, NFTResponse } from '@/types/nft';
import { api } from '@/lib/api';

// Define context type
interface NFTContextType extends NFTProviderState {
  fetchSolanaNFTs: () => Promise<void>;
  fetchEthereumNFTs: () => Promise<void>;
  selectNFT: (nft: NFT | null) => void;
  clearSelection: () => void;
  refreshNFTs: () => Promise<void>;
  ethereumConnected: boolean;
}

// Create the context
const NFTContext = createContext<NFTContextType | undefined>(undefined);

// Provider component
export const NFTProvider = ({ children }: { children: ReactNode }) => {
  // Default state
  const [state, setState] = useState<NFTProviderState>({
    solanaWallet: null,
    ethereumWallet: null,
    solanaLoading: false,
    ethereumLoading: false,
    solanaNFTs: [],
    ethereumNFTs: [],
    selectedNFT: null,
    error: null,
  });

  // Števci poskusov za preprečevanje preveč zahtev
  const [fetchAttempts, setFetchAttempts] = useState({
    ethereum: 0,
    solana: 0
  });
  
  // Zadnji čas osvežitve
  const [lastRefreshTime, setLastRefreshTime] = useState({
    ethereum: 0,
    solana: 0
  });

  // Get wallet connections
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const { account: ethereumAccount, connected: ethereumConnected } = useEthereumWallet();
  
  // Debug log for Solana wallet state
  useEffect(() => {
    console.log("NFTProvider - Solana wallet state:", {
      connected: solanaConnected,
      publicKey: solanaPublicKey?.toString() || null,
      publicKeyType: solanaPublicKey ? typeof solanaPublicKey : 'null'
    });
    
    // If connected but no publicKey, try to use connection state
    if (solanaConnected && !solanaPublicKey) {
      console.log("NFTProvider - Solana connected but no publicKey - marking as connected anyway");
      setState(prev => ({
        ...prev,
        solanaWallet: "connected-no-key"
      }));
    } else if (!solanaConnected && state.solanaWallet) {
      console.log("NFTProvider - Solana disconnected - clearing solanaWallet");
      setState(prev => ({
        ...prev,
        solanaWallet: null
      }));
    }
  }, [solanaConnected, solanaPublicKey]);

  // Force-check Ethereum wallet connection on mount and when account changes
  useEffect(() => {
    // This effect specifically handles Ethereum wallet detection
    if (ethereumConnected) {
      console.log("NFTProvider - Ethereum connected:", 
        ethereumAccount ? `${ethereumAccount.slice(0, 6)}...${ethereumAccount.slice(-4)}` : 'No address available');
      
      if (ethereumAccount) {
        // Always update wallet state if we have a valid account
        setState(prev => ({
          ...prev,
          ethereumWallet: ethereumAccount,
        }));
        
        // Also try to fetch NFTs if we have an account and don't have NFTs yet
        if (!state.ethereumNFTs || state.ethereumNFTs.length === 0) {
          console.log("NFTProvider - Auto-fetching Ethereum NFTs after connection detected");
          fetchEthereumNFTs();
        }
      }
    }
  }, [ethereumConnected, ethereumAccount]);

  // Update wallet addresses when they change
  useEffect(() => {
    const solana = solanaPublicKey?.toString() || null;
    const ethereum = ethereumAccount || null;
    
    // Debug: Check for saved wallet preference
    let savedWallet: string | null = null;
    try {
      if (typeof window !== 'undefined') {
        savedWallet = localStorage.getItem('livestreamcoin-ethereum-wallet');
        console.log("NFTProvider - Saved Ethereum wallet preference:", savedWallet);
      }
    } catch (e) {
      console.error("NFTProvider - Error reading localStorage:", e);
    }
    
    // Check if we already have an account from EthereumWalletButton
    if (ethereum) {
      console.log(`NFTProvider - Using account from EthereumWalletButton: ${ethereum.slice(0, 6)}...${ethereum.slice(-4)}`);
      setState(prev => ({
        ...prev,
        ethereumWallet: ethereum,
      }));
      return;
    }
    
    // Debug: Directly check window.ethereum in development (this helps with debugging)
    let directEthereumAccounts: string[] | null = null;
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      try {
        // Check if MetaMask is explicitly selected
        const isMetaMaskSelected = savedWallet === 'MetaMask';
        
        // COMPLETELY IGNORE PHANTOM if MetaMask is selected
        if (isMetaMaskSelected) {
          // Special check for providers array (needed when both MetaMask and Phantom are installed)
          const hasProvidersArray = !!(window as any).ethereum?.providers?.length;
          if (hasProvidersArray) {
            console.log("NFTProvider - Checking providers array for MetaMask");
            const providers = (window as any).ethereum.providers;
            // Find MetaMask but not Phantom's MetaMask
            const metamaskProvider = providers.find((p: any) => p.isMetaMask && !p.isPhantom);
            
            if (metamaskProvider) {
              console.log("NFTProvider - Found direct MetaMask provider in array");
              
              // Try to get accounts directly from MetaMask
              metamaskProvider.request({ 
                method: 'eth_accounts' 
              }).then((accounts: string[]) => {
                if (accounts && accounts.length > 0) {
                  directEthereumAccounts = accounts;
                  console.log("NFTProvider - Direct MetaMask accounts from provider array:", accounts);
                  
                  // Always update state with MetaMask account
                  setState(prev => ({
                    ...prev,
                    ethereumWallet: accounts[0],
                  }));
                } else {
                  console.log("NFTProvider - No accounts from MetaMask provider array");
                }
              }).catch((err: any) => {
                console.error("NFTProvider - Error accessing MetaMask from provider array:", err);
              });
              
              // Return early since we've handled this case
              return;
            }
          }
          
          // If no providers array or MetaMask not found in it, try window.ethereum
          if ((window as any).ethereum?.isMetaMask && !(window as any).ethereum?.isPhantom) {
            console.log("NFTProvider - Direct check of window.ethereum (MetaMask selected and found)");
            
            // Try to get accounts directly from MetaMask
            (window as any).ethereum.request({ 
              method: 'eth_accounts' 
            }).then((accounts: string[]) => {
              if (accounts && accounts.length > 0) {
                directEthereumAccounts = accounts;
                console.log("NFTProvider - Direct MetaMask accounts:", accounts);
                
                // Always update state with MetaMask account
                setState(prev => ({
                  ...prev,
                  ethereumWallet: accounts[0],
                }));
              } else {
                console.log("NFTProvider - No accounts from MetaMask");
              }
            }).catch((err: any) => {
              console.error("NFTProvider - Error accessing MetaMask:", err);
            });
          } else {
            console.log("NFTProvider - MetaMask selected but not found in window.ethereum");
          }
        } 
        // For Phantom or when no specific wallet is selected
        else if ((window as any).ethereum) {
          console.log("NFTProvider - Direct check of window.ethereum - is available:", !!(window as any).ethereum);
          
          // Check if this is Phantom
          const isPhantom = (window as any).ethereum?.isPhantom;
          
          // Only use Phantom if explicitly selected or no preference
          if ((savedWallet === 'Phantom' || !savedWallet) && isPhantom) {
            // Try to get accounts directly
            (window as any).ethereum.request({ 
              method: 'eth_accounts' 
            }).then((accounts: string[]) => {
              if (accounts && accounts.length > 0) {
                directEthereumAccounts = accounts;
                console.log("NFTProvider - Direct Phantom accounts:", accounts);
                
                // If we have accounts but ethereumAccount is null, update state
                if (accounts.length > 0 && !ethereum) {
                  setState(prev => ({
                    ...prev,
                    ethereumWallet: accounts[0],
                  }));
                }
              }
            }).catch((err: any) => {
              console.error("NFTProvider - Error accessing Phantom:", err);
            });
          } else if (isPhantom && savedWallet && savedWallet !== 'Phantom') {
            console.log(`NFTProvider - Not using Phantom because ${savedWallet} is selected`);
          }
        }
      } catch (err) {
        console.error("NFTProvider - Error checking window.ethereum:", err);
      }
    }
    
    console.log("NFTProvider - Wallet connections:", { 
      solana: solana ? `${solana.slice(0, 6)}...${solana.slice(-4)}` : null,
      ethereum: ethereum ? `${ethereum.slice(0, 6)}...${ethereum.slice(-4)}` : null,
      ethereumConnected: ethereumConnected,
      directWindowEthereum: !!(window as any)?.ethereum,
      savedWallet
    });
    
    setState(prev => ({
      ...prev,
      solanaWallet: solana,
      ethereumWallet: ethereum,
    }));
  }, [solanaPublicKey, ethereumAccount, ethereumConnected]);

  // Fetch NFTs when wallets connect
  useEffect(() => {
    console.log("NFTProvider - Checking for NFTs to fetch", {
      solanaWallet: state.solanaWallet,
      ethereumWallet: state.ethereumWallet,
      solanaNFTs: state.solanaNFTs?.length || 0,
      ethereumNFTs: state.ethereumNFTs?.length || 0
    });

    if (state.solanaWallet && (!state.solanaNFTs || state.solanaNFTs.length === 0)) {
      console.log("NFTProvider - Fetching Solana NFTs");
      fetchSolanaNFTs();
    }
    
    if (state.ethereumWallet && (!state.ethereumNFTs || state.ethereumNFTs.length === 0)) {
      console.log("NFTProvider - Fetching Ethereum NFTs");
      fetchEthereumNFTs();
    }
  }, [state.solanaWallet, state.ethereumWallet]);

  // Fetch Solana NFTs
  const fetchSolanaNFTs = async () => {
    if (!state.solanaWallet) return;
    
    try {
      setState(prev => ({ ...prev, solanaLoading: true, error: null }));
      
      const response = await api.get<NFTResponse>(
        `https://backend.avie.live/api/nfts/solana/${state.solanaWallet}`
      );
      
      // Log the full response for debugging
      console.log(`NFTProvider - Solana API response:`, {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        hasNfts: !!(response.data && response.data.nfts),
        nftCount: response.data && response.data.nfts ? response.data.nfts.length : 0
      });
      
      // Handle 304 Not Modified responses - this means the data hasn't changed
      if (response.status === 304) {
        console.log(`NFTProvider - 304 Not Modified response for Solana, keeping existing NFTs`);
        setState(prev => ({
          ...prev,
          solanaLoading: false
        }));
        return;
      }
      
      // Ensure we have a valid nfts array in the response
      if (!response.data || !response.data.nfts) {
        console.error('Error fetching Solana NFTs: Response missing NFT data', response);
        setState(prev => ({
          ...prev,
          error: 'The server returned an invalid response without NFT data',
          solanaLoading: false,
        }));
        return;
      }
      
      console.log(`NFTProvider - Solana NFTs fetched successfully:`, response.data.nfts.length);
      
      // Only update NFTs if we actually received some or if we have none currently
      if (response.data.nfts.length > 0 || !state.solanaNFTs || state.solanaNFTs.length === 0) {
        setState(prev => ({
          ...prev,
          solanaNFTs: response.data.nfts,
          solanaLoading: false,
        }));
      } else {
        console.log(`NFTProvider - No NFTs returned for Solana, keeping existing NFTs`);
        setState(prev => ({
          ...prev,
          solanaLoading: false
        }));
      }
    } catch (error) {
      console.error('Error fetching Solana NFTs:', error);
      // More detailed error reporting
      const errorMessage = error instanceof Error 
        ? `Failed to fetch Solana NFTs: ${error.message}` 
        : 'Failed to fetch Solana NFTs';
        
      setState(prev => ({
        ...prev,
        error: errorMessage,
        solanaLoading: false,
      }));
    }
  };

  // Fetch Ethereum NFTs
  const fetchEthereumNFTs = async () => {
    // Get saved wallet preference from localStorage
    let savedWallet = null;
    try {
      if (typeof window !== 'undefined') {
        savedWallet = localStorage.getItem('livestreamcoin-ethereum-wallet');
        console.log("NFTProvider - fetchEthereumNFTs - Saved wallet preference:", savedWallet);
      }
    } catch (e) {
      console.error("NFTProvider - Error reading localStorage:", e);
    }
    
    let walletToUse = null;
    
    // CASE 1: Using the wallet connected through EthereumWalletButton (highest priority)
    if (ethereumConnected && ethereumAccount) {
      console.log("NFTProvider - Using account connected through EthereumWalletButton:", 
        `${ethereumAccount.slice(0, 6)}...${ethereumAccount.slice(-4)}`);
        
      // Skip if we already have NFTs for this wallet
      if (state.ethereumWallet === ethereumAccount && state.ethereumNFTs.length > 0) {
        console.log("NFTProvider - Already have NFTs for this account, skipping fetch");
        return;
      }
      
      walletToUse = ethereumAccount;
    }
    // CASE 2: No direct connection, use only the specifically selected wallet from localStorage
    else if (savedWallet) {
      console.log(`NFTProvider - Looking for wallet provider: ${savedWallet}`);
      
      // MetaMask specifically selected
      if (savedWallet === 'MetaMask') {
        // Check providers array first (needed when both MetaMask and Phantom are installed)
        if (typeof window !== 'undefined' && (window as any).ethereum?.providers?.length > 0) {
          try {
            const providers = (window as any).ethereum.providers;
            // Find MetaMask but exclude Phantom's MetaMask simulation
            const metamaskProvider = providers.find((p: any) => p.isMetaMask && !p.isPhantom);
            
            if (metamaskProvider) {
              console.log("NFTProvider - Found MetaMask in providers array");
              const accounts = await metamaskProvider.request({ method: 'eth_accounts' });
              if (accounts && accounts.length > 0) {
                console.log("NFTProvider - Using MetaMask account from providers array");
                walletToUse = accounts[0];
              }
            }
          } catch (err) {
            console.error("NFTProvider - Error accessing MetaMask from providers array:", err);
          }
        }
        
        // If not found in providers array, try window.ethereum as fallback for MetaMask
        if (!walletToUse && typeof window !== 'undefined' && 
            (window as any).ethereum?.isMetaMask && 
            !(window as any).ethereum?.isPhantom) {
          try {
            const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              console.log("NFTProvider - Using direct MetaMask account");
              walletToUse = accounts[0];
            }
          } catch (err) {
            console.error("NFTProvider - Error accessing direct MetaMask:", err);
          }
        }
      }
      // Phantom specifically selected
      else if (savedWallet === 'Phantom') {
        if (typeof window !== 'undefined' && (window as any).ethereum?.isPhantom) {
          try {
            const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              console.log("NFTProvider - Using Phantom Ethereum account");
              walletToUse = accounts[0];
            }
          } catch (err) {
            console.error("NFTProvider - Error accessing Phantom for Ethereum:", err);
          }
        }
      }
      // Coinbase Wallet specifically selected
      else if (savedWallet === 'Coinbase Wallet') {
        // Check providers array first
        if (typeof window !== 'undefined' && (window as any).ethereum?.providers?.length > 0) {
          try {
            const providers = (window as any).ethereum.providers;
            const coinbaseProvider = providers.find((p: any) => p.isCoinbaseWallet);
            
            if (coinbaseProvider) {
              console.log("NFTProvider - Found Coinbase Wallet in providers array");
              const accounts = await coinbaseProvider.request({ method: 'eth_accounts' });
              if (accounts && accounts.length > 0) {
                console.log("NFTProvider - Using Coinbase Wallet account from providers array");
                walletToUse = accounts[0];
              }
            }
          } catch (err) {
            console.error("NFTProvider - Error accessing Coinbase Wallet from providers array:", err);
          }
        }
        
        // Fallback to direct window.ethereum for Coinbase
        if (!walletToUse && typeof window !== 'undefined' && 
            (window as any).ethereum?.isCoinbaseWallet) {
          try {
            const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              console.log("NFTProvider - Using direct Coinbase Wallet account");
              walletToUse = accounts[0];
            }
          } catch (err) {
            console.error("NFTProvider - Error accessing direct Coinbase Wallet:", err);
          }
        }
      }
      // Other specific wallets - generic approach
      else if (typeof window !== 'undefined') {
        console.log(`NFTProvider - Looking for generic wallet provider: ${savedWallet}`);
        try {
          if ((window as any).ethereum) {
            const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              console.log(`NFTProvider - Using account from ${savedWallet}:`, accounts[0]);
              walletToUse = accounts[0];
            }
          }
        } catch (err) {
          console.error(`NFTProvider - Error accessing ${savedWallet}:`, err);
        }
      }
    }
    // CASE 3: No saved wallet preference, use any available wallet
    else if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        console.log("NFTProvider - No wallet preference, checking for any connected wallet");
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          console.log("NFTProvider - Using first available account (no preference):", accounts[0]);
          walletToUse = accounts[0];
        }
      } catch (err) {
        console.error("NFTProvider - Error getting accounts with no preference:", err);
      }
    }
    
    // If we still don't have a wallet, try using state.ethereumWallet
    if (!walletToUse && state.ethereumWallet) {
      console.log("NFTProvider - Using previously known wallet from state:", 
        `${state.ethereumWallet.slice(0, 6)}...${state.ethereumWallet.slice(-4)}`);
      walletToUse = state.ethereumWallet;
    }
    
    console.log("NFTProvider - Wallet selection result:", { 
      savedWallet,
      walletToUse: walletToUse ? `${walletToUse.slice(0, 6)}...${walletToUse.slice(-4)}` : null,
      stateWallet: state.ethereumWallet ? `${state.ethereumWallet.slice(0, 6)}...${state.ethereumWallet.slice(-4)}` : null
    });
    
    // If we don't have a wallet to use, we can't fetch NFTs
    if (!walletToUse) {
      console.log("NFTProvider - No Ethereum wallet available to fetch NFTs");
      return;
    }
    
    // Skip if we already have NFTs for this wallet
    if (walletToUse === state.ethereumWallet && state.ethereumNFTs.length > 0) {
      console.log("NFTProvider - Already have NFTs for this wallet, skipping fetch:", 
        `${walletToUse.slice(0, 6)}...${walletToUse.slice(-4)}`);
      return;
    }
    
    // Fetch NFTs from the API
    try {
      console.log("NFTProvider - Fetching Ethereum NFTs for wallet:", 
        `${walletToUse.slice(0, 6)}...${walletToUse.slice(-4)}`);
      
      setState(prev => ({ ...prev, ethereumLoading: true, error: null }));
      
      // Store NFTs before fetching to handle 304 case
      const previousNFTs = state.ethereumNFTs;
      console.log(`NFTProvider - Previous NFTs count before fetch: ${previousNFTs.length}`);
      
      const response = await api.get<NFTResponse | NFT[] | string>(
        `https://backend.avie.live/api/nfts/ethereum/${walletToUse}`
      );
      
      // Log the full response for debugging
      console.log(`NFTProvider - ${savedWallet || 'Ethereum'} API response:`, {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        hasNfts: typeof response.data === 'object' && !Array.isArray(response.data) && 'nfts' in response.data ? !!response.data.nfts : false,
        nftCount: typeof response.data === 'object' && !Array.isArray(response.data) && 'nfts' in response.data ? response.data.nfts?.length || 0 : 0,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data)
      });
      
      // Special handling for the NFT data we received as a JSON string
      if (typeof response.data === 'string' && response.data.indexOf('[{') === 0) {
        try {
          console.log("NFTProvider - Received string data, attempting to parse JSON");
          const parsedData = JSON.parse(response.data) as NFT[];
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            console.log(`NFTProvider - Successfully parsed JSON array with ${parsedData.length} NFTs`);
            setState(prev => ({
              ...prev,
              ethereumNFTs: parsedData,
              ethereumLoading: false,
              ethereumWallet: walletToUse
            }));
            return;
          }
        } catch (parseError) {
          console.error("NFTProvider - Error parsing JSON string:", parseError);
        }
      }
      
      // Handle 304 Not Modified responses - data hasn't changed since last request
      if (response.status === 304) {
        console.log(`NFTProvider - 304 Not Modified response for ${savedWallet || 'Ethereum'}`);
        
        // If we had NFTs before, keep them
        if (previousNFTs && previousNFTs.length > 0) {
          console.log(`NFTProvider - Keeping ${previousNFTs.length} existing NFTs from the previous state`);
          setState(prev => ({
            ...prev,
            ethereumLoading: false,
            ethereumWallet: walletToUse
            // Not changing NFTs since we're keeping the existing ones
          }));
        } else {
          console.log(`NFTProvider - No existing NFTs to keep, treating as empty response`);
          setState(prev => ({
            ...prev,
            ethereumNFTs: [],
            ethereumLoading: false,
            ethereumWallet: walletToUse
          }));
        }
        return;
      }
      
      // For normal responses, ensure we have a valid nfts array
      if (!response.data) {
        console.error('Error fetching Ethereum NFTs: No data in response', response);
        setState(prev => ({
          ...prev,
          error: 'The server returned an empty response',
          ethereumLoading: false,
        }));
        return;
      }
      
      // Handle case where response.data is an array directly (not wrapped in NFTResponse)
      if (Array.isArray(response.data)) {
        console.log(`NFTProvider - Received direct array of NFTs: ${response.data.length}`);
        const typedNFTs = response.data as NFT[];
        setState(prev => ({
          ...prev,
          ethereumNFTs: typedNFTs,
          ethereumLoading: false,
          ethereumWallet: walletToUse
        }));
        return;
      }
      
      // Handle standard response format with NFTResponse object
      const nftResponse = response.data as NFTResponse;
      if (!nftResponse.nfts) {
        console.error('Error fetching Ethereum NFTs: Response missing NFT data', response);
        setState(prev => ({
          ...prev,
          error: 'The server returned an invalid response without NFT data',
          ethereumLoading: false,
        }));
        return;
      }
      
      console.log(`NFTProvider - ${savedWallet || 'Ethereum'} NFTs fetched successfully:`, nftResponse.nfts.length);
      
      // Always update NFTs if we received any or had none before
      if (nftResponse.nfts.length > 0 || !state.ethereumNFTs || state.ethereumNFTs.length === 0) {
        setState(prev => ({
          ...prev,
          ethereumNFTs: nftResponse.nfts,
          ethereumLoading: false,
          ethereumWallet: walletToUse
        }));
      } else {
        console.log(`NFTProvider - No NFTs returned for ${savedWallet || 'Ethereum'}, keeping existing NFTs`);
        setState(prev => ({
          ...prev,
          ethereumLoading: false,
          ethereumWallet: walletToUse
        }));
      }
    } catch (error: any) {
      console.error('Error fetching Ethereum NFTs:', error);
      // Try to recover using the data from the error if it contains the NFT data
      if (error.response?.data && Array.isArray(error.response.data)) {
        console.log(`NFTProvider - Recovering with ${error.response.data.length} NFTs from error response`);
        setState(prev => ({
          ...prev,
          ethereumNFTs: error.response.data as NFT[],
          ethereumLoading: false,
          ethereumWallet: walletToUse
        }));
        return;
      }
      
      // More detailed error reporting
      const errorMessage = error instanceof Error 
        ? `Failed to fetch Ethereum NFTs: ${error.message}` 
        : 'Failed to fetch Ethereum NFTs';
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        ethereumLoading: false,
      }));
    }
  };

  // Refresh all NFTs
  const refreshNFTs = async () => {
    console.log("NFTProvider - Starting refreshNFTs for both chains", {
      solanaWallet: state.solanaWallet ? `${state.solanaWallet.slice(0, 6)}...` : null,
      ethereumWallet: state.ethereumWallet ? `${state.ethereumWallet.slice(0, 6)}...` : null,
      ethereumAccount: ethereumAccount ? `${ethereumAccount.slice(0, 6)}...` : null,
      savedWallet: typeof window !== 'undefined' ? localStorage.getItem('livestreamcoin-ethereum-wallet') : null
    });
    
    try {
      // For Solana
      if (state.solanaWallet) {
        console.log("NFTProvider - Refreshing Solana NFTs");
        await fetchSolanaNFTs();
      } else {
        console.log("NFTProvider - Skipping Solana NFTs refresh - no wallet connected");
      }
      
      // Get saved wallet preference for Ethereum
      let savedWallet = null;
      try {
        if (typeof window !== 'undefined') {
          savedWallet = localStorage.getItem('livestreamcoin-ethereum-wallet');
        }
      } catch (e) {
        console.error("NFTProvider - Error reading localStorage in refreshNFTs:", e);
      }
      
      // For Ethereum - use either the state wallet or direct account
      const ethWalletToUse = state.ethereumWallet || ethereumAccount;
      if (ethWalletToUse) {
        console.log("NFTProvider - Refreshing Ethereum NFTs using wallet:", 
          `${ethWalletToUse.slice(0, 6)}...${ethWalletToUse.slice(-4)}`,
          savedWallet ? `(Selected wallet: ${savedWallet})` : '');
        await fetchEthereumNFTs();
      } else if (ethereumConnected) {
        console.log("NFTProvider - Ethereum connected but no address, trying refresh anyway");
        await fetchEthereumNFTs();
      } else {
        console.log("NFTProvider - Skipping Ethereum NFTs refresh - no wallet connected");
      }
      
      console.log("NFTProvider - Completed refreshNFTs for both chains");
    } catch (error) {
      console.error("NFTProvider - Error in refreshNFTs:", error);
    }
  };

  // Select an NFT
  const selectNFT = (nft: NFT | null) => {
    setState(prev => ({ ...prev, selectedNFT: nft }));
  };

  // Clear NFT selection
  const clearSelection = () => {
    setState(prev => ({ ...prev, selectedNFT: null }));
  };

  // Special check for Phantom wallet with Ethereum functionality
  useEffect(() => {
    const checkPhantomForEthereum = async () => {
      // First check if user has selected a specific Ethereum wallet
      let savedWallet: string | null = null;
      
      try {
        if (typeof window !== 'undefined') {
          savedWallet = localStorage.getItem('livestreamcoin-ethereum-wallet');
          console.log("NFTProvider - Saved Ethereum wallet from localStorage:", savedWallet);
        }
      } catch (e) {
        console.error("NFTProvider - Error reading from localStorage:", e);
      }
      
      // COMPLETELY SKIP if MetaMask is selected
      if (savedWallet === 'MetaMask') {
        console.log("NFTProvider - Skipping Phantom Ethereum check because MetaMask is selected");
        return;
      }
      
      // If Phantom was explicitly selected as the wallet or no specific selection
      const usePhantom = savedWallet === 'Phantom' || 
                        (!savedWallet && typeof window !== 'undefined' && (window as any).ethereum?.isPhantom);
      
      if (usePhantom) {
        try {
          console.log("NFTProvider - Detected Phantom wallet with Ethereum support");
          
          // Get accounts using eth_accounts
          const accounts = await (window as any).ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts && accounts.length > 0) {
            console.log("NFTProvider - Phantom wallet has Ethereum accounts:", accounts);
            
            // Update state if needed
            if (!state.ethereumWallet) {
              setState(prev => ({
                ...prev,
                ethereumWallet: accounts[0],
              }));
              
              // Also fetch NFTs if we don't have any
              if (!state.ethereumNFTs || state.ethereumNFTs.length === 0) {
                console.log("NFTProvider - Auto-fetching Ethereum NFTs from Phantom");
                fetchEthereumNFTs();
              }
            }
          }
        } catch (err) {
          console.error("NFTProvider - Error checking Phantom for Ethereum:", err);
        }
      } else if (savedWallet && savedWallet !== 'Phantom' && typeof window !== 'undefined') {
        // If another wallet was explicitly selected, make sure we don't override it with Phantom
        console.log(`NFTProvider - User has selected ${savedWallet} wallet, not using Phantom for Ethereum`);
      }
    };
    
    checkPhantomForEthereum();
  }, []);

  // Context value
  const value: NFTContextType = {
    ...state,
    fetchSolanaNFTs,
    fetchEthereumNFTs,
    selectNFT,
    clearSelection,
    refreshNFTs,
    ethereumConnected,
  };

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
};

// Custom hook to use the NFT context
export const useNFT = () => {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error('useNFT must be used within an NFTProvider');
  }
  return context;
}; 