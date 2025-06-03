'use client';

import React from 'react';
import { Button, Typography, Space, Result, Alert } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface DonationErrorProps {
  transactionError: string | null;
  error: string | null;
  setDonationStep: (step: 'form' | 'confirm' | 'processing' | 'complete' | 'error') => void;
  onClose: () => void;
}

const DonationError: React.FC<DonationErrorProps> = ({ 
  transactionError, 
  error, 
  setDonationStep, 
  onClose 
}) => {
  // Process error message to provide more helpful information
  const processErrorMessage = (errorMsg: string): { title: string, details: string } => {
    // Check for network mismatch first (most common issue)
    if (errorMsg.includes('switch to Solana Mainnet') || 
        errorMsg.includes('wallet is connected to Devnet') ||
        errorMsg.includes('not connected to mainnet')) {
      return {
        title: 'Napačno Omrežje Izbrano',
        details: 'Poskušali smo avtomatsko preklopiti na mainnet omrežje, vendar ni uspelo. Vaša denarnica je trenutno povezana na testno omrežje (Devnet/Testnet), vendar vaša sredstva so na glavnem omrežju (Mainnet). Prosimo, sledite naslednjim korakom:\n\n' +
                '1. Odprite Phantom denarnico\n' +
                '2. Kliknite na nastavitve (ikona zobnika)\n' +
                '3. Izberite "Omrežje" ali "Network"\n' +
                '4. Izberite "Solana Mainnet"\n' +
                '5. Poskusite znova'
      };
    }
    
    if (errorMsg.includes('Signature verification failed')) {
      return {
        title: 'Wallet Signature Failed',
        details: 'Your wallet was unable to sign the transaction. This could be due to a connection issue or a problem with your wallet. Please try again or use a different wallet.'
      };
    }
    
    if (errorMsg.includes('insufficient funds') || 
        errorMsg.includes('Insufficient') || 
        errorMsg.includes('does not have enough funds') || 
        errorMsg.includes('debit an account but found no record of a prior credit')) {
      return {
        title: 'Insufficient Funds',
        details: 'You don\'t have enough funds in your wallet to complete this transaction. Please make sure your wallet is connected to Mainnet. If you\'re sure you have enough funds, try refreshing the page or reconnecting your wallet.'
      };
    }
    
    if (errorMsg.includes('User rejected') || errorMsg.includes('cancelled')) {
      return {
        title: 'Transaction Cancelled',
        details: 'You cancelled the transaction. No funds have been transferred.'
      };
    }
    
    if (errorMsg.includes('network is busy') || 
        errorMsg.includes('Blockhash not found')) {
      return {
        title: 'Network Congestion',
        details: 'The blockchain network is currently experiencing high traffic. Please wait a moment and try again.'
      };
    }
    
    if (errorMsg.includes('Phantom') || 
        errorMsg.includes('wallet') || 
        errorMsg.includes('connection') ||
        errorMsg.includes('unlocked')) {
      return {
        title: 'Wallet Connection Issue',
        details: 'There was a problem connecting to your wallet. Please make sure your wallet is installed, unlocked, and set to Mainnet. Try refreshing the page and reconnecting your wallet.'
      };
    }

    if (errorMsg.includes('switch') && errorMsg.includes('Ethereum')) {
      return {
        title: 'Ethereum Network Change Required',
        details: 'We attempted to automatically switch to Ethereum mainnet but need your permission. Please approve the network switch request in your wallet when prompted.'
      };
    }
    
    // Default error
    return {
      title: 'Donation Failed',
      details: errorMsg
    };
  };
  
  const errorMessage = transactionError || error || 'An unknown error occurred while processing your donation.';
  const processedError = processErrorMessage(errorMessage);
  
  return (
    <Result
      status="error"
      title={processedError.title}
      subTitle={
        <div className="mt-2">
          <Text type="danger">{processedError.details}</Text>
          
          {/* Show technical details in a collapsible area for devs */}
          {errorMessage && errorMessage !== processedError.details && (
            <div className="mt-4">
              <Alert
                type="warning"
                message="Technical Details"
                description={
                  <div className="max-h-32 overflow-y-auto">
                    <code className="text-xs whitespace-pre-wrap">{errorMessage}</code>
                  </div>
                }
              />
            </div>
          )}
        </div>
      }
      extra={[
        <Button 
          key="retry" 
          type="primary" 
          onClick={() => setDonationStep('form')}
          style={{ 
            backgroundColor: 'var(--color-brand)',
            borderColor: 'var(--color-brand)',
          }}
        >
          Try Again
        </Button>,
        <Button 
          key="close" 
          onClick={onClose}
        >
          Close
        </Button>
      ]}
    />
  );
};

export default DonationError; 