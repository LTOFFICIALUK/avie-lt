import React, { useState } from 'react';
import { Tabs } from 'antd';
import { useMediaQuery } from 'react-responsive';
import PageHeader from '../ui/PageHeader';
import { TermsOfService } from './TermsOfService';
import { PrivacyPolicy } from './PrivacyPolicy';
import { CommunityGuidelines } from './CommunityGuidelines';
import { DMCAPolicy } from './DMCAPolicy';
import { MonetizationPolicy } from './MonetizationPolicy';
import { Web3Disclosures } from './Web3Disclosures';
import { AIDisclosures } from './AIDisclosures';
import { ContactSupport } from './ContactSupport';
import { RefundPolicy } from './RefundPolicy';
import { KYCPolicy } from './KYCPolicy';
import { AccessibilityStatement } from './AccessibilityStatement';
import { LawEnforcementPolicy } from './LawEnforcementPolicy';

const Policy: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Scroll to top when changing tabs
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <PageHeader title="AVIE Policies" />
      
      <div className="mt-6 mb-12">
        <Tabs
          tabPosition={isMobile ? "top" : "left"}
          activeKey={activeTab}
          onChange={handleTabChange}
          className="policy-tabs"
          items={[
            {
              key: '1',
              label: 'Terms of Service',
              children: <TermsOfService />
            },
            {
              key: '2',
              label: 'Privacy Policy',
              children: <PrivacyPolicy />
            },
            {
              key: '3',
              label: 'Community Guidelines',
              children: <CommunityGuidelines />
            },
            {
              key: '4',
              label: 'DMCA/Copyright Policy',
              children: <DMCAPolicy />
            },
            {
              key: '5',
              label: 'Monetization Policy',
              children: <MonetizationPolicy />
            },
            {
              key: '6',
              label: 'Law Enforcement',
              children: <LawEnforcementPolicy />
            },
            {
              key: '7',
              label: 'Web3 Disclosures',
              children: <Web3Disclosures />
            },
            {
              key: '8',
              label: 'AI Disclosures',
              children: <AIDisclosures />
            },
            {
              key: '9',
              label: 'Contact & Support',
              children: <ContactSupport />
            },
            {
              key: '10',
              label: 'Refund Policy',
              children: <RefundPolicy />
            },
            {
              key: '11',
              label: 'KYC / AML Policy',
              children: <KYCPolicy />
            },
            {
              key: '12',
              label: 'Accessibility',
              children: <AccessibilityStatement />
            }
          ]}
        />
      </div>
    </div>
  );
};

export default Policy; 