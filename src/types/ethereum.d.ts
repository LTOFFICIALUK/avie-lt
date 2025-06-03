// Types for Ethereum request parameters and responses
type EthereumRequestMethod = 
  | 'eth_requestAccounts' 
  | 'eth_accounts'
  | 'eth_chainId'
  | 'eth_blockNumber'
  | 'eth_getBalance'
  | 'eth_sendTransaction'
  | 'eth_call'
  | 'wallet_addEthereumChain'
  | 'wallet_switchEthereumChain'
  | 'personal_sign'
  | string; // Allow other methods not explicitly listed

// Ethereum event data types
type EthereumEventData = string | string[] | { [key: string]: unknown };

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: EthereumRequestMethod; params?: unknown[] }) => Promise<unknown>;
    on: (eventName: string, callback: (data: EthereumEventData) => void) => void;
    removeListener: (eventName: string, callback: (data: EthereumEventData) => void) => void;
    selectedAddress?: string;
    chainId?: string;
    isConnected?: () => boolean;
  };
}

// Types for NFT metadata
interface NFTMetadata {
  name: string;
  description?: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
  external_url?: string;
}

// Types for NFT objects
interface NFT {
  id: string;
  tokenAddress: string;
  tokenId?: string;
  metadata: NFTMetadata;
  chain: "solana" | "ethereum";
} 