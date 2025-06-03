import { NextRequest, NextResponse } from 'next/server';
import { getTokenPrice, getTokenPrices } from '@/lib/tokenprice';

// GET /api/token-prices
export async function GET(request: NextRequest) {
  try {
    // Check if a specific token symbol was requested
    const symbol = request.nextUrl.searchParams.get('symbol');
    
    // Response will include a timestamp for when the data was returned
    const responseTime = Date.now();
    
    // If a specific token is requested, return just that token's price
    if (symbol) {
      const tokenPrice = await getTokenPrice(symbol);
      
      if (!tokenPrice) {
        return NextResponse.json(
          { error: `Price for token '${symbol}' not found` },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        data: tokenPrice,
        timestamp: responseTime,
      });
    }
    
    // Otherwise, return all token prices
    const prices = await getTokenPrices();
    
    return NextResponse.json({
      data: prices,
      timestamp: responseTime,
    });
  } catch (error) {
    console.error('Error fetching token prices:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch token prices' },
      { status: 500 }
    );
  }
} 