'use client';

import React, { useState } from 'react';
import { Button } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { DonationModal } from '../donation/DonationModal';

interface MobileDonationButtonProps {
  username: string;
}

export function MobileDonationButton({ username }: MobileDonationButtonProps) {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const handleDonate = () => {
    setIsDonationModalOpen(true);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<GiftOutlined />}
        onClick={handleDonate}
        style={{ 
          backgroundColor: 'var(--color-brand)',
          borderColor: 'transparent',
          color: 'black',
          fontWeight: '500',
          borderRadius: '20px',
          width: '100%',
          fontSize: '12px'
        }}
        size="middle"
      >
        Donate to {username}
      </Button>

      <DonationModal
        open={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        streamerName={username}
      />
    </>
  );
} 