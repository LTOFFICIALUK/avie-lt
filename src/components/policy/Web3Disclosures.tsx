import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function Web3Disclosures() {
  return (
    <div className="policy-content">
      <Title level={2}>Web3 Disclosures</Title>
      <Text type="secondary">Updated: 05/14/2025</Text>

      <Paragraph>
        AVIE integrates blockchain technology, cryptocurrency, and Web3 features into its platform. This disclosure document explains the risks and considerations for users engaging with these elements. Please read this information carefully before using these features.
      </Paragraph>

      <Title level={3}>1. Not Investment Advice</Title>
      <ul className="policy-list">
        <li>AVIE does not provide investment, financial, tax, or legal advice regarding cryptocurrencies, tokens, or any digital assets.</li>
        <li>Information shared about the $AVIE token or creator tokens on our platform is for informational purposes only.</li>
        <li>Users should consult qualified financial and legal professionals before making investment decisions related to any digital assets.</li>
      </ul>

      <Title level={3}>2. No Profit Guarantees</Title>
      <ul className="policy-list">
        <li>AVIE makes no guarantees about the future value, utility, or liquidity of any tokens or digital assets accessible through our platform.</li>
        <li>The value of cryptocurrencies and tokens can be highly volatile and may decrease significantly or become worthless.</li>
        <li>Past performance is not indicative of future results.</li>
      </ul>

      <Title level={3}>3. Risk Assumption</Title>
      <Paragraph>
        By using Web3 features on AVIE, you acknowledge and accept risks including but not limited to:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Price Volatility:</strong> Rapid and significant price fluctuations in cryptocurrencies and tokens</li>
        <li><strong>Technical Risks:</strong> Smart contract vulnerabilities, wallet security issues, or software bugs</li>
        <li><strong>Regulatory Uncertainty:</strong> Changes in laws or regulations that may adversely affect cryptocurrency usage or ownership</li>
        <li><strong>Liquidity Risk:</strong> Difficulty converting tokens to other currencies or cash at desired times or prices</li>
        <li><strong>Loss of Access:</strong> Potential to lose access to tokens due to lost private keys or wallet credentials</li>
        <li><strong>Protocol Changes:</strong> Underlying blockchain protocols may undergo changes that affect token functionality</li>
      </ul>

      <Title level={3}>4. Regional Restrictions</Title>
      <ul className="policy-list">
        <li>Web3 features may not be available in all countries or regions due to local regulations.</li>
        <li>Users are responsible for ensuring their use of AVIE's Web3 features complies with applicable laws in their jurisdiction.</li>
        <li>AVIE may geo-restrict certain functionality based on regulatory requirements.</li>
      </ul>

      <Title level={3}>5. Platform Utility Focus</Title>
      <ul className="policy-list">
        <li>AVIE tokens and creator tokens on our platform are primarily designed for utility within the AVIE ecosystem.</li>
        <li>These tokens provide access to features, benefits, or content rather than representing ownership in AVIE or its creators.</li>
        <li>The primary purpose of these tokens is platform engagement, not speculation or investment.</li>
      </ul>

      <Title level={3}>6. Wallet Security</Title>
      <ul className="policy-list">
        <li>Users are responsible for maintaining the security of their own wallet credentials and private keys.</li>
        <li>AVIE cannot recover lost private keys or restore access to wallets that users lose access to.</li>
        <li>We recommend using hardware wallets or other secure storage methods for significant holdings.</li>
      </ul>

      <Title level={3}>7. Transaction Finality</Title>
      <ul className="policy-list">
        <li>Blockchain transactions are generally irreversible once confirmed.</li>
        <li>AVIE cannot reverse, cancel, or refund most blockchain transactions.</li>
        <li>Users should verify all transaction details carefully before confirming.</li>
      </ul>

      <Title level={3}>8. Third-Party Services</Title>
      <ul className="policy-list">
        <li>AVIE may integrate with third-party wallets, exchanges, or other Web3 services.</li>
        <li>We do not control or take responsibility for the actions, policies, or reliability of these third parties.</li>
        <li>Users engage with these services at their own risk.</li>
      </ul>

      <Title level={3}>9. Tokenomics Transparency</Title>
      <ul className="policy-list">
        <li>Information about token distributions, vesting schedules, and allocations is available through our official channels.</li>
        <li>AVIE aims to provide transparency regarding token economics while respecting business confidentiality requirements.</li>
      </ul>

      <Title level={3}>10. Regulatory Compliance</Title>
      <ul className="policy-list">
        <li>AVIE implements measures aimed at compliance with applicable laws, including KYC/AML procedures where required.</li>
        <li>Users must provide accurate information when participating in regulated activities.</li>
        <li>We may modify our offerings to comply with evolving regulations.</li>
      </ul>

      <Title level={3}>11. User Acknowledgment</Title>
      <Paragraph>
        By using Web3 features on AVIE, you acknowledge:
      </Paragraph>
      <ul className="policy-list">
        <li>You have read and understood these disclosures</li>
        <li>You have sufficient knowledge about blockchain technology, cryptocurrencies, and associated risks</li>
        <li>You are using these features voluntarily and at your own risk</li>
        <li>You will comply with all applicable laws in your jurisdiction</li>
      </ul>

      <Paragraph>
        AVIE is committed to responsible innovation in the Web3 space. If you have questions about our Web3 features or this disclosure, please contact support@avie.live.
      </Paragraph>
    </div>
  );
} 