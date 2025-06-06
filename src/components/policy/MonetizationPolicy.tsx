import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function MonetizationPolicy() {
  return (
    <div className="policy-content">
      <Title level={2}>Monetization Policy</Title>
      <Text type="secondary">Effective Date: 05/14/2025</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Last Updated: 05/14/2025</Text>

      <Paragraph>
        AVIE empowers creators with utility-based tools and rewards including, but not limited to, AP Rewards, subscriptions, tipping, donations, and creator-specific access tokens that may grant fans special platform privileges, for the purpose of supporting creators on the platform. This policy outlines the terms and conditions for accessing, earning from, and withdrawing monetized revenue on the AVIE platform.
      </Paragraph>

      <Title level={3}>1. Eligibility for Monetization</Title>
      <Paragraph>
        To access monetization features, creators must:
      </Paragraph>
      <ul className="policy-list">
        <li>Be at least 18 years of age or the legal age of majority in their jurisdiction.</li>
        <li>Hold an active AVIE creator account in good standing.</li>
        <li>Complete required KYC (Know Your Customer) verification.</li>
        <li>Comply with AVIE's Terms of Service, Community Guidelines, and all local laws.</li>
        <li>Agree to applicable tax and payment terms outlined in this policy.</li>
      </ul>
      <Paragraph>
        AVIE reserves the right to approve, deny, or revoke monetization access at its discretion.
      </Paragraph>

      <Title level={3}>2. Payout Thresholds & Timelines</Title>
      <ul className="policy-list">
        <li><strong>Minimum Payout Threshold:</strong> AVIE does not impose a minimum payout threshold. Creators are eligible to receive earnings of any amount.</li>
        <li><strong>Payout Frequency:</strong> Payouts are processed instantly.</li>
        <li><strong>Payment Method:</strong> All platform transactions are processed through $SOL (Solana), $ETH (Ethereum) or $AVIE (AVIE's utility token) for technical purposes only. These payment mechanisms are used solely for platform functionality and not for investment purposes, and are sent directly to the primary wallet specified in the user's account settings.</li>
        <li><strong>Currency & Conversions:</strong> Users must ensure their linked wallet supports the technical standards required for AVIE platform operations. Digital assets received through AVIE should not be viewed as investments and carry no expectation of profit. No fiat currency conversions will be performed by AVIE.</li>
      </ul>

      <Title level={3}>3. Platform Fees</Title>
      <Paragraph>
        AVIE may deduct the following fees from gross creator earnings:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Transaction Processing Fee:</strong> A small fee may be applied to all transactions made on the platform.</li>
        <li><strong>Platform Service Fee:</strong> AVIE may retain up to 5% of creator revenue from subscriptions, donations, or other features. This fee is reinvested into maintaining and expanding the platform.</li>
      </ul>
      <Paragraph>
        Any applicable fees will be transparently displayed in your earnings dashboard.
      </Paragraph>

      <Title level={3}>4. Fraud Prevention & Chargebacks</Title>
      <ul className="policy-list">
        <li>AVIE implements advanced fraud monitoring systems to protect creators and the platform from malicious activity.</li>
        <li>All earnings are subject to fraud review.</li>
        <li>Repeated fraudulent activity (as determined by AVIE or its partners) may result in account suspension and earnings forfeiture.</li>
      </ul>

      <Title level={3}>5. Taxes and Reporting Obligations</Title>
      <ul className="policy-list">
        <li>Creators are responsible for all applicable tax obligations related to their earnings.</li>
        <li>AVIE does not withhold taxes unless required by law. You are responsible for accurate reporting and payment of any taxes owed.</li>
      </ul>

      <Title level={3}>6. Disqualification & Earnings Forfeiture</Title>
      <Paragraph>
        Creators may be disqualified from monetization and/or lose access to earnings if they:
      </Paragraph>
      <ul className="policy-list">
        <li>Violate AVIE's Terms of Service, Privacy Policy, or Community Guidelines.</li>
        <li>Engage in deceptive, fraudulent, or abusive behavior on or off-platform.</li>
        <li>Provide false or incomplete information.</li>
        <li>Fail KYC verifications.</li>
      </ul>
      <Paragraph>
        In such cases, AVIE may:
      </Paragraph>
      <ul className="policy-list">
        <li>Withhold any pending payouts.</li>
        <li>Terminate access to monetization features.</li>
        <li>Remove the creator's content and/or account.</li>
      </ul>

      <Title level={3}>7. Token Usage Requirements</Title>
      <ul className="policy-list">
        <li>Users are expressly prohibited from purchasing AVIE tokens or creator tokens for investment purposes. These digital assets are intended solely for enhancing platform experiences.</li>
        <li>AP (AVIE Points) are distributed through transparent, predetermined mechanisms based on platform engagement and creator support. The distribution is designed for fair access to platform features, not as an investment opportunity.</li>
      </ul>

      <Title level={3}>8. Updates and Amendments</Title>
      <Paragraph>
        AVIE reserves the right to amend this Monetization Policy at any time. Changes will be posted on our website, and continued use of monetization features indicates acceptance of the updated terms.
      </Paragraph>

      <Title level={3}>Support and Inquiries</Title>
      <Paragraph>
        For payout issues or monetization questions, please contact support@avie.live
      </Paragraph>
    </div>
  );
} 