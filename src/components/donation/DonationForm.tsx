'use client';

import React, { useState, useEffect } from 'react';
import { InputNumber, Form, Typography, Input, Button, Alert, Select, Tabs, Tooltip } from 'antd';
import { SendOutlined, InfoCircleOutlined, QuestionCircleOutlined, LockOutlined, WalletOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';
import { WalletInfo, TokenInfo } from './DonationModal';
import Image from 'next/image';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_OPTIONS, PLATFORM_FEE_PERCENTAGE } from './constants';
import TokenBalance from './TokenBalance';
import { getTokenPrice, formatUsdPrice } from '@/lib/tokenPriceClient';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEthereumWallet } from '@/components/EthereumWalletButton';
import WalletModalManager from '@/components/wallet/WalletModalManager';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Color scheme based on site globals.css
const COLORS = {
  primary: 'var(--color-brand)', // #84eef5
  primaryDarker: 'var(--color-brand-darker)', // #73cfd6
  accent: 'var(--color-accent)', // #6c5cd3
  accentDarker: 'var(--color-accent-darker)', // #6254be
  background: 'var(--background)', // #070c0c
  foreground: 'var(--foreground)', // #ffffff
  gray: 'var(--color-gray)', // #18181b
  lightGray: 'var(--color-lightGray)', // #cdcece
  textSecondary: 'var(--text-secondary)', // #cdcece
  textSecondaryDark: 'var(--text-secondary-dark)', // rgba(255, 255, 255, 0.45)
  danger: 'var(--color-danger)', // #b31313
};

// Define any Ant Design override styles that can't be done with Tailwind
const overrideStyles = {
  select: {
    backgroundColor: COLORS.gray,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    height: '46px',
    color: COLORS.foreground,
  },
  dropdown: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.gray,
    borderRadius: '8px', 
  },
  inputNumber: {
    backgroundColor: COLORS.gray,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: COLORS.foreground,
    borderRadius: '8px',
    height: '46px',
    fontSize: '16px',
  },
  tabs: {
    borderBottom: `1px solid ${COLORS.gray}`,
    marginBottom: '16px',
  },
  item: {
    marginBottom: '16px',
  },
  textArea: {
    backgroundColor: COLORS.gray,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: COLORS.foreground,
    borderRadius: '8px',
    fontSize: '16px',
  },
  percentButton: {
    borderRadius: '8px',
    fontWeight: 500,
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formLabel: {
    color: COLORS.textSecondary,
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
  }
};

// Add CSS to fix input styling issues
const customStyles = `
  .antd-number-input-fix .ant-input-number-input {
    height: 46px !important;
    line-height: 46px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    display: flex !important;
    align-items: center !important;
  }
  
  .select-token .ant-select-selector {
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
    padding: 0 8px !important;
  }
`;

interface DonationFormProps {
  form: FormInstance;
  loading: boolean;
  wallets: WalletInfo[];
  error: string | null;
  processing: boolean;
  selectedChain: 'solana' | 'ethereum';
  selectedCurrency: string;
  streamerName: string;
  solanaConnected: boolean;
  solanaPublicKey: PublicKey | null;
  ethereumConnected: boolean;
  ethereumAccount: string | null;
  handleChainChange: (chain: 'solana' | 'ethereum') => void;
  setSelectedCurrency: (currency: string) => void;
  handleDonate: (values: any) => Promise<void>;
}

const DonationForm: React.FC<DonationFormProps> = ({
  form,
  loading,
  wallets,
  error,
  processing,
  selectedChain,
  selectedCurrency,
  streamerName,
  solanaConnected,
  solanaPublicKey,
  ethereumConnected,
  ethereumAccount,
  handleChainChange,
  setSelectedCurrency,
  handleDonate,
}) => {
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [tokenUsdValue, setTokenUsdValue] = useState<string | null>(null);
  const [usdAmount, setUsdAmount] = useState<number | null>(null);
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [percentageSelectError, setPercentageSelectError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [tokenPrices, setTokenPrices] = useState<Record<string, any>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Get the current token options based on the selected chain
  const currentTokenOptions = TOKEN_OPTIONS[selectedChain];
  
  // Find the current token details
  const selectedToken = currentTokenOptions.find(token => token.value === selectedCurrency);

  // Dodajte nov useEffect za nalaganje cen tokenov
  useEffect(() => {
    async function loadTokenPrices() {
      try {
        setIsLoadingPrices(true);
        const price = await getTokenPrice(selectedCurrency);
        
        if (price) {
          // Če dobimo ceno, jo uporabimo za izračun USD vrednosti
          const newUsdRate = price.price.toString();
          
          setTokenPrices(prev => ({
            ...prev,
            [selectedCurrency]: price
          }));
          
          // Če imamo balance, posodobimo tudi USD vrednost
          if (tokenBalance) {
            const balance = parseFloat(tokenBalance);
            // Izračunamo vrednost celotnega stanja v USD
            const totalUsdValue = (balance * price.price).toString();
            setTokenUsdValue(totalUsdValue);
            
            // Posodobimo tudi USD vrednost trenutnega zneska
            const currentAmount = form.getFieldValue('amount');
            if (currentAmount) {
              const amountValue = parseFloat(currentAmount);
              const calculatedUsd = amountValue * price.price;
              setUsdAmount(calculatedUsd);
            }
          }
        }
        
        setIsLoadingPrices(false);
      } catch (error) {
        console.error('Error loading token prices:', error);
        setIsLoadingPrices(false);
      }
    }
    
    loadTokenPrices();
    
    // Osvežimo cene vsakih 60 sekund
    const priceInterval = setInterval(loadTokenPrices, 60 * 1000);
    
    return () => clearInterval(priceInterval);
  }, [selectedCurrency, tokenBalance]);

  // Posodobimo funkcijo updateTokenBalance
  const updateTokenBalance = (balance: string, usdValue?: string) => {
    // Make sure we have valid numeric values
    const parsedBalance = parseFloat(balance);
    setTokenBalance(isNaN(parsedBalance) ? null : balance);
    
    // Če imamo tokenPrices, jih uporabimo za posodobitev USD vrednosti
    const tokenPrice = tokenPrices[selectedCurrency];
    if (tokenPrice && !isNaN(parsedBalance)) {
      const calculatedUsdValue = (parsedBalance * tokenPrice.price).toString();
      setTokenUsdValue(calculatedUsdValue);
    } else if (usdValue) {
      // Če nimamo tokenPrices, uporabimo vrednost, ki jo je poslal TokenBalance
      const parsedUsdValue = parseFloat(usdValue);
      setTokenUsdValue(isNaN(parsedUsdValue) ? null : usdValue);
    }
  };

  // Calculate token amount from USD
  const calculateTokenFromUsd = (usdAmount: number): number | null => {
    if (!tokenUsdValue || !tokenBalance) return null;

    const tokenUsdRate = parseFloat(tokenUsdValue) / parseFloat(tokenBalance);
    if (isNaN(tokenUsdRate) || tokenUsdRate === 0) return null;

    return usdAmount / tokenUsdRate;
  };

  // Handle USD amount change
  const handleUsdAmountChange = (value: number | null) => {
    if (value === null) {
      setUsdAmount(null);
      form.setFieldsValue({ amount: null });
      return;
    }

    setUsdAmount(value);
    const tokenAmount = calculateTokenFromUsd(value);
    
    if (tokenAmount !== null) {
      // Format to appropriate decimal places based on token
      const formattedAmount = parseFloat(tokenAmount.toFixed(8));
      form.setFieldsValue({ amount: formattedAmount });
    }
  };

  // Handle percentage selection
  const handleSelectPercentage = (percentage: number) => {
    setSelectedPercentage(percentage);
    
    // Clear any previous error message
    setPercentageSelectError(null);
    
    if (!tokenBalance) {
      setPercentageSelectError('Unable to determine your balance');
      return;
    }
    
    // Calculate token amount based on percentage of balance
    const balanceValue = parseFloat(tokenBalance);
    const tokenAmount = balanceValue * (percentage / 100);
    
    // Format to appropriate precision
    const formattedAmount = parseFloat(tokenAmount.toFixed(8));
    
    // Make sure we have sufficient funds
    if (formattedAmount <= 0) {
      setPercentageSelectError('Amount too small to process');
      return;
    }
    
    // Update the form input field directly
    form.setFieldsValue({ amount: formattedAmount });
    
    // Force form field validation
    form.validateFields(['amount']);
    
    // Calculate and update the USD value
    if (tokenUsdValue) {
      const tokenUsdRate = parseFloat(tokenUsdValue) / balanceValue;
      const calculatedUsd = formattedAmount * tokenUsdRate;
      setUsdAmount(calculatedUsd);
    }
  };

  // Posodobimo funkcijo handleTokenAmountChange
  const handleTokenAmountChange = (value: number | null) => {
    if (value === null || !tokenBalance) {
      setUsdAmount(null);
      return;
    }

    // Uporabimo tokenPrices, če so na voljo
    const tokenPrice = tokenPrices[selectedCurrency];
    if (tokenPrice) {
      const calculatedUsd = value * tokenPrice.price;
      setUsdAmount(calculatedUsd);
      return;
    }

    // Sicer uporabimo stari način izračuna
    const balanceValue = parseFloat(tokenBalance);
    const tokenUsdRate = tokenUsdValue ? parseFloat(tokenUsdValue) / balanceValue : 0;
    
    if (isNaN(tokenUsdRate) || tokenUsdRate <= 0) {
      setUsdAmount(null);
      return;
    }

    const calculatedUsd = value * tokenUsdRate;
    setUsdAmount(calculatedUsd);
  };

  // Handle max amount selection
  const handleSelectMax = () => {
    // Clear any previous error message
    setPercentageSelectError(null);
    
    if (!tokenBalance) {
      setPercentageSelectError('Unable to determine your balance');
      return;
    }
    
    // Use the full balance as the max amount
    const balanceValue = parseFloat(tokenBalance);
    
    if (balanceValue <= 0) {
      setPercentageSelectError('Your balance is too small to donate');
      return;
    }
    
    const formattedAmount = parseFloat(balanceValue.toFixed(8));
    
    // Update the form input field directly
    form.setFieldsValue({ amount: formattedAmount });
    
    // Force form field validation
    form.validateFields(['amount']);
    
    // Calculate and update the USD value
    if (tokenUsdValue) {
      const tokenUsdRate = parseFloat(tokenUsdValue) / balanceValue;
      const calculatedUsd = formattedAmount * tokenUsdRate;
      setUsdAmount(calculatedUsd);
    }
    
    // Set percentage to 100%
    setSelectedPercentage(100);
  };

  // Force token balance update when currency, chain, or wallets change
  useEffect(() => {
    // Reset amount when changing currency
    const defaultAmount = selectedToken?.min || 0.001;
    form.setFieldsValue({ amount: defaultAmount });
    
    // Force token balance component to update by incrementing the key
    setForceUpdate(prev => prev + 1);
    
    // Reset USD amount and percentage
    setUsdAmount(null);
    setSelectedPercentage(null);
    setPercentageSelectError(null);
    
    // Update token balance immediately
    if (selectedChain === 'ethereum' && ethereumConnected && ethereumAccount) {
      const fetchEthereumBalance = async () => {
        try {
          // Simulate token balance fetch triggering - we'll get actual values from TokenBalance component
          setTimeout(() => {
            // This forces the TokenBalance component to refetch since the key will change
            setForceUpdate(prev => prev + 2);
          }, 300);  // Small delay to let UI update first
        } catch (e) {
          // No need to log errors
        }
      };
      
      fetchEthereumBalance();
    }
  }, [selectedCurrency, selectedChain, selectedToken, form, solanaConnected, ethereumConnected, ethereumAccount]);

  // Update input field when wallet connection changes
  useEffect(() => {
    // If wallet connects or disconnects, update the token balance
    setForceUpdate(prev => prev + 1);
  }, [solanaConnected, ethereumConnected]);

  // Update USD amount when tokenBalance or tokenUsdValue changes
  useEffect(() => {
    const currentAmount = form.getFieldValue('amount');
    if (currentAmount && tokenUsdValue && tokenBalance) {
      // Explicitly recalculate the USD amount
      const balanceValue = parseFloat(tokenBalance);
      const tokenUsdRate = parseFloat(tokenUsdValue) / balanceValue;
      
      if (!isNaN(tokenUsdRate) && tokenUsdRate > 0) {
        const calculatedUsd = parseFloat(currentAmount) * tokenUsdRate;
        setUsdAmount(calculatedUsd);
      }
    }
  }, [tokenBalance, tokenUsdValue, form]);

  // Add this new effect to monitor form field changes
  useEffect(() => {
    // Get current form value
    const currentAmount = form.getFieldValue('amount');
    
    // Force the input to update
    if (currentAmount !== undefined && currentAmount !== null) {
      // Directly update USD value calculation
      if (tokenBalance && tokenUsdValue) {
        const balanceValue = parseFloat(tokenBalance);
        const parsedAmount = parseFloat(currentAmount.toString());
        
        // Clear any previous errors
        setPercentageSelectError(null);
        
        // First check balance
        if (parsedAmount > balanceValue) {
          setPercentageSelectError('Insufficient funds');
        } 
        // Then check minimum amount
        else if (parsedAmount < 0.000001) {
          setPercentageSelectError('Amount must be greater than 0');
        } 
        // If all valid, update USD value
        else if (!isNaN(parsedAmount)) {
          const tokenUsdRate = parseFloat(tokenUsdValue) / balanceValue;
          
          if (!isNaN(tokenUsdRate) && tokenUsdRate > 0) {
            const calculatedUsd = parsedAmount * tokenUsdRate;
            setUsdAmount(calculatedUsd);
          }
        }
      }
    }
  }, [form.getFieldValue('amount'), tokenBalance, tokenUsdValue]);

  // Update the useEffect for textarea to handle form initial values on mount only
  useEffect(() => {
    // Initialize from form if value exists
    const initialMessage = form.getFieldValue('message');
    if (initialMessage) {
      setMessageText(initialMessage);
    }
  }, []);

  // Handle message text change
  const handleMessageChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const newValue = e.currentTarget.value;
    setMessageText(newValue);
    form.setFieldsValue({ message: newValue });
  };

  const handleSubmit = async (values: any) => {
    // Clear any previous error message
    setPercentageSelectError(null);
    
    // Check for insufficient funds before submitting
    const amount = parseFloat(values.amount);
    
    if (!tokenBalance) {
      setPercentageSelectError('Please connect your wallet first');
      return;
    }
    
    const balanceValue = parseFloat(tokenBalance);
    
    if (amount > balanceValue) {
      setPercentageSelectError('Insufficient funds for this donation');
      return;
    }
    
    if (amount < 0.000001) {
      setPercentageSelectError('Amount must be greater than 0');
      return;
    }
    
    // All checks passed, proceed with donation
    await handleDonate(values);
  };

  // Handle currency selection change
  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    
    // Reset amount to minimum for the selected token
    const token = currentTokenOptions.find(t => t.value === value);
    if (token) {
      const defaultAmount = token.min || 0.001;
      form.setFieldsValue({ amount: defaultAmount });
      
      // Force a forceUpdate to refresh the token balance
      setForceUpdate(prev => prev + 1);
    }
    
    // Clear previous values
    setUsdAmount(null);
    setSelectedPercentage(null);
    setPercentageSelectError(null);
  };
  
  useEffect(() => {
    // Add custom CSS to the document
    const styleTag = document.createElement('style');
    styleTag.innerHTML = customStyles;
    document.head.appendChild(styleTag);
    
    return () => {
      // Clean up when component unmounts
      document.head.removeChild(styleTag);
    };
  }, []);

  // Handle wallet connection button click
  const handleConnectWalletClick = () => {
    setShowWalletModal(true);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        currency: selectedCurrency,
        amount: selectedToken?.min || 0.001,
      }}
      className="donation-form w-full max-w-lg mx-auto"
      size="large"
    >
      {/* Form Card Container */}
      <div className="bg-[var(--background)] rounded-xl border border-[#18181b] shadow-lg overflow-hidden">
        {/* Form Header - styled like a wallet interface */}
        <div className="px-3 sm:px-4 py-3 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-brand)] text-black">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V21M3 12H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white">Donate to {streamerName}</h3>
          </div>
          
          {/* Network pills displayed in header */}
          <div className="flex">
            <button
              type="button"
              onClick={() => handleChainChange('solana')}
              className={`flex items-center justify-center h-7 px-2 rounded-l-md border-y border-l ${
                selectedChain === 'solana' 
                  ? 'bg-[#101616] border-[rgba(255,255,255,0.2)] text-[var(--color-brand)]' 
                  : 'bg-[#0a0f0f] border-[rgba(255,255,255,0.1)] hover:bg-[#101616] text-white'
              } text-xs transition-all`}
            >
              <img 
                src="/images/tokens/sol-logo.png" 
                alt="Solana" 
                className="w-3.5 h-3.5 object-contain mr-1"
              />
              SOL
            </button>
            
            <button
              type="button"
              onClick={() => handleChainChange('ethereum')}
              className={`flex items-center justify-center h-7 px-2 rounded-r-md border ${
                selectedChain === 'ethereum' 
                  ? 'bg-[#101616] border-[rgba(255,255,255,0.2)] text-[var(--color-brand)]' 
                  : 'bg-[#0a0f0f] border-[rgba(255,255,255,0.1)] hover:bg-[#101616] text-white'
              } text-xs transition-all`}
            >
              <img 
                src="/images/tokens/eth-logo.png" 
                alt="Ethereum" 
                className="w-3.5 h-3.5 object-contain mr-1"
              />
              ETH
            </button>
          </div>
        </div>
        
        
        {/* Form Content */}
        <div className="p-3 sm:p-4">
          {/* Integrated Amount Input with Token Selector - Wallet Style */}
          <div className="mb-4">
            <div className="flex justify-between items-center w-full mb-1.5">
              <span className="text-[var(--text-secondary)] text-sm font-medium">Amount</span>
              
              {/* Quick actions on the right */}
              <div className="flex items-center gap-1.5">
                <Button 
                  type="text" 
                  size="small"
                  className="rounded-md px-1.5 py-0 text-xs bg-[#101616] text-[var(--text-secondary-dark)] hover:text-[var(--color-brand)]"
                  onClick={() => handleSelectPercentage(50)}
                >
                  50%
                </Button>
                <Button 
                  type="text" 
                  size="small"
                  className="rounded-md px-1.5 py-0 text-xs bg-[#101616] text-[var(--text-secondary-dark)] hover:text-[var(--color-brand)]"
                  onClick={handleSelectMax}
                >
                  Max
                </Button>
              </div>
            </div>
            
            <Form.Item
              name="amount"
              rules={[
                { required: true, message: 'Please enter an amount' },
                {
                  validator: (_, value) => {
                    if (!value || !tokenBalance) return Promise.resolve();
                    
                    const numValue = parseFloat(value.toString());
                    const balanceValue = parseFloat(tokenBalance);
                    
                    if (numValue > balanceValue) {
                      return Promise.reject(new Error('Insufficient funds'));
                    }
                    
                    if (numValue < 0.000001) {
                      return Promise.reject(new Error('Amount must be greater than 0'));
                    }
                    
                    return Promise.resolve();
                  }
                }
              ]}
              validateTrigger={['onChange', 'onBlur']}
              className="mb-1"
              help={percentageSelectError}
            >
              {/* Wallet-style input container */}
              <div className="bg-[#0a0f0f] rounded-lg border border-[rgba(255,255,255,0.1)] overflow-hidden">
                {/* Token selector and input in a combined layout */}
                <div className="flex items-center">
                  {/* Token selector as dropdown */}
                  <Select
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    className="border-none bg-transparent select-token"
                    dropdownStyle={overrideStyles.dropdown}
                    style={{
                      width: 'auto',
                      minWidth: '120px',
                      backgroundColor: '#101616',
                      borderRadius: '0',
                      borderRight: '1px solid rgba(255,255,255,0.1)',
                      height: '46px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    bordered={false}
                  >
                    {currentTokenOptions.map((option) => (
                      <Option key={option.value} value={option.value}>
                        <div className="flex items-center gap-2 py-1">
                          <img 
                            src={option.imageUrl || `/images/tokens/${option.value}-logo.png`} 
                            alt={option.label} 
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = selectedChain === 'solana' ? '/images/tokens/sol-logo.png' : '/images/tokens/eth-logo.png';
                            }}
                          />
                          <span className="text-white font-medium">
                            {option.label}
                          </span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                  
                  {/* Amount input without borders */}
                  <InputNumber 
                    className="flex-1 donation-amount-input"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      color: 'white',
                      height: '46px',
                      fontSize: '16px',
                      width: '100%',
                      padding: '0 12px'
                    }}
                    rootClassName="antd-number-input-fix"
                    placeholder="0.00"
                    min={0.000001}
                    max={tokenBalance ? parseFloat(tokenBalance) : undefined}
                    step={0.001}
                    precision={8}
                    stringMode
                    keyboard={false}
                    controls={false}
                    parser={(value) => {
                      // Remove any non-numeric characters except decimal point
                      return value ? value.replace(/[^\d.]/g, '') : '';
                    }}
                    value={form.getFieldValue('amount')}
                    onChange={(value) => {
                      const numValue = value !== null ? parseFloat(value.toString()) : null;
                      
                      if (numValue !== null && tokenBalance) {
                        const balanceValue = parseFloat(tokenBalance);
                        
                        // Clear any previous errors
                        setPercentageSelectError(null);
                        
                        if (numValue > balanceValue) {
                          setPercentageSelectError('Insufficient funds');
                        } else if (numValue < 0.000001) {
                          setPercentageSelectError('Amount must be greater than 0');
                        }
                      }
                      
                      // Update the form
                      form.setFieldsValue({ amount: value });
                      
                      // Handle token amount change for USD calculation
                      handleTokenAmountChange(numValue);
                      setSelectedPercentage(null);
                    }}
                  />
                  
                  {/* USD value and balance display */}
                  <div className="pr-4 text-right">
                    <div className="text-[var(--text-secondary-dark)] text-xs">
                      {isLoadingPrices ? (
                        <span>Nalagam...</span>
                      ) : (
                        <span>~{usdAmount ? formatUsdPrice(usdAmount) : '$0.00'}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Balance information */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-3 py-1.5 border-t border-[rgba(255,255,255,0.05)] bg-[#070c0c]">
                  <div className="text-xs text-[var(--text-secondary-dark)] mb-1 sm:mb-0">
                    Balance: <span className={!tokenBalance || parseFloat(tokenBalance) === 0 ? 'text-red-400' : 'text-[var(--text-secondary)]'}>
                      {tokenBalance ? parseFloat(tokenBalance).toFixed(6) : '0.00'}
                    </span>
                    {tokenBalance && parseFloat(tokenBalance) > 0 && tokenPrices[selectedCurrency] && (
                      <span className="ml-1 text-[var(--text-secondary-dark)]">
                        (~{formatUsdPrice(parseFloat(tokenBalance) * tokenPrices[selectedCurrency].price)})
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button 
                      type="text" 
                      size="small"
                      className={`rounded-md px-1 py-0 text-[10px] sm:text-xs ${selectedPercentage === 0.5 ? 'bg-[#101616] text-[var(--color-brand)]' : 'text-[var(--text-secondary-dark)] hover:text-[var(--text-secondary)]'}`}
                      onClick={() => handleSelectPercentage(0.5)}
                    >
                      0.5%
                    </Button>
                    <Button 
                      type="text" 
                      size="small"
                      className={`rounded-md px-1 py-0 text-[10px] sm:text-xs ${selectedPercentage === 1 ? 'bg-[#101616] text-[var(--color-brand)]' : 'text-[var(--text-secondary-dark)] hover:text-[var(--text-secondary)]'}`}
                      onClick={() => handleSelectPercentage(1)}
                    >
                      1%
                    </Button>
                    <Button 
                      type="text" 
                      size="small"
                      className={`rounded-md px-1 py-0 text-[10px] sm:text-xs ${selectedPercentage === 2 ? 'bg-[#101616] text-[var(--color-brand)]' : 'text-[var(--text-secondary-dark)] hover:text-[var(--text-secondary)]'}`}
                      onClick={() => handleSelectPercentage(2)}
                    >
                      2%
                    </Button>
                    <Button 
                      type="text" 
                      size="small"
                      className={`rounded-md px-1 py-0 text-[10px] sm:text-xs ${selectedPercentage === 5 ? 'bg-[#101616] text-[var(--color-brand)]' : 'text-[var(--text-secondary-dark)] hover:text-[var(--text-secondary)]'}`}
                      onClick={() => handleSelectPercentage(5)}
                    >
                      5%
                    </Button>
                    <Button 
                      type="text" 
                      size="small"
                      className={`rounded-md px-1 py-0 text-[10px] sm:text-xs ${selectedPercentage === 10 ? 'bg-[#101616] text-[var(--color-brand)]' : 'text-[var(--text-secondary-dark)] hover:text-[var(--text-secondary)]'}`}
                      onClick={() => handleSelectPercentage(10)}
                    >
                      10%
                    </Button>
                  </div>
                </div>
              </div>
            </Form.Item>
            
            {/* No balance warning */}
            {(!tokenBalance || parseFloat(tokenBalance) === 0) && (
              <div className="text-xs text-amber-400 bg-[#151206] p-2 rounded flex items-center">
                <InfoCircleOutlined className="mr-2" />
                No balance in this token
              </div>
            )}
          </div>
          
          {/* Message input with modern design */}
          <Form.Item
            label={<span className="text-[var(--text-secondary)] text-sm font-medium">Message (Optional)</span>} 
            name="message"
            className="mb-4"
          >
            <div className="relative">
              <textarea
                ref={textareaRef}
                placeholder="Add a message for the creator and chat..."
                className="w-full bg-[#0a0f0f] border border-[rgba(255,255,255,0.1)] text-white rounded-lg py-2 px-3 text-base"
                style={{
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '80px',
                  maxHeight: '200px'
                }}
                value={messageText}
                onInput={handleMessageChange}
                maxLength={150}
              />
              <div className="text-[var(--text-secondary-dark)] text-xs text-right mt-1">
                <span>{messageText.length}</span>/150
              </div>
            </div>
          </Form.Item>

          {/* Error message with improved styling */}
          {error && (
            <div className="bg-[#1d0909] border border-[var(--color-danger)] text-red-400 rounded-lg p-2 mb-4 flex items-start text-sm">
              <InfoCircleOutlined className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button with site brand style */}
          <div className="mb-4">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={processing}
              disabled={!solanaConnected && !ethereumConnected}
              icon={<SendOutlined />}
              className="w-full h-12 text-base font-medium bg-[var(--color-brand)] hover:bg-[var(--color-brand-darker)] border-none text-black rounded-lg shadow-md flex items-center justify-center"
            >
              Send Donation
            </Button>
            
            {/* Connection status */}
            {(!solanaConnected && !ethereumConnected) && (
              <div className="text-center mt-2">
                <div className="text-xs text-red-400 mb-2">
                  <span className="flex items-center justify-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                    Wallet not connected. Please connect your wallet to donate.
                  </span>
                </div>
                <Button 
                  type="default"
                  icon={<WalletOutlined />}
                  onClick={handleConnectWalletClick}
                  className="bg-[#101616] border-[rgba(255,255,255,0.2)] text-[var(--color-brand)] hover:bg-[#1a1a1a] hover:border-[var(--color-brand)] transition-all"
                  size="small"
                >
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
          
          {/* Footer compact info */}
          <div className="flex items-center text-xs text-[var(--text-secondary-dark)] gap-x-2 gap-y-2 flex-wrap justify-center mb-2 border-t border-[rgba(255,255,255,0.05)] pt-3">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-[var(--color-brand)] rounded-full mr-1"></span>
              <span>{PLATFORM_FEE_PERCENTAGE}% Fee</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              <span>Instant Delivery</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-1"></span>
              <span>Public on Stream</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowWalletModal(false)}
          />
          <div className="relative z-10 max-w-md w-full mx-4">
            <div className="bg-[var(--background)] rounded-xl border border-[#18181b] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.1)]">
                <h3 className="text-lg font-semibold text-white">Connect Wallet</h3>
                <Button 
                  type="text" 
                  onClick={() => setShowWalletModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              <div className="p-4">
                <WalletModalManager onClose={() => setShowWalletModal(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Token balance component (hidden, just for getting balance) */}
      <div className="hidden">
        {selectedChain === 'solana' && solanaConnected && solanaPublicKey && (
          <TokenBalance
            key={`solana-${selectedCurrency}-${forceUpdate}`}
            address={solanaPublicKey.toString()}
            tokenSymbol={selectedCurrency}
            chainType="solana"
            onBalanceUpdate={updateTokenBalance}
          />
        )}
        {selectedChain === 'ethereum' && ethereumConnected && ethereumAccount && (
          <TokenBalance
            key={`ethereum-${selectedCurrency}-${forceUpdate}`}
            address={ethereumAccount}
            tokenSymbol={selectedCurrency}
            chainType="ethereum"
            tokenMintAddress={selectedToken?.tokenMintAddress}
            onBalanceUpdate={updateTokenBalance}
          />
        )}
      </div>
    </Form>
  );
};

export default DonationForm; 