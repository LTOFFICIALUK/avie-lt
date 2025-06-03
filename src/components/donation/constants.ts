// Define supported tokens on each blockchain
export const TOKEN_OPTIONS = {
  solana: [
    {
      value: 'solana',
      label: 'SOL',
      icon: 'solana',
      imageUrl: '/images/tokens/sol-logo.png',
      min: 0.001,
      max: 1000,
      tokenMintAddress: '', // native SOL
    },
    {
      value: 'usdc',
      label: 'USDC',
      icon: 'usdc',
      imageUrl: '/images/tokens/usdc-logo.png',
      min: 0.5,
      max: 10000,
      tokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    },
    {
      value: 'usdt',
      label: 'USDT',
      icon: 'usdt',
      imageUrl: '/images/tokens/usdt-logo.png',
      min: 0.5,
      max: 10000,
      tokenMintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    },
    { 
      value: 'bonk', 
      label: 'BONK', 
      icon: '🐕', 
      imageUrl: '/images/tokens/bonk-logo.png',
      min: 1000, 
      max: 10000000000,
      tokenMintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    },
    { 
      value: 'jup', 
      label: 'JUP', 
      icon: '♃', 
      imageUrl: '/images/tokens/jup-logo.png',
      min: 0.1, 
      max: 10000,
      tokenMintAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    },
    { 
      value: 'ponke', 
      label: 'PONKE', 
      icon: '🐱', 
      imageUrl: '/images/tokens/ponke-logo.png',
      min: 100, 
      max: 100000000,
      tokenMintAddress: '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC',
    },
  ],
  ethereum: [
    {
      value: 'ethereum',
      label: 'ETH',
      icon: 'ethereum',
      imageUrl: '/images/tokens/eth-logo.png',
      min: 0.0001,
      max: 100,
      tokenMintAddress: '', // native ETH
    },
    {
      value: 'usdc',
      label: 'USDC',
      icon: 'usdc',
      imageUrl: '/images/tokens/usdc-logo.png',
      min: 0.5,
      max: 10000,
      tokenMintAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
    {
      value: 'usdt',
      label: 'USDT',
      icon: 'usdt',
      imageUrl: '/images/tokens/usdt-logo.png',
      min: 0.5,
      max: 10000,
      tokenMintAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    { 
      value: 'dai', 
      label: 'DAI', 
      icon: '◈', 
      imageUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
      min: 0.5, 
      max: 10000,
      tokenMintAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
  ]
};

export const PLATFORM_FEE_PERCENTAGE = 3; // 3% platform fee 