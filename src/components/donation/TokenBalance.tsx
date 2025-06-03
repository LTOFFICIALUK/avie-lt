'use client';

import React, { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { Spin, Tag, Tooltip } from 'antd';
import { LoadingOutlined, WalletOutlined } from '@ant-design/icons';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as ethers from 'ethers';

interface TokenBalanceProps {
  address: string;
  tokenSymbol: string;
  chainType: 'solana' | 'ethereum';
  tokenMintAddress?: string;
  onBalanceUpdate?: (balance: string, usdValue?: string) => void;
  showAsSecondary?: boolean;
}

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://wandering-damp-dew.solana-mainnet.quiknode.pro/fc98948d433c595f5f32d5b13aad664a01ed91e8';

// ABI za ERC20 token
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// Token mint naslovi za Solano
const SOLANA_TOKEN_ADDRESSES: Record<string, string> = {
  'SOL': '', // Native SOL
  'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'USDT': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'BONK': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  'JUP': 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  'PONKE': '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC',
};

// Crypto price API URL - Using CoinGecko free API
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Token IDs for price lookup
const TOKEN_COINGECKO_IDS: Record<string, string> = {
  'solana': 'solana',
  'ethereum': 'ethereum',
  'usdc': 'usd-coin',
  'usdt': 'tether',
  'dai': 'dai',
  'bonk': 'bonk',
  'jup': 'jupiter-exchange',
  'ponke': 'ponke',
};

const TokenBalance: React.FC<TokenBalanceProps> = ({ 
  address, 
  tokenSymbol, 
  chainType,
  tokenMintAddress,
  onBalanceUpdate,
  showAsSecondary
}) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [usdValue, setUsdValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (chainType === 'solana') {
          await fetchSolanaBalance();
        } else if (chainType === 'ethereum') {
          await fetchEthereumBalance();
        }
      } catch (err) {
        setError('Failed to load balance');
        setBalance(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSolanaBalance = async () => {
      const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
      const walletPubkey = new PublicKey(address);
      
      // Če je SOL, pridobimo stanje SOL
      if (tokenSymbol.toLowerCase() === 'solana') {
        const solBalance = await connection.getBalance(walletPubkey);
        const formattedBalance = (solBalance / LAMPORTS_PER_SOL).toFixed(4);
        setBalance(formattedBalance);
      } 
      // Drugače pridobimo stanje SPL tokena
      else {
        const mintAddress = tokenMintAddress || SOLANA_TOKEN_ADDRESSES[tokenSymbol.toUpperCase()];
        
        if (!mintAddress) {
          setError(`Unknown token: ${tokenSymbol}`);
          return;
        }
        
        try {
          const mintPubkey = new PublicKey(mintAddress);
          const tokenAccount = await getAssociatedTokenAddress(
            mintPubkey,
            walletPubkey
          );
          
          try {
            const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);
            setBalance(tokenBalance.value.uiAmount?.toFixed(4) || '0');
          } catch (err) {
            // Če token račun ne obstaja, je stanje 0
            setBalance('0');
          }
        } catch (err) {
          console.error('Error getting token account:', err);
          setError('Failed to find token account');
        }
      }
    };

    const fetchEthereumBalance = async () => {
      if (!window.ethereum) {
        setError('Ethereum provider not found');
        return;
      }
      
      try {
        // Uporabimo JsonRpcProvider namesto BrowserProvider, ki ni na voljo v tej verziji ethers
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        
        // Če je ETH, pridobimo stanje ETH
        if (tokenSymbol.toLowerCase() === 'ethereum') {
          const balance = await provider.getBalance(address);
          // Uporabimo formatEther funkcijo iz ethers.utils
          const formattedBalance = ethers.utils.formatEther(balance);
          setBalance(parseFloat(formattedBalance).toFixed(4));
        } 
        // Drugače pridobimo stanje ERC20 tokena
        else {
          // Za ERC20 tokene potrebujemo naslov tokena
          let mintAddress = tokenMintAddress;
          if (!mintAddress) {
            // Poskusimo najti naslov v konstantah
            const tokenKey = tokenSymbol.toUpperCase();
            const tokenAddresses: Record<string, string> = {
              'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
              'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
              'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            };
            
            mintAddress = tokenAddresses[tokenKey];
            if (!mintAddress) {
              setError(`Token address not provided for ${tokenSymbol}`);
              return;
            }
          }
          
          const tokenContract = new ethers.Contract(
            mintAddress,
            ERC20_ABI,
            provider
          );
          
          try {
            const decimals = await tokenContract.decimals();
            const balance = await tokenContract.balanceOf(address);
            
            // Uporabimo formatUnits funkcijo iz ethers.utils
            const formattedBalance = ethers.utils.formatUnits(balance, decimals);
            setBalance(parseFloat(formattedBalance).toFixed(4));
          } catch (err) {
            console.error('Error getting ERC20 token balance:', err);
            setError('Failed to get token balance');
            setBalance('0');
          }
        }
      } catch (err) {
        console.error('Error initializing Ethereum provider:', err);
        setError('Failed to initialize Ethereum provider');
        setBalance('0');
      }
    };

    fetchBalance();
  }, [address, tokenSymbol, chainType, tokenMintAddress]);

  // Fetch USD price when balance changes
  useEffect(() => {
    const fetchUsdPrice = async () => {
      if (balance === null) return;

      try {
        const tokenId = TOKEN_COINGECKO_IDS[tokenSymbol.toLowerCase()];
        if (!tokenId) return;

        // Add cache busting parameter and simple caching based on token
        const cacheBuster = Date.now();
        const cacheKey = `price_${tokenId}`;
        
        // Try to get cached price first (valid for 5 minutes)
        const cachedPrice = sessionStorage.getItem(cacheKey);
        if (cachedPrice) {
          try {
            const { price, timestamp } = JSON.parse(cachedPrice);
            const ageInMinutes = (Date.now() - timestamp) / (1000 * 60);
            
            // Use cached price if less than 5 minutes old
            if (ageInMinutes < 5) {
              const balanceNum = parseFloat(balance);
              const usdValueCalculated = (balanceNum * price).toFixed(2);
              setUsdValue(usdValueCalculated);
              return;
            }
          } catch (e) {
            // Ignore cache parse errors
          }
        }

        // Fetch fresh price
        const response = await fetch(`${COINGECKO_API_URL}/simple/price?ids=${tokenId}&vs_currencies=usd&_=${cacheBuster}`);
        if (!response.ok) return;

        const data = await response.json();
        if (data[tokenId]?.usd) {
          const price = data[tokenId].usd;
          const balanceNum = parseFloat(balance);
          const usdValueCalculated = (balanceNum * price).toFixed(2);
          setUsdValue(usdValueCalculated);
          
          // Cache the price
          sessionStorage.setItem(cacheKey, JSON.stringify({
            price,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        // Silently fail - UI will work without pricing
        setUsdValue(null);
      }
    };

    fetchUsdPrice();
  }, [balance, tokenSymbol]);

  useEffect(() => {
    // Ob spremembi stanja pokliči callback funkcijo
    if (balance !== null && onBalanceUpdate) {
      onBalanceUpdate(balance, usdValue || undefined);
    }
  }, [balance, usdValue, onBalanceUpdate]);

  if (isLoading) {
    return (
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 14, color: 'var(--color-brand)' }} spin />}
      />
    );
  }

  if (error) {
    return (
      <Tooltip title={error}>
        <Tag color="error" className="cursor-help">
          <span className="text-xs">Error</span>
        </Tag>
      </Tooltip>
    );
  }

  if (balance === null) {
    return <span className="text-xs text-gray-400">Not available</span>;
  }

  return showAsSecondary ? (
    <span className="text-xs text-gray-500 flex items-center gap-1">
      ({balance} {tokenSymbol.toUpperCase()})
    </span>
  ) : (
    <Tag color="#001f3f" className="text-xs flex items-center gap-1 py-1">
      <WalletOutlined style={{ fontSize: 12 }} />
      <span>
        {balance} {tokenSymbol.toUpperCase()}
      </span>
    </Tag>
  );
};

export default TokenBalance; 