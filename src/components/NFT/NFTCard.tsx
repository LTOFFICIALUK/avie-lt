"use client";

import React from 'react';
import { Card, Tooltip, Tag, Skeleton } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { NFT } from '@/types/nft';
import Image from 'next/image';

interface NFTCardProps {
  nft: NFT;
  selected?: boolean;
  onClick?: (nft: NFT) => void;
  showChain?: boolean;
  imageOnly?: boolean;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  selected = false,
  onClick,
  showChain = true,
  imageOnly = false,
}) => {
  const {
    metadata,
    chain,
  } = nft;

  // Extract short address (if tokenId not available, use last part of address)
  const shortId = nft.tokenId 
    ? (nft.tokenId.length > 8 ? `#${nft.tokenId.substring(0, 6)}...` : `#${nft.tokenId}`) 
    : nft.tokenAddress.substring(nft.tokenAddress.length - 6);

  // Get correct source for image
  const imageUrl = metadata?.image || '';
  const isIpfsUrl = imageUrl.startsWith('ipfs://');
  const formattedImageUrl = isIpfsUrl 
    ? `https://ipfs.io/ipfs/${imageUrl.replace('ipfs://', '')}`
    : imageUrl;

  // Handle image loading errors
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(nft);
    }
  };

  // Determine chain badge color
  const getChainColor = () => {
    switch (chain) {
      case 'solana':
        return 'bg-gradient-to-r from-[#9945FF] to-[#14F195]';
      case 'ethereum':
        return 'bg-gradient-to-r from-[#8A92B2] to-[#62688F]';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card
      hoverable
      className={`transition-all duration-200 rounded-xl overflow-hidden ${selected ? 'shadow-[0_0_0_2px_var(--color-brand)]' : 'border border-[var(--border-color)]'} bg-[var(--background-secondary)]`}
      onClick={handleCardClick}
      bodyStyle={{ padding: imageOnly ? 0 : '12px' }}
    >
      <div className="relative w-full pb-[100%] overflow-hidden rounded-lg bg-[var(--background-tertiary)]">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton.Image active style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        
        {!imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={formattedImageUrl}
            alt={metadata?.name || 'NFT'}
            className={`absolute inset-0 w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-tertiary)] text-[var(--text-secondary)] text-xs">
            <span>Image not available</span>
          </div>
        )}
        
        {showChain && (
          <div className="absolute top-2 right-2 z-10">
            <Tag 
              className={`border-none text-white rounded text-xs py-0 px-1.5 font-bold uppercase ${getChainColor()}`}
            >
              {chain}
            </Tag>
          </div>
        )}
        
        {selected && (
          <div className="absolute bottom-2 right-2 z-10 w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <CheckCircleFilled className="text-[var(--color-brand)] text-xl" />
          </div>
        )}
      </div>
      
      {!imageOnly && (
        <div className="mt-2">
          <Tooltip title={metadata?.name || 'Unnamed NFT'}>
            <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis text-[var(--text-primary)]">
              {metadata?.name || 'Unnamed NFT'}
            </div>
          </Tooltip>
          <div className="text-xs text-[var(--text-secondary)]">{shortId}</div>
        </div>
      )}
    </Card>
  );
}; 