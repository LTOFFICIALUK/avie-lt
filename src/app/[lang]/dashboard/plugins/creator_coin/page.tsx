"use client";
import React from "react";
import { Typography, Card } from "antd";
import CreatorCoinManager from "./(components)/CreatorCoinManager";

const { Title, Paragraph } = Typography;

const CreatorCoinPage: React.FC = () => {
  return (
    <div className="creator-coin-container">
      <div className="mb-6">
        <Title level={3}>Creator Coin</Title>
        <Paragraph className="text-[var(--text-secondary)]">
          Create your own token on Solana blockchain with automatic fee collection and liquidity pools.
          Make your token instantly tradable by creating a liquidity pool.
        </Paragraph>
      </div>

      <CreatorCoinManager />
    </div>
  );
};

export default CreatorCoinPage; 