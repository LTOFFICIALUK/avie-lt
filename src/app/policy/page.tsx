"use client";
import { useState } from 'react';
import { Tabs, Typography, Breadcrumb } from 'antd';
import Link from 'next/link';
import { TermsOfService } from '@/components/policy/TermsOfService';
import { PrivacyPolicy } from '@/components/policy/PrivacyPolicy';
import { CommunityGuidelines } from '@/components/policy/CommunityGuidelines';
import { DMCAPolicy } from '@/components/policy/DMCAPolicy';
import { MonetizationPolicy } from '@/components/policy/MonetizationPolicy';
import { Web3Disclosures } from '@/components/policy/Web3Disclosures';
import { AIDisclosures } from '@/components/policy/AIDisclosures';
import { ContactSupport } from '@/components/policy/ContactSupport';
import { RefundPolicy } from '@/components/policy/RefundPolicy';
import { AccessibilityStatement } from '@/components/policy/AccessibilityStatement';
import { KYCPolicy } from '@/components/policy/KYCPolicy';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState('terms');

  // Get the tab from URL hash if present
  useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      }
    }
  });

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (typeof window !== 'undefined') {
      window.location.hash = key;
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <Link href="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Policies</Breadcrumb.Item>
      </Breadcrumb>

      <div className="mb-8">
        <Title level={1}>AVIE Policies</Title>
        <Paragraph style={{ color: 'var(--text-secondary)' }}>
          These policies govern your use of AVIE and outline our commitments to you. Please take the time to read them carefully.
        </Paragraph>
      </div>

      <Tabs 
        activeKey={activeTab}
        onChange={handleTabChange}
        tabPosition="left"
        className="policy-tabs"
        size="large"
      >
        <TabPane tab="Terms of Service" key="terms">
          <TermsOfService />
        </TabPane>
        
        <TabPane tab="Privacy Policy" key="privacy">
          <PrivacyPolicy />
        </TabPane>
        
        <TabPane tab="Community Guidelines" key="community">
          <CommunityGuidelines />
        </TabPane>
        
        <TabPane tab="DMCA / Copyright Policy" key="dmca">
          <DMCAPolicy />
        </TabPane>
        
        <TabPane tab="Monetization Policy" key="monetization">
          <MonetizationPolicy />
        </TabPane>
        
        <TabPane tab="Contact & Support" key="contact">
          <ContactSupport />
        </TabPane>
        
        <TabPane tab="Refund Policy" key="refund">
          <RefundPolicy />
        </TabPane>
        
        <TabPane tab="Web3 Disclosures" key="web3">
          <Web3Disclosures />
        </TabPane>
        
        <TabPane tab="AI Disclosures" key="ai">
          <AIDisclosures />
        </TabPane>
        
        <TabPane tab="Accessibility Statement" key="accessibility">
          <AccessibilityStatement />
        </TabPane>
        
        <TabPane tab="KYC / AML Policy" key="kyc">
          <KYCPolicy />
        </TabPane>
      </Tabs>
    </div>
  );
} 