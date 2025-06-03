'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, InputNumber, Select, Form, Typography, Space, Spin, Alert, Input, Tabs, Steps } from 'antd';
import { SendOutlined, WalletOutlined, CheckOutlined, LoadingOutlined, ExclamationCircleOutlined, CloseOutlined, ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Transaction as SolanaTransaction } from '@solana/web3.js';
import { useEthereumWallet } from '@/components/EthereumWalletButton';
import { TOKEN_OPTIONS, PLATFORM_FEE_PERCENTAGE } from './constants';
import DonationForm from './DonationForm';
import ConfirmDonation from './ConfirmDonation';
import ProcessingDonation from './ProcessingDonation';
import DonationSuccess from './DonationSuccess';
import DonationError from './DonationError';
import { Connection } from '@solana/web3.js';


export interface WalletInfo {
  id: string;
  address: string;
  type: string;
  isPrimary: boolean;
}

export interface TokenInfo {
  value: string;
  label: string;
  icon: string;
  imageUrl: string;
  min: number;
  max: number;
  tokenMintAddress: string;
}

export interface Transaction {
  amount: number;
  currency: string;
  chain: 'solana' | 'ethereum';
  fee: number;
  total: number;
  message?: string;
  transaction: any; // Specific transaction details vary by chain
  donationId: string;
}

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  streamerName: string;
}

export const DonationModal: React.FC<DonationModalProps> = ({ 
  open, 
  onClose, 
  streamerName
}) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('solana');
  const [selectedChain, setSelectedChain] = useState<'solana' | 'ethereum'>('solana');
  const [donationComplete, setDonationComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingTx, setConfirmingTx] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [donationStep, setDonationStep] = useState<'form' | 'confirm' | 'processing' | 'complete' | 'error'>('form');
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('Preparing transaction...');
  
  // Get Solana wallet
  const { publicKey: solanaPublicKey, connected: solanaConnected, signTransaction: signSolanaTransaction } = useWallet();
  const { connection } = useConnection();
  
  // Get Ethereum wallet
  const { account: ethereumAccount, connected: ethereumConnected } = useEthereumWallet();
  
  // Reset form state when modal opens
  useEffect(() => {
    if (open) {
      setDonationComplete(false);
      setError(null);
      setDonationStep('form');
      setCurrentTransaction(null);
      setTransactionError(null);
      setProcessingStatus('Preparing transaction...');
      
      // Give time for the form to mount properly before resetting
      const timer = setTimeout(() => {
        form.resetFields();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [open, form]);
  
  // Fetch wallets when modal opens
  useEffect(() => {
    if (open && streamerName) {
      fetchStreamerWallets();
    }
  }, [open, streamerName]);

  // Auto-select the first connected wallet's chain
  useEffect(() => {
    // If both wallets are connected, prefer Solana
    if (solanaConnected && ethereumConnected) {
      setSelectedChain('solana');
    } 
    // If only Solana is connected
    else if (solanaConnected) {
      setSelectedChain('solana');
    } 
    // If only Ethereum is connected
    else if (ethereumConnected) {
      setSelectedChain('ethereum');
    }
    // Otherwise, maintain the existing choice or default
  }, [solanaConnected, ethereumConnected]);

  // Update form defaults when changing chain
  useEffect(() => {
    // Default to the first token of the selected chain
    const defaultCurrency = TOKEN_OPTIONS[selectedChain][0].value;
    setSelectedCurrency(defaultCurrency);
    
    form.setFieldsValue({
      currency: defaultCurrency,
      amount: TOKEN_OPTIONS[selectedChain].find(c => c.value === defaultCurrency)?.min || 0.001
    });
  }, [selectedChain, form]);

  // Check wallet types and set selected chain accordingly
  useEffect(() => {
    // Check which wallet types the streamer has
    const hasSolanaWallet = wallets.some(wallet => wallet.type.toLowerCase() === 'solana');
    const hasEthereumWallet = wallets.some(wallet => wallet.type.toLowerCase() === 'ethereum');
    
    // If streamer only has one wallet type, force that selection
    if (hasSolanaWallet && !hasEthereumWallet) {
      setSelectedChain('solana');
    } else if (!hasSolanaWallet && hasEthereumWallet) {
      setSelectedChain('ethereum');
    }
  }, [wallets]);

  const fetchStreamerWallets = async () => {
    if (!streamerName) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/stream/${streamerName}/wallets`);
      if (response.data && response.data.wallets) {
        setWallets(response.data.wallets);
        
        // Set initial chain based on what's available
        const hasSolana = response.data.wallets.some((w: WalletInfo) => w.type === 'solana');
        const hasEthereum = response.data.wallets.some((w: WalletInfo) => w.type === 'ethereum');
        
        if (hasSolana && solanaConnected) {
          setSelectedChain('solana');
          setSelectedCurrency('solana');
        } else if (hasEthereum && ethereumConnected) {
          setSelectedChain('ethereum');
          setSelectedCurrency('ethereum');
        } else if (hasSolana) {
          setSelectedChain('solana');
          setSelectedCurrency('solana');
        } else if (hasEthereum) {
          setSelectedChain('ethereum');
          setSelectedCurrency('ethereum');
        }
      } else {
        setError(`${streamerName} does not have any wallets set up for donations`);
      }
    } catch (error) {
      console.error('Error fetching streamer wallets:', error);
      setError('Failed to load streamer wallet information');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (values: any) => {
    try {
      setProcessing(true);
      setError(null);
      
      // Check if wallet is connected
      if (selectedChain === 'solana' && !solanaConnected) {
        setError('Please connect your Solana wallet to proceed');
        setProcessing(false);
        return;
      }
      
      if (selectedChain === 'ethereum' && !ethereumConnected) {
        setError('Please connect your Ethereum wallet to proceed');
        setProcessing(false);
        return;
      }
      
      // Prepare donation payload
      const payload = {
        streamerName,
        amount: parseFloat(values.amount),
        currency: values.currency,
        message: values.message || '',
        blockchain: selectedChain
      };
      
      // Create donation
      const response = await api.post('/api/stream/donations/send', payload);
      
      if (response.data.success) {
        // Set current transaction
        setCurrentTransaction({
          amount: parseFloat(values.amount),
          currency: values.currency,
          chain: selectedChain,
          fee: response.data.transaction.fee || 0,
          total: parseFloat(values.amount) + (response.data.transaction.fee || 0),
          message: values.message || '',
          transaction: response.data.transaction,
          donationId: response.data.donationId
        });
        
        // Move to confirmation step
        setDonationStep('confirm');
      } else {
        setError(response.data.error || 'Failed to create donation');
      }
    } catch (err: any) {
      console.error('Error creating donation:', err);
      setError(err.response?.data?.error || 'Failed to create donation');
    } finally {
      setProcessing(false);
    }
  };
  
  const handleConfirmTransaction = async () => {
    if (!currentTransaction) return;
    
    setProcessingStatus('Preparing transaction...');
    setDonationStep('processing');
    
    try {
      if (selectedChain === 'solana') {
        await handleSolanaTransaction();
      } else if (selectedChain === 'ethereum') {
        await handleEthereumTransaction();
      }
    } catch (err: any) {
      console.error('Transaction error:', err);
      setTransactionError(err.message || 'Transaction failed');
      setDonationStep('error');
    }
  };
  
  const handleSolanaTransaction = async () => {
    if (!currentTransaction || !solanaPublicKey) {
      throw new Error('Missing transaction details or wallet not connected');
    }
    
    try {
      setProcessingStatus('Preparing Solana transaction...');
      
      // Import needed libraries
      const { Transaction, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = await import('@solana/web3.js');
      
      // Initialize connection variable that can be reassigned
      let activeConnection = connection;
      
      // Ensure we're using mainnet
      const isMainnet = activeConnection.rpcEndpoint.includes('mainnet') || 
                        activeConnection.rpcEndpoint.includes('quiknode') ||
                        (!activeConnection.rpcEndpoint.includes('devnet') && 
                         !activeConnection.rpcEndpoint.includes('testnet'));
      
      if (!isMainnet) {
        // Try to force switch network if Phantom is available
        try {
          setProcessingStatus('Attempting to switch to Solana Mainnet...');
          
          // @ts-ignore - wallet adapter types are not complete
          const { solana } = window;
          
          if (solana && typeof solana.connect === 'function') {
            // Try to disconnect and reconnect to force network selection dialog
            await solana.disconnect();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await solana.connect({
              onlyIfTrusted: false // Force user selection
            });
            
            // After reconnection, check network again
            const rpcEndpoint = activeConnection.rpcEndpoint;
            const switchedToMainnet = rpcEndpoint.includes('mainnet') || 
                                       rpcEndpoint.includes('quiknode') ||
                                      (!rpcEndpoint.includes('devnet') && 
                                       !rpcEndpoint.includes('testnet'));
                                       
            if (!switchedToMainnet) {
              // If still not on mainnet, create custom connection to mainnet
              setProcessingStatus('Using custom Solana mainnet connection...');
              // Use the provided RPC URL
              activeConnection = new Connection('https://wandering-damp-dew.solana-mainnet.quiknode.pro/fc98948d433c595f5f32d5b13aad664a01ed91e8/');
            }
          }
        } catch (switchError) {
          console.warn('Failed to switch to Solana mainnet');
          setProcessingStatus('Using custom Solana mainnet connection...');
          // Fallback to custom mainnet connection
          activeConnection = new Connection('https://wandering-damp-dew.solana-mainnet.quiknode.pro/fc98948d433c595f5f32d5b13aad664a01ed91e8/');
        }
      }
      
      setProcessingStatus('Connecting to Solana mainnet...');
      
      // Get transaction data
      const serializedTransaction = currentTransaction.transaction.serializedTransaction;
      if (!serializedTransaction) {
        throw new Error('Invalid transaction data received from server');
      }
      
      // Reset connection with Phantom
      try {
        // @ts-ignore - wallet adapter types are not complete
        const { solana } = window;
        
        if (solana && typeof solana.connect === 'function') {
          setProcessingStatus('Ensuring wallet connection...');
          
          // Try to reconnect to wallet
          try {
            await solana.connect();
          } catch (connectError) {
            // Continue despite connection error
          }
        }
      } catch (walletError) {
        // Continue despite wallet error
      }
      
      // Try to ensure Phantom wallet is prompted properly
      // @ts-ignore - wallet adapter types are not complete
      const { solana } = window;
      if (!solana?.signTransaction) {
        throw new Error('Wallet adapter does not support transaction signing - please ensure Phantom extension is properly installed and unlocked');
      }
      
      // Attempt to focus Phantom if possible
      try {
        // This may not work in all browsers due to security restrictions
        window.focus();
        
        // Add a small delay to allow UI to update and wallet to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (focusError) {
        console.warn('Could not focus window:', focusError);
      }
      
      setProcessingStatus('Waiting for wallet confirmation (please check your Phantom extension)...');
      
      // Decode base64 serialized transaction
      const transactionBuffer = Buffer.from(serializedTransaction, 'base64');
      const transaction = Transaction.from(transactionBuffer);
      
      // Get the latest blockhash from our active connection
      const { blockhash, lastValidBlockHeight } = await activeConnection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = solanaPublicKey;
      
      // Sign the transaction
      let signedTransaction;
      try {
        signedTransaction = await solana.signTransaction(transaction);
      } catch (signError: any) {
        console.error('Signing error:', signError);
        
        // Check for specific signing errors
        if (signError.message.includes('not open') || signError.message.includes('wallet disconnected')) {
          throw new Error('Failed to connect to Phantom wallet. Please ensure Phantom is unlocked and try again.');
        }
        
        throw signError;
      }
      
      // Send the transaction
      setProcessingStatus('Sending transaction to network...');
      let signature;
      
      try {
        // Use more conservative settings for transaction sending
        signature = await activeConnection.sendRawTransaction(signedTransaction.serialize(), {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
          maxRetries: 3
        });
      } catch (sendError: any) {
        console.error('Send transaction error:', sendError);
        
        // If it's a blockhash error, retry with a new blockhash
        if (sendError.message.includes('blockhash')) {
          setProcessingStatus('Retrying with new blockhash...');
          
          // Get a fresh blockhash
          const { blockhash: newBlockhash } = await activeConnection.getLatestBlockhash();
          transaction.recentBlockhash = newBlockhash;
          
          // Sign again with new blockhash
          const newSignedTx = await solana.signTransaction(transaction);
          
          // Try sending again
          signature = await activeConnection.sendRawTransaction(newSignedTx.serialize(), {
            skipPreflight: false,
            preflightCommitment: 'confirmed',
            maxRetries: 3
          });
        } else {
          // If it's not a recognized error, rethrow
          throw sendError;
        }
      }
      
      if (!signature) {
        throw new Error('Failed to send transaction');
      }
      
      // Confirm the transaction
      setProcessingStatus('Confirming transaction...');
      try {
        const confirmResult = await activeConnection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight
        }, 'confirmed');
        
        // Check for transaction confirmation errors
        if (confirmResult.value.err) {
          const errMsg = confirmResult.value.err.toString();
          console.error('Transaction confirmed but has errors:', errMsg);
          
          if (errMsg.includes('debit an account but found no record of a prior credit')) {
            throw new Error('Transaction failed: Your account does not have enough funds.');
          }
          
          throw new Error(`Transaction error: ${errMsg}`);
        }
      } catch (confirmError: any) {
        console.warn('Could not confirm transaction:', confirmError);
        
        // Check if it's a "not enough funds" error
        if (confirmError.message.includes('debit an account but found no record of a prior credit')) {
          throw new Error('Transaction failed: Your account does not have enough funds.');
        }
        
        // Otherwise continue, as the transaction might still be valid
        console.log('Continuing despite confirmation error');
      }
      
      // Verify with backend
      setProcessingStatus('Verifying transaction...');
      const verifyResponse = await api.post('/api/stream/donations/verify', {
        donationId: currentTransaction.donationId,
        signature: signature,
        transactionId: signature,
        blockchain: 'solana'
      });
      
      if (verifyResponse.data.success) {
        setDonationStep('complete');
      } else {
        throw new Error(verifyResponse.data.error || 'Failed to verify transaction');
      }
      
    } catch (error: any) {
      console.error('Solana transaction error:', error);
      
      // Handle specific error types for better error messages
      if (error.message.includes('debit an account but found no record of a prior credit')) {
        throw new Error('Transaction failed: Your account does not have enough funds.');
      } else if (error.message.includes('Insufficient')) {
        throw new Error(error.message);
      } else if (error.message.includes('Blockhash not found') || error.message.includes('blockhash')) {
        throw new Error('Transaction failed: The network is busy. Please try again.');
      } else if (error.message.includes('User rejected')) {
        throw new Error('Transaction was cancelled by user');
      } else {
        throw new Error(`Transaction error: ${error.message}`);
      }
    }
  };
  
  const handleEthereumTransaction = async () => {
    if (!currentTransaction || !ethereumAccount) {
      throw new Error('Missing transaction details or wallet not connected');
    }
    
    try {
      setProcessingStatus('Requesting wallet approval...');
      
      // @ts-ignore - ethereum window object
      const ethereum = window.ethereum;
      
      if (!ethereum) {
        throw new Error('Ethereum provider not found');
      }
      
      // Check current network and switch to mainnet if needed
      try {
        setProcessingStatus('Checking Ethereum network...');
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        
        // Ethereum mainnet has chainId 1 (0x1 in hex)
        if (chainId !== '0x1') {
          setProcessingStatus('Switching to Ethereum mainnet...');
          try {
            // Try to switch to mainnet
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x1' }],
            });
            setProcessingStatus('Successfully switched to Ethereum mainnet');
          } catch (switchError: any) {
            // This error code means the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              setProcessingStatus('Adding Ethereum mainnet to wallet...');
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x1',
                    chainName: 'Ethereum Mainnet',
                    nativeCurrency: {
                      name: 'Ether',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://mainnet.infura.io/v3/'],
                    blockExplorerUrls: ['https://etherscan.io'],
                  },
                ],
              });
            } else {
              setProcessingStatus('Please manually switch to Ethereum mainnet in your wallet');
              // Wait for the user to manually switch
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }
        } else {
          setProcessingStatus('Already connected to Ethereum mainnet');
        }
      } catch (networkError) {
        setProcessingStatus('Continuing with transaction, please ensure you are on Ethereum mainnet');
      }
      
      try {
        // First send recipient transaction
        const recipientTx = currentTransaction.transaction.recipientTx;
        
        if (!recipientTx) {
          throw new Error('Invalid transaction data received from server');
        }
        
        setProcessingStatus('Waiting for wallet confirmation (1/2)...');
        
        const recipientTxHash = await ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: ethereumAccount,
            to: recipientTx.to,
            value: recipientTx.value,
            data: recipientTx.data,
            gas: '0x30D40' // 200,000 gas
          }]
        });
        
        if (!recipientTxHash) {
          throw new Error('Failed to send recipient transaction');
        }
        
        // Then send fee transaction if needed
        const feeTx = currentTransaction.transaction.feeTx;
        
        if (feeTx && (parseFloat(feeTx.value) > 0 || feeTx.data !== '0x')) {
          setProcessingStatus('Waiting for wallet confirmation (2/2)...');
          
          const feeTxHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: ethereumAccount,
              to: feeTx.to,
              value: feeTx.value,
              data: feeTx.data,
              gas: '0x30D40' // 200,000 gas
            }]
          });
          
          if (!feeTxHash) {
            throw new Error('Failed to send fee transaction');
          }
        }
        
        setProcessingStatus('Verifying transaction...');
        
        // Notify backend of signed transaction
        const verifyResponse = await api.post('/api/stream/donations/verify', {
          donationId: currentTransaction.donationId,
          signature: recipientTxHash,
          transactionId: recipientTxHash,
          blockchain: 'ethereum'
        });
        
        if (verifyResponse.data.success) {
          setDonationStep('complete');
        } else {
          throw new Error(verifyResponse.data.error || 'Failed to verify transaction');
        }
      } catch (txError: any) {
        throw new Error(`Transaction error: ${txError.message}`);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        throw new Error('Transaction was cancelled by user');
      }
      throw err;
    }
  };

  const handleChainChange = (chain: 'solana' | 'ethereum') => {
    setSelectedChain(chain);
    // Set default currency for the chain
    setSelectedCurrency(chain === 'solana' ? 'solana' : 'ethereum');
  };

  const renderStepContent = () => {
    switch (donationStep) {
      case 'form':
        return (
          <DonationForm
            form={form}
            loading={loading}
            wallets={wallets}
            error={error}
            processing={processing}
            selectedChain={selectedChain}
            selectedCurrency={selectedCurrency}
            streamerName={streamerName}
            solanaConnected={solanaConnected}
            solanaPublicKey={solanaPublicKey}
            ethereumConnected={ethereumConnected}
            ethereumAccount={ethereumAccount}
            handleChainChange={handleChainChange}
            setSelectedCurrency={setSelectedCurrency}
            handleDonate={handleDonate}
          />
        );
      case 'confirm':
        return (
          <ConfirmDonation
            currentTransaction={currentTransaction!}
            confirmingTx={processing}
            selectedChain={selectedChain}
            handleConfirmTransaction={handleConfirmTransaction}
            setDonationStep={setDonationStep}
          />
        );
      case 'processing':
        return <ProcessingDonation status={processingStatus} />;
      case 'complete':
        return <DonationSuccess onClose={onClose} streamerName={streamerName} />;
      case 'error':
        return (
          <DonationError
            transactionError={transactionError}
            error={error}
            setDonationStep={setDonationStep}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  // Determine if back button should be shown
  const showBackButton = donationStep === 'confirm' || donationStep === 'error';
  
  // Track step progress
  const currentStep = 
    donationStep === 'form' ? 0 :
    donationStep === 'confirm' ? 1 : 
    donationStep === 'processing' ? 2 :
    donationStep === 'complete' || donationStep === 'error' ? 3 : 0;

  return (
    <Modal
      title={
        <div className="flex items-center">
          {showBackButton && (
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => setDonationStep('form')}
              className="mr-2 text-gray-400"
            />
          )}
          <span>Support {streamerName}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      centered
      className="donation-modal"
      rootClassName="bg-background"
      classNames={{
        content: "bg-[var(--background)] rounded-xl shadow-lg",
        header: "bg-[var(--background)] border-b border-[rgba(255,255,255,0.1)] rounded-t-xl pb-2",
        body: "bg-[var(--background)] p-4 max-h-[80vh] overflow-y-auto",
        footer: "bg-[var(--background)] border-t border-[rgba(255,255,255,0.1)] rounded-b-xl",
        mask: "backdrop-blur-sm bg-black/70"
      }}
    >
      {renderStepContent()}
    </Modal>
  );
}; 