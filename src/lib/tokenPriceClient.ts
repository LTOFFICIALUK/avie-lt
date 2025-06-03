/**
 * Client-side utility for fetching token prices from our API
 */

interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  lastUpdated: number;
}

interface TokenPriceResponse {
  data: TokenPrice | Record<string, TokenPrice>;
  timestamp: number;
}

/**
 * Get all token prices
 */
export async function getAllTokenPrices(): Promise<Record<string, TokenPrice>> {
  try {
    const response = await fetch('/api/token-prices');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch token prices: ${response.statusText}`);
    }
    
    const data: TokenPriceResponse = await response.json();
    return data.data as Record<string, TokenPrice>;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
}

/**
 * Get price for a specific token
 */
export async function getTokenPrice(symbol: string): Promise<TokenPrice | null> {
  try {
    const response = await fetch(`/api/token-prices?symbol=${encodeURIComponent(symbol)}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch token price: ${response.statusText}`);
    }
    
    const data: TokenPriceResponse = await response.json();
    return data.data as TokenPrice;
  } catch (error) {
    console.error(`Error fetching price for token ${symbol}:`, error);
    return null;
  }
}

/**
 * Format a USD price with proper formatting
 */
export function formatUsdPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(price);
}

/**
 * Example usage:
 * 
 * // Get all token prices
 * const prices = await getAllTokenPrices();
 * console.log('SOL price:', formatUsdPrice(prices.SOL.price));
 * 
 * // Get a specific token price
 * const solanaPrice = await getTokenPrice('SOL');
 * if (solanaPrice) {
 *   console.log('Solana price:', formatUsdPrice(solanaPrice.price));
 * }
 */ 