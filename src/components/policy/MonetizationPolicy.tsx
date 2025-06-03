import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function MonetizationPolicy() {
  return (
    <div className="policy-content">
      <Title level={2}>Monetization Policy</Title>
      <Text type="secondary">Updated: 05/14/2025</Text>

      <Paragraph>
        AVIE is committed to empowering creators through multiple monetization streams while maintaining platform integrity. This policy outlines the guidelines, requirements, and restrictions for monetization on AVIE.
      </Paragraph>

      <Title level={3}>1. Eligibility for Monetization</Title>
      <Paragraph>
        To qualify for monetization features on AVIE, creators must meet the following criteria:
      </Paragraph>
      <ul className="policy-list">
        <li>Maintain an active AVIE account in good standing for at least 14 days.</li>
        <li>Complete identity verification if required by your region or if accessing certain features.</li>
        <li>Comply with all platform Terms of Service and Community Guidelines.</li>
        <li>Have no active violations or restrictions on your account.</li>
        <li>Meet feature-specific requirements as outlined below.</li>
      </ul>

      <Title level={3}>2. Platform Monetization Features</Title>
      
      <Title level={4}>2.1 Attention Points (AP) & Rewards</Title>
      <ul className="policy-list">
        <li>AP is earned by fans for consistent engagement and can be redeemed for stream boosting, channel perks, and more.</li>
        <li>Creators can design custom AP rewards and perks for their community.</li>
        <li>AVIE reserves the right to adjust AP earning rates, redemption options, or program structure with notice to users.</li>
      </ul>

      <Title level={4}>2.2 Direct Viewer Support</Title>
      <ul className="policy-list">
        <li>Viewers may support creators via channel subscriptions, gifted subscriptions, and one-time donations.</li>
        <li>AVIE retains a share of subscription and donation revenue as outlined in our fee schedule.</li>
        <li>Creators must have completed tax information before receiving payouts.</li>
      </ul>

      <Title level={4}>2.3 Creator Token Ecosystem</Title>
      <ul className="policy-list">
        <li>Eligible creators may launch creator tokens on the platform after completing enhanced verification.</li>
        <li>Creator tokens must have clearly defined utility within the AVIE ecosystem.</li>
        <li>All token launches, trading, and utility implementations must comply with applicable securities laws and regulations.</li>
      </ul>

      <Title level={4}>2.4 Advertising Program</Title>
      <ul className="policy-list">
        <li>Eligible creators may opt into the AVIE Advertising Program to earn additional revenue.</li>
        <li>Creators have control over ad placement, frequency, and categories displayed in their content.</li>
        <li>Specific advertising settings may be available based on creator tier and platform standing.</li>
      </ul>

      <Title level={4}>2.5 Premium Content</Title>
      <ul className="policy-list">
        <li>Creators can designate streams, videos, or other content as premium, requiring subscription, tokens, or one-time purchase for access.</li>
        <li>All premium content must adhere to Community Guidelines and Terms of Service.</li>
        <li>Age restrictions and content ratings must be accurately applied to premium content.</li>
      </ul>

      <Title level={3}>3. Payout Terms</Title>
      <Paragraph>
        The following terms apply to all monetization payouts on AVIE:
      </Paragraph>
      <ul className="policy-list">
        <li>Minimum payout threshold is $50 USD equivalent.</li>
        <li>Payment processing occurs monthly for eligible balances.</li>
        <li>Creators must provide all required tax documentation before receiving payouts.</li>
        <li>Multiple payout methods are available, including bank transfer, crypto wallets, and select payment processors.</li>
        <li>Transaction fees vary by payout method and are deducted from the payout amount.</li>
      </ul>

      <Title level={3}>4. Prohibited Monetization Activities</Title>
      <Paragraph>
        The following activities are prohibited and may result in demonetization, suspension, or account termination:
      </Paragraph>
      <ul className="policy-list">
        <li>Creating artificial engagement to manipulate monetization metrics (e.g., view botting, fake accounts).</li>
        <li>Selling or promoting products/services that violate our Terms of Service or Community Guidelines.</li>
        <li>Misrepresenting the value or utility of creator tokens or digital goods.</li>
        <li>Soliciting donations under false pretenses or for misrepresented causes.</li>
        <li>Offering or soliciting services that circumvent platform fees or violate platform policies.</li>
        <li>Promoting unregistered securities offerings or making misleading investment promises.</li>
      </ul>

      <Title level={3}>5. Taxes & Compliance</Title>
      <Paragraph>
        AVIE creators are responsible for:
      </Paragraph>
      <ul className="policy-list">
        <li>Providing accurate tax information to AVIE as required by applicable laws.</li>
        <li>Reporting income earned through AVIE to relevant tax authorities.</li>
        <li>Complying with all applicable laws related to online earnings, including digital assets where applicable.</li>
        <li>Following disclosure requirements for sponsored content or paid promotions as required by law.</li>
      </ul>

      <Title level={3}>6. Dispute Resolution</Title>
      <ul className="policy-list">
        <li>Disputes regarding payments, fees, or monetization features should be submitted to support@avie.live.</li>
        <li>AVIE will review disputes and respond within 10 business days.</li>
        <li>For issues related to viewer payments, both parties may be contacted for resolution.</li>
      </ul>

      <Title level={3}>7. Amendments to Monetization Terms</Title>
      <Paragraph>
        AVIE reserves the right to modify monetization features, eligibility requirements, fee structures, and other aspects of this policy. Significant changes will be communicated to creators with reasonable notice before implementation.
      </Paragraph>

      <Paragraph>
        By utilizing AVIE's monetization features, you acknowledge and agree to the terms outlined in this policy. For additional questions about monetization on AVIE, please contact support@avie.live.
      </Paragraph>
    </div>
  );
} 