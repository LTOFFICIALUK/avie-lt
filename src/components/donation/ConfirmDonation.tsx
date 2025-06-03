'use client';

import React, { useState, useEffect } from 'react';
import { Button, Descriptions, Divider, Card } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { TOKEN_OPTIONS } from './constants';
import { Transaction } from './DonationModal';

// Token IDs for price lookup (copied from TokenBalance for consistency)
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
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

interface ConfirmDonationProps {
  currentTransaction: Transaction;
  confirmingTx: boolean;
  selectedChain: 'solana' | 'ethereum';
  handleConfirmTransaction: () => Promise<void>;
  setDonationStep: (step: 'form' | 'confirm' | 'processing' | 'complete' | 'error') => void;
}

const ConfirmDonation: React.FC<ConfirmDonationProps> = ({
  currentTransaction,
  confirmingTx,
  selectedChain,
  handleConfirmTransaction,
  setDonationStep
}) => {
  const [tokenUsdRate, setTokenUsdRate] = useState<number | null>(null);
  
  // Get token details based on the current transaction
  const getTokenDetails = () => {
    if (!currentTransaction) return null;
    
    const { currency } = currentTransaction;
    const token = TOKEN_OPTIONS[selectedChain].find(t => t.value === currency);
    return token;
  };
  
  const token = getTokenDetails();
  
  // Fetch USD price for the token
  useEffect(() => {
    const fetchUsdPrice = async () => {
      if (!token) return;
      
      try {
        const tokenId = TOKEN_COINGECKO_IDS[token.value.toLowerCase()];
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
              setTokenUsdRate(price);
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
          setTokenUsdRate(price);
          
          // Cache the price
          sessionStorage.setItem(cacheKey, JSON.stringify({
            price,
            timestamp: Date.now()
          }));
        }
      } catch (err) {
        // Silently fail - UI will work without pricing data
        setTokenUsdRate(null);
      }
    };

    fetchUsdPrice();
  }, [token]);
  
  if (!currentTransaction || !token) {
    return <div>No transaction details available</div>;
  }
  
  const { amount, fee, message } = currentTransaction;
  const total = Number(amount) + Number(fee);
  
  // Calculate USD values if rate is available
  const amountUsd = tokenUsdRate ? (Number(amount) * tokenUsdRate).toFixed(2) : null;
  const feeUsd = tokenUsdRate ? (Number(fee) * tokenUsdRate).toFixed(2) : null;
  const totalUsd = tokenUsdRate ? (total * tokenUsdRate).toFixed(2) : null;
  
  return (
    <Card className="w-full">
      <Descriptions 
        bordered 
        column={1} 
        size="small"
        className="mb-4"
      >
        <Descriptions.Item 
          label="Amount" 
          labelStyle={{ fontWeight: 'bold' }}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <img 
                src={token.imageUrl} 
                alt={token.label} 
                className="w-5 h-5 object-contain" 
              />
              <span>{amount} {token.label}</span>
            </div>
            {amountUsd && (
              <span className="text-xs text-gray-400 mt-1 ml-7">
                ≈ ${amountUsd} USD
              </span>
            )}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item 
          label="Platform Fee" 
          labelStyle={{ fontWeight: 'bold' }}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <img 
                src={token.imageUrl} 
                alt={token.label} 
                className="w-5 h-5 object-contain" 
              />
              <span>{fee} {token.label}</span>
            </div>
            {feeUsd && (
              <span className="text-xs text-gray-400 mt-1 ml-7">
                ≈ ${feeUsd} USD
              </span>
            )}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item 
          label="Blockchain" 
          labelStyle={{ fontWeight: 'bold' }}
        >
          <div className="flex items-center gap-2">
            <img 
              src={`/images/tokens/${selectedChain === 'solana' ? 'sol' : 'eth'}-logo.png`}
              alt={selectedChain} 
              className="w-5 h-5 object-contain" 
            />
            <span className="capitalize">{selectedChain}</span>
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item 
          label="Total" 
          labelStyle={{ fontWeight: 'bold' }}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-semibold">
              <img 
                src={token.imageUrl} 
                alt={token.label} 
                className="w-5 h-5 object-contain" 
              />
              <span>{total} {token.label}</span>
            </div>
            {totalUsd && (
              <span className="text-xs text-gray-400 mt-1 ml-7">
                ≈ ${totalUsd} USD
              </span>
            )}
          </div>
        </Descriptions.Item>
        
        {message && (
          <Descriptions.Item 
            label="Message" 
            labelStyle={{ fontWeight: 'bold' }}
          >
            {message}
          </Descriptions.Item>
        )}
      </Descriptions>
      
      <Divider />
      
      <div className="flex gap-2 justify-between">
        <Button 
          onClick={() => setDonationStep('form')}
          icon={<CloseOutlined />}
          disabled={confirmingTx}
        >
          Back
        </Button>
        
        <Button 
          type="primary" 
          onClick={handleConfirmTransaction}
          loading={confirmingTx}
          icon={<CheckOutlined />}
          style={{ 
            backgroundColor: 'var(--color-brand)',
            borderColor: 'var(--color-brand)',
          }}
        >
          Confirm & Send
        </Button>
      </div>
    </Card>
  );
};

export default ConfirmDonation; 