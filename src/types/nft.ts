export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description?: string;
  image: string;
  attributes?: NFTAttribute[];
  external_url?: string;
  animation_url?: string;
  properties?: Record<string, any>;
}

export interface NFT {
  id: string;
  tokenAddress: string;
  tokenId?: string;
  metadata: NFTMetadata;
  chain: "solana" | "ethereum" | "custom";
  image?: string; // Convenience field, may contain cached/processed image URL
  owner?: string;
}

export interface NFTCollection {
  name?: string;
  family?: string;
  floorPrice?: number;
  image?: string;
  verified?: boolean;
}

export interface NFTResponse {
  nfts: NFT[];
  hasMore?: boolean;
  cursor?: string;
  total?: number;
}

export interface NFTProviderState {
  solanaWallet: string | null;
  ethereumWallet: string | null;
  solanaLoading: boolean;
  ethereumLoading: boolean;
  solanaNFTs: NFT[];
  ethereumNFTs: NFT[];
  selectedNFT: NFT | null;
  error: string | null;
}
