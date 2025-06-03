"use client";

import { useState, useEffect } from "react";
import { Typography, Switch, Tooltip, Space, message, Card, Button, Alert } from "antd";
import { InfoCircleOutlined, WalletOutlined } from "@ant-design/icons";
import { NFTProvider, NFTSelectorButton } from "@/components/NFT";
import { NFT } from "@/types/nft";

const { Text } = Typography;

interface CharacterNFTSelectorProps {
  onChange?: (data: {
    useNft: boolean;
    nft: NFT | null;
  }) => void;
  initialUseNft?: boolean;
  initialNft?: NFT | null;
}

export function CharacterNFTSelector({ 
  onChange, 
  initialUseNft = false, 
  initialNft = null 
}: CharacterNFTSelectorProps) {
  const [useNft, setUseNft] = useState(initialUseNft);
  const [selectedNft, setSelectedNft] = useState<NFT | null>(initialNft);
  const [messageApi, contextHolder] = message.useMessage();
  const [hasAttributes, setHasAttributes] = useState(false);

  // Initialize with initial NFT if provided
  useEffect(() => {
    if (initialNft && !selectedNft) {
      if (
        initialNft.metadata && 
        typeof initialNft.metadata === 'object' && 
        typeof initialNft.metadata.name === 'string' &&
        typeof initialNft.metadata.image === 'string'
      ) {
        setSelectedNft(initialNft);
        
        // Check if NFT has attributes
        const attributes = initialNft.metadata.attributes || [];
        setHasAttributes(attributes.length > 0);
      } else {
        console.error('Invalid NFT data structure:', initialNft);
        messageApi.error('Received invalid NFT data structure');
      }
    }
  }, [initialNft, selectedNft, messageApi]);

  // Extract important attributes from NFT
  const extractImportantAttributes = (nft: NFT) => {
    if (!nft?.metadata?.attributes) return [];
    
    const attributes = nft.metadata.attributes;
    const importantAttributes = attributes.filter((attr: any) => {
      const traitType = (attr.trait_type || '').toLowerCase();
      
      // These are typically important traits for character generation
      return (
        traitType.includes('personality') || 
        traitType.includes('trait') ||
        traitType.includes('character') ||
        traitType.includes('class') ||
        traitType.includes('type') ||
        traitType.includes('role') ||
        traitType.includes('skill') ||
        traitType.includes('ability') ||
        traitType.includes('power') ||
        traitType.includes('background') ||
        traitType.includes('story') ||
        traitType.includes('lore') ||
        traitType.includes('rarity')
      );
    });
    
    return importantAttributes;
  };

  // Toggle NFT usage
  const handleToggleUseNft = (checked: boolean) => {
    setUseNft(checked);
    
    if (onChange) {
      onChange({
        useNft: checked,
        nft: checked ? selectedNft : null
      });
    }

    if (checked && !selectedNft) {
      messageApi.info('Please select an NFT to use for character generation');
    }
  };

  // Handle NFT selection from the NFTSelectorButton component
  const handleNftChange = (data: { useNft: boolean; nft: NFT | null }) => {
    setSelectedNft(data.nft);
    
    if (data.nft) {
      // Check for metadata completeness
      if (!data.nft.metadata || !data.nft.metadata.image) {
        messageApi.warning('The selected NFT has incomplete metadata. Some features may not work properly.');
      } else {
        // Check for attributes
        const attributes = data.nft.metadata.attributes || [];
        setHasAttributes(attributes.length > 0);
        
        // Show different messages based on attributes
        if (attributes.length > 0) {
          const importantAttributes = extractImportantAttributes(data.nft);
          if (importantAttributes.length > 0) {
            messageApi.success('NFT selected with valuable character attributes that will enhance your character!');
          } else {
            messageApi.success('NFT selected successfully. It has attributes that will be used for generation.');
          }
        } else {
          messageApi.success('NFT selected successfully. Name and image will be used for generation.');
        }
      }
    } else if (selectedNft) {
      messageApi.info('NFT selection cleared');
      setHasAttributes(false);
    }
    
    if (onChange) {
      onChange({
        useNft: data.useNft,
        nft: data.nft
      });
    }
  };

  return (
    <NFTProvider>
      <Space direction="vertical" size="small" className="w-full">
        {contextHolder}
        
        <div className="flex items-center justify-between">
          <Space>
            <Text>Use NFT for character generation</Text>
            <Tooltip title="When enabled, your character will inherit traits from your selected NFT. Connect your wallet to select an NFT.">
              <InfoCircleOutlined className="text-[var(--text-secondary)]" />
            </Tooltip>
          </Space>
          <Switch
            checked={useNft}
            onChange={handleToggleUseNft}
          />
        </div>

        {useNft && (
          <div className="animate-fadeIn">
            <Card 
              className="bg-[var(--background-secondary)] rounded-xl mt-4" 
              variant="borderless"
            >
              <Space direction="vertical" className="w-full">
                <Text type="secondary">
                  Select an NFT to use its traits for character generation. The AI will extract visual and descriptive elements from the NFT.
                </Text>
                
                <div className="mt-2">
                  <NFTSelectorButton
                    onSelect={handleNftChange}
                    selectedNft={selectedNft}
                    useNft={useNft}
                    buttonText="Select NFT"
                    buttonType="primary"
                    showPreview={true}
                  />
                </div>
                
                {selectedNft && hasAttributes && (
                  <Alert
                    message="NFT Attributes Detected"
                    description="Your selected NFT contains attributes that will be used to enhance your character's traits and personality."
                    type="success"
                    showIcon
                    className="mt-4"
                  />
                )}
                
                {selectedNft && !hasAttributes && (
                  <Alert
                    message="Limited NFT Metadata"
                    description="Your selected NFT doesn't have detailed attributes. The AI will use the NFT's name and image to inform character generation."
                    type="info"
                    showIcon
                    className="mt-4"
                  />
                )}
              </Space>
            </Card>
          </div>
        )}

        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}</style>
      </Space>
    </NFTProvider>
  );
} 