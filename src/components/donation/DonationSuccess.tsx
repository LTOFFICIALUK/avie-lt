'use client';

import React from 'react';
import { Button, Typography, Space, Result } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface DonationSuccessProps {
  onClose: () => void;
  streamerName: string;
}

const DonationSuccess: React.FC<DonationSuccessProps> = ({ onClose, streamerName }) => {
  return (
    <Result
      icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
      title="Donation Successful!"
      subTitle={`Thank you for supporting ${streamerName}!`}
      extra={[
        <Button 
          key="close" 
          type="primary" 
          onClick={onClose}
          style={{ 
            backgroundColor: 'var(--color-brand)',
            borderColor: 'var(--color-brand)',
          }}
        >
          Close
        </Button>
      ]}
    />
  );
};

export default DonationSuccess; 