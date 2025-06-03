"use client";
import React from "react";
import { Alert, Button, Space } from "antd";
import { WalletOutlined } from "@ant-design/icons";

interface WalletRequiredAlertProps {
  onConnectWallet: () => void;
}

const WalletRequiredAlert: React.FC<WalletRequiredAlertProps> = ({ onConnectWallet }) => {
  return (
    <Alert
      message="Wallet Required"
      description={
        <div className="py-2">
          <p className="mb-3">
            You need to connect a Solana wallet before you can create a token. 
            Your tokens will be sent to this wallet after creation.
          </p>
          <Button
            type="primary"
            icon={<WalletOutlined />}
            onClick={onConnectWallet}
            size="middle"
          >
            Connect Wallet
          </Button>
        </div>
      }
      type="warning"
      showIcon
      className="mb-6"
    />
  );
};

export default WalletRequiredAlert; 