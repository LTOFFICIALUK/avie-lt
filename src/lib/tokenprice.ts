import { SimpleCache } from './simpleCache';

// Define token structure
export interface TokenPrice {
  symbol: string;
  name: string;
  price: number;
  lastUpdated: number;
}

// Custom token data
interface TokenData {
  symbol: string;
  name: string;
  coingeckoId?: string;
  address?: string;
  chain?: 'solana' | 'ethereum';
}

// List of tracked tokens
const TRACKED_TOKENS: TokenData[] = [
  { symbol: 'SOL', name: 'Solana', coingeckoId: 'solana' },
  { symbol: 'solana', name: 'Solana', coingeckoId: 'solana' },
  { symbol: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum' },
  { symbol: 'ethereum', name: 'Ethereum', coingeckoId: 'ethereum' },
  { symbol: 'USDC', name: 'USD Coin', coingeckoId: 'usd-coin' },
  { symbol: 'USDT', name: 'Tether', coingeckoId: 'tether' },
  { symbol: 'BTC', name: 'Bitcoin', coingeckoId: 'bitcoin' },
  { symbol: 'AVIE', name: 'Avie Token', coingeckoId: 'avie-token' }, // Update if needed
  { symbol: 'PONKE', name: 'Ponke', address: '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC', chain: 'solana' },
  { symbol: 'BONK', name: 'Bonk', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', chain: 'solana', coingeckoId: 'bonk' },
  { symbol: 'JUP', name: 'Jupiter', coingeckoId: 'jupiter-exchange', address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', chain: 'solana' },
  { symbol: 'jup', name: 'Jupiter', coingeckoId: 'jupiter-exchange', address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', chain: 'solana' },
  // Add more tokens as needed
];

// Cache expiration time in ms (30 seconds)
const CACHE_EXPIRATION = 30 * 1000;

// Create a simple cache for token prices
const priceCache = new SimpleCache<Record<string, TokenPrice>>(CACHE_EXPIRATION);

/**
 * Fetch Jupiter API prices for Solana tokens
 * @param addresses Array of token addresses to fetch prices for
 */
async function fetchJupiterPrices(addresses: string[]): Promise<Record<string, number>> {
  try {
    // If no addresses, return empty object
    if (!addresses.length) return {};

    // Fetch from Jupiter API
    const query = addresses.join(',');
    try {
      const response = await fetch(`https://price.jup.ag/v4/price?ids=${query}`, {
        // Dodajmo timeout, da ne čakamo predolgo
        signal: AbortSignal.timeout(3000),
      });
      
      if (!response.ok) {
        throw new Error(`Jupiter API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Build result
      const result: Record<string, number> = {};
      
      // Map Jupiter response to our token structure
      for (const address of addresses) {
        if (data.data && data.data[address] && data.data[address].price) {
          result[address] = data.data[address].price;
        }
      }
      
      return result;
    } catch (fetchError) {
      console.error('Jupiter API fetch error:', fetchError);
      // Return empty object when Jupiter API fails
      return {};
    }
  } catch (error) {
    console.error('Error fetching Jupiter prices:', error);
    return {};
  }
}

/**
 * Fetch token prices from CoinGecko API
 */
async function fetchTokenPrices(): Promise<Record<string, TokenPrice>> {
  try {
    console.log('Fetching fresh token prices from APIs...');
    
    // Separate tokens by source
    const coingeckoTokens = TRACKED_TOKENS.filter(token => token.coingeckoId);
    const jupiterTokens = TRACKED_TOKENS.filter(token => token.chain === 'solana' && token.address);
    
    // Build token IDs for CoinGecko API
    const tokenIds = coingeckoTokens
      .map(token => token.coingeckoId)
      .filter(Boolean)
      .join(',');
    
    // Prepare a mapping from address to symbol for Jupiter tokens
    const addressToSymbol: Record<string, string> = {};
    jupiterTokens.forEach(token => {
      if (token.address) {
        addressToSymbol[token.address] = token.symbol;
      }
    });
    
    // Create a mapping from symbol to name for all tokens
    const symbolToName: Record<string, string> = {};
    TRACKED_TOKENS.forEach(token => {
      symbolToName[token.symbol] = token.name;
    });
    
    // Create result object
    const result: Record<string, TokenPrice> = {};
    
    // Fetch data from CoinGecko
    let coingeckoData: any = {};
    try {
      if (tokenIds) {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd&include_last_updated_at=true`, {
          // Add timeout
          signal: AbortSignal.timeout(5000),
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          coingeckoData = await response.json();
          console.log('Successfully fetched CoinGecko prices');
        } else {
          console.error(`Failed to fetch CoinGecko prices: ${response.statusText} (${response.status})`);
        }
      }
    } catch (error) {
      console.error('Error fetching from CoinGecko:', error);
      // Continue with fallbacks
    }
    
    // Map CoinGecko response to our token structure
    for (const token of coingeckoTokens) {
      if (token.coingeckoId && coingeckoData[token.coingeckoId]) {
        // Normalize symbol to uppercase for consistency
        const normalizedSymbol = token.symbol.toUpperCase();
        result[normalizedSymbol] = {
          symbol: normalizedSymbol,
          name: token.name,
          price: coingeckoData[token.coingeckoId].usd,
          lastUpdated: coingeckoData[token.coingeckoId].last_updated_at || Date.now(),
        };
        
        // Also store lowercase version for tokens that might be queried in lowercase
        if (normalizedSymbol !== token.symbol) {
          result[token.symbol] = { ...result[normalizedSymbol] };
        }
      }
    }
    
    // Fetch Jupiter prices for Solana tokens
    const jupiterAddresses = jupiterTokens.map(token => token.address).filter(Boolean) as string[];
    const jupiterPrices = await fetchJupiterPrices(jupiterAddresses);
    
    // Add Jupiter prices
    for (const address in jupiterPrices) {
      const symbol = addressToSymbol[address];
      if (symbol) {
        const normalizedSymbol = symbol.toUpperCase();
        result[normalizedSymbol] = {
          symbol: normalizedSymbol,
          name: symbolToName[symbol] || symbol,
          price: jupiterPrices[address],
          lastUpdated: Date.now(),
        };
        
        // Also store lowercase version for tokens that might be queried in lowercase
        if (normalizedSymbol !== symbol) {
          result[symbol] = { ...result[normalizedSymbol] };
        }
      }
    }
    
    // Add fallback for common tokens that might be missing
    const fallbackPrices = {
      SOL: 60.0,
      ETH: 3000.0,
      BTC: 50000.0,
      USDC: 1.0,
      USDT: 1.0,
      BONK: 0.00003,
      JUP: 2.0,
      PONKE: 0.0001,
    };
    
    // Add fallbacks for essential tokens that are missing
    for (const [symbol, price] of Object.entries(fallbackPrices)) {
      if (!result[symbol]) {
        console.log(`Using fallback price for ${symbol}`);
        result[symbol] = {
          symbol,
          name: symbolToName[symbol] || symbol,
          price,
          lastUpdated: Date.now(),
        };
      }
    }
    
    // Add lowercase variants for common tokens
    const commonTokens = ['SOL', 'ETH', 'BTC', 'USDC', 'USDT', 'BONK', 'JUP', 'PONKE'];
    for (const symbol of commonTokens) {
      if (result[symbol] && !result[symbol.toLowerCase()]) {
        result[symbol.toLowerCase()] = { ...result[symbol], symbol: symbol.toLowerCase() };
      }
    }
    
    // Add common alternative names
    if (result['SOL'] && !result['solana']) {
      result['solana'] = { ...result['SOL'], symbol: 'solana' };
    }
    
    if (result['ETH'] && !result['ethereum']) {
      result['ethereum'] = { ...result['ETH'], symbol: 'ethereum' };
    }
    
    // Log successful fetch
    console.log(`Successfully fetched prices for ${Object.keys(result).length} tokens`);
    return result;
  } catch (error) {
    console.error('Error in fetchTokenPrices:', error);
    // Return fallback object with basic tokens on error
    return {
      'SOL': { symbol: 'SOL', name: 'Solana', price: 60.0, lastUpdated: Date.now() },
      'ETH': { symbol: 'ETH', name: 'Ethereum', price: 3000.0, lastUpdated: Date.now() },
      'BTC': { symbol: 'BTC', name: 'Bitcoin', price: 50000.0, lastUpdated: Date.now() },
      'USDC': { symbol: 'USDC', name: 'USD Coin', price: 1.0, lastUpdated: Date.now() },
      'USDT': { symbol: 'USDT', name: 'Tether', price: 1.0, lastUpdated: Date.now() },
    };
  }
}

/**
 * Get token prices from cache or fetch if not available
 * @returns Record of token prices
 */
export async function getTokenPrices(): Promise<Record<string, TokenPrice>> {
  const cacheKey = 'tokenPrices';
  
  // First try to get from cache
  const cached = priceCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Cache miss, fetch fresh data
  const prices = await fetchTokenPrices();
  
  // Cache the results (only if successful)
  if (Object.keys(prices).length > 0) {
    priceCache.put(cacheKey, prices);
  }
  
  return prices;
}

/**
 * Get the price of a specific token
 * @param symbol Token symbol (e.g., 'SOL', 'ETH')
 * @returns Token price information or null if not found
 */
export async function getTokenPrice(symbol: string): Promise<TokenPrice | null> {
  const prices = await getTokenPrices();
  
  // Check for exact match first (case sensitive)
  if (prices[symbol]) {
    return prices[symbol];
  }
  
  // Try uppercase version
  if (prices[symbol.toUpperCase()]) {
    return prices[symbol.toUpperCase()];
  }
  
  // Try lowercase version
  if (prices[symbol.toLowerCase()]) {
    return prices[symbol.toLowerCase()];
  }
  
  // If we're looking for SOL but with another name
  if (symbol.toLowerCase() === 'sol' || symbol.toLowerCase() === 'solana') {
    return prices['SOL'] || prices['solana'] || null;
  }
  
  // If we're looking for ETH but with another name
  if (symbol.toLowerCase() === 'eth' || symbol.toLowerCase() === 'ethereum') {
    return prices['ETH'] || prices['ethereum'] || null;
  }
  
  // Check for JUP
  if (symbol.toLowerCase() === 'jup' || symbol.toLowerCase() === 'jupiter') {
    return prices['JUP'] || prices['jup'] || null;
  }
  
  // Last resort: hardcoded fallbacks for common tokens if all else fails
  if (symbol.toLowerCase() === 'sol' || symbol.toLowerCase() === 'solana') {
    return {
      symbol: 'SOL',
      name: 'Solana',
      price: 60.0, // Fallback price (will be outdated but better than nothing)
      lastUpdated: Date.now(),
    };
  }
  
  if (symbol.toLowerCase() === 'eth' || symbol.toLowerCase() === 'ethereum') {
    return {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3000.0, // Fallback price (will be outdated but better than nothing)
      lastUpdated: Date.now(),
    };
  }
  
  return null;
}

/**
 * Force refresh of token prices
 * @returns Updated token prices
 */
export async function refreshTokenPrices(): Promise<Record<string, TokenPrice>> {
  const prices = await fetchTokenPrices();
  
  // Update cache
  if (Object.keys(prices).length > 0) {
    priceCache.put('tokenPrices', prices);
  }
  
  return prices;
}

// Clean up expired cache items every 5 minutes
setInterval(() => {
  priceCache.cleanup();
}, 5 * 60 * 1000);
