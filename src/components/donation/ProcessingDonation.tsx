'use client';

import React from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ProcessingDonationProps {
  status: string;
}

const ProcessingDonation: React.FC<ProcessingDonationProps> = ({ status }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Spin 
        indicator={<LoadingOutlined className="text-4xl text-blue-400" spin />}
        className="mb-6"
      />
      <Title level={4} className="mb-2 text-center">
        Processing your donation
      </Title>
      <Text className="text-center text-gray-400 mb-4">
        Please wait while we process your transaction. This may take a moment.
      </Text>
      <div className="w-full bg-gray-800 rounded-lg p-4 mt-2">
        <Text className="text-gray-300">
          {status || 'Initializing transaction...'}
        </Text>
      </div>
    </div>
  );
};

export default ProcessingDonation; 