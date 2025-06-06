import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function Web3Disclosures() {
  return (
    <div className="policy-content">
      <Title level={2}>Web3-Specific Disclosures</Title>
      <Text type="secondary">Effective Date: 05/14/2025</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Last Updated: 05/14/2025</Text>

      <Paragraph>
        AVIE may offer features that incorporate blockchain technology, including creator tokens, NFTs and NFT tools, and AP rewards. While these features empower creators and communities through new forms of participation and engagement, they also carry specific risks. This policy outlines disclosures for users participating in any Web3-based feature on AVIE.
      </Paragraph>

      <Title level={3}>1. Not Investment Advice</Title>
      <ul className="policy-list">
        <li>Nothing on the AVIE platform constitutes financial, investment, legal, or tax advice.</li>
        <li>AVIE tokens, creator tokens, AP Rewards, and NFTs are utility tools designed exclusively for platform access, creator support, and community participation within the AVIE ecosystem. They may offer access to:
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Gated content and creator experiences</li>
            <li>Watch-to-Earn participation</li>
            <li>Community voting or governance on select platform features</li>
            <li>Creator recognition and fan support</li>
          </ul>
        </li>
        <li>They are not financial securities, derivatives, or speculative assets and have no value outside the AVIE platform.</li>
        <li>Users are encouraged to conduct their own due diligence and consult with a licensed financial advisor before engaging in any purchase.</li>
      </ul>

      <Title level={3}>2. No Guarantee of Profit or Return</Title>
      <ul className="policy-list">
        <li>AVIE explicitly states that platform tokens, AP Rewards and creator tokens will not appreciate in value and should never be acquired for speculative or investment purposes.</li>
        <li>Tokens, AP and NFTs on AVIE serve functional purposes only, such as accessing content, participating in communities, and supporting creators you enjoy. These digital assets have no value beyond their functional utility on the platform.</li>
        <li>Digital assets on AVIE are tools for platform engagement and are not offered as financial products, investment vehicles, or with any promise of future value. These digital assets have no inherent monetary value outside the AVIE platform and should not be acquired with any expectation of financial return or future resale value.</li>
      </ul>

      <Title level={3}>3. Assumption of Risk</Title>
      <Paragraph>
        By participating in Web3 features on AVIE, users acknowledge and accept the following risks:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Volatility:</strong> Token and NFT values may fluctuate significantly and unpredictably.</li>
        <li><strong>Loss:</strong> Digital assets may be lost due to wallet errors, lost keys, unauthorized access, smart contract bugs, or third-party platform failure.</li>
        <li><strong>Regulatory Impact:</strong> Future legal or regulatory changes may affect your ability to hold or use these assets.</li>
        <li><strong>Network Congestion or Failure:</strong> Blockchain transactions may be delayed or disrupted due to high traffic, chain reorgs, or system failures.</li>
      </ul>

      <Title level={3}>4. Regional & Jurisdictional Restrictions</Title>
      <Paragraph>
        Access to Web3 features (e.g., creator tokens, rewards, presales, airdrops) may be restricted based on your jurisdiction:
      </Paragraph>
      <ul className="policy-list">
        <li>Users must comply with all local laws and are solely responsible for determining if participation in AVIE's blockchain features is legal in their country or region.</li>
        <li><strong>U.S. Residents:</strong> AVIE's features are not intended to constitute securities under U.S. law. AVIE does not solicit participation in token offerings from U.S. persons in jurisdictions where doing so would violate federal or state law.</li>
        <li><strong>UK/EU Residents:</strong> AVIE complies with the applicable local digital asset and consumer protection laws.</li>
        <li>AVIE may geoblock or limit access to certain features based on regulatory considerations.</li>
      </ul>

      <Title level={3}>5. Platform Utility vs. Speculation</Title>
      <Paragraph>
        AVIE tokens, AP Rewards, creator tokens, and NFTs are utility tools designed exclusively for platform access, creator support, and community participation within the AVIE ecosystem. They offer may access to:
      </Paragraph>
      <ul className="policy-list">
        <li>Gated content and creator experiences</li>
        <li>Watch-to-Earn participation</li>
        <li>Community voting or governance on select platform features</li>
        <li>Creator recognition and fan support</li>
      </ul>
      <Paragraph>
        They are not designed, marketed, or intended to be financial securities, derivatives, or speculative assets.
      </Paragraph>

      <Title level={3}>6. Compliance and Ongoing Evaluation</Title>
      <ul className="policy-list">
        <li>AVIE continuously monitors developments in regulatory guidance and law related to digital assets.</li>
        <li>We reserve the right to modify or suspend token-related features to comply with applicable regulations.</li>
        <li>Users are responsible for remaining informed of the laws governing digital assets in their own jurisdiction.</li>
      </ul>

      <Title level={3}>7. Acknowledgment and Acceptance</Title>
      <Paragraph>
        By using AVIE's token or NFT features, or participating in tasks that may earn AP Rewards, users agree to:
      </Paragraph>
      <ul className="policy-list">
        <li>Accept the risks outlined in this policy</li>
        <li>Waive any claims against AVIE for losses related to tokens, AP Rewards or NFT value fluctuation or technical issues</li>
        <li>Use these features in accordance with all applicable laws and AVIE's Terms of Service</li>
      </ul>

      <Title level={3}>Need Help or Have Questions?</Title>
      <Paragraph>
        📧 Contact us at support@avie.live
      </Paragraph>
    </div>
  );
} 