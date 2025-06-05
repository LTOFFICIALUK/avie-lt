"use client";
import { useState } from 'react';
import { Tabs, Typography, Breadcrumb } from 'antd';
import Link from 'next/link';
import { Navigation } from "../../components/landing/Navigation";
import { Footer } from "../../components/footer/Footer";
import { CommunityHero } from "../../components/landing/CommunityHero";
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
import {
  FileTextOutlined,
  SafetyOutlined,
  HeartOutlined,
  MailOutlined,
} from "@ant-design/icons";

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

  const handleContactSupport = () => {
    setActiveTab('contact');
    if (typeof window !== 'undefined') {
      window.location.hash = 'contact';
    }
  };

  const handleCommunityGuidelines = () => {
    setActiveTab('community');
    if (typeof window !== 'undefined') {
      window.location.hash = 'community';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <Navigation />

      <main className="overflow-x-hidden pt-12 md:pt-14 lg:pt-16 relative">
        {/* Extended Background Gradients for entire page */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
        
        {/* Background Pattern for entire page */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"></div>
        </div>

        {/* Policy Content Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[1200px] mx-auto">
            <Breadcrumb className="mb-6">
              <Breadcrumb.Item>
                <Link href="/">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Policies</Breadcrumb.Item>
            </Breadcrumb>

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
        </section>
      </main>

      <Footer />
    </div>
  );
} 