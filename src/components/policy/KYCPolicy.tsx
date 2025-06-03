import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function KYCPolicy() {
  return (
    <div className="policy-content">
      <Title level={2}>KYC / AML Policy</Title>
      <Text type="secondary">Updated: 05/14/2025</Text>

      <Paragraph>
        This Policy outlines AVIE's approach to Know Your Customer (KYC) and Anti-Money Laundering (AML) compliance. We are committed to preventing illegal activity on our platform while protecting user privacy and providing a seamless experience.
      </Paragraph>

      <Title level={3}>1. Purpose</Title>
      <Paragraph>
        AVIE implements KYC and AML procedures to:
      </Paragraph>
      <ul className="policy-list">
        <li>Prevent money laundering, terrorist financing, fraud, and other illicit activities</li>
        <li>Comply with applicable international AML laws and regulations</li>
        <li>Verify the identity of users engaged in significant financial transactions</li>
        <li>Protect the integrity of the AVIE ecosystem and its users</li>
      </ul>

      <Title level={3}>2. Scope</Title>
      <Paragraph>
        This policy applies to the following AVIE users:
      </Paragraph>
      <ul className="policy-list">
        <li>Users participating in the $AVIE token presale or acquiring tokens above certain thresholds</li>
        <li>Creators receiving financial benefits above specified thresholds</li>
        <li>Users engaged in high-value or high-frequency transactions</li>
        <li>Accounts flagged for suspicious activity or risk indicators</li>
      </ul>

      <Title level={3}>3. User Verification (KYC)</Title>
      <Paragraph>
        Depending on user activity and risk factors, AVIE may require varying levels of identity verification:
      </Paragraph>
      
      <Title level={4}>3.1 Basic Verification</Title>
      <ul className="policy-list">
        <li>Full legal name</li>
        <li>Date of birth</li>
        <li>Residential address</li>
        <li>Email verification</li>
        <li>Phone number verification</li>
      </ul>

      <Title level={4}>3.2 Enhanced Verification</Title>
      <ul className="policy-list">
        <li>Government-issued photo ID (passport, driver's license, or national ID card)</li>
        <li>Proof of address (utility bill, bank statement dated within 3 months)</li>
        <li>Selfie verification (photo of yourself holding your ID)</li>
        <li>Additional documentation as required based on risk assessment</li>
      </ul>

      <Paragraph>
        All KYC data is collected securely through a compliant third-party KYC provider. AVIE does not directly store copies of your identity documents.
      </Paragraph>

      <Title level={3}>4. AML Risk Controls</Title>
      <Paragraph>
        AVIE employs several methods to detect and prevent illicit activity:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Wallet Monitoring:</strong> Analysis of blockchain transactions to and from connected wallets for suspicious patterns</li>
        <li><strong>Transaction Tracking:</strong> Monitoring user activities for unusual patterns</li>
        <li><strong>Threshold Triggers:</strong> Additional verification requirements activated by transaction amounts or frequency</li>
        <li><strong>Geofencing:</strong> Restrictions for users in high-risk jurisdictions</li>
        <li><strong>Watchlist Screening:</strong> Checking user information against global sanctions lists, politically exposed persons (PEPs) databases, and other relevant watchlists</li>
      </ul>

      <Title level={3}>5. Enhanced Due Diligence (EDD)</Title>
      <Paragraph>
        Additional checks may be required for:
      </Paragraph>
      <ul className="policy-list">
        <li>Users from high-risk countries identified by FATF or other regulatory bodies</li>
        <li>Users with transaction patterns indicating potential money laundering risk</li>
        <li>Politically exposed persons (PEPs) and their close associates</li>
        <li>High-volume transactions that exceed standard thresholds</li>
      </ul>

      <Title level={3}>6. Data Privacy & Retention</Title>
      <ul className="policy-list">
        <li>All personal data collected for KYC/AML purposes is encrypted, stored securely, and protected in accordance with our Privacy Policy.</li>
        <li>KYC data is retained for at least five years after the end of the business relationship or as required by applicable law.</li>
        <li>Users have rights concerning their personal data as outlined in our Privacy Policy, including rights to access, correct, and delete data, subject to our legal obligations.</li>
      </ul>

      <Title level={3}>7. Prohibited Users</Title>
      <Paragraph>
        AVIE cannot provide services to:
      </Paragraph>
      <ul className="policy-list">
        <li>Individuals under 18 years of age</li>
        <li>Residents of countries subject to comprehensive sanctions or where cryptocurrency is prohibited</li>
        <li>Users who fail to complete required KYC procedures when prompted</li>
        <li>Users who provide false or fraudulent information during the verification process</li>
        <li>Users on global sanctions lists or involved in known illegal activities</li>
      </ul>

      <Title level={3}>8. Reporting Suspicious Activity</Title>
      <ul className="policy-list">
        <li>AVIE reserves the right to freeze funds, block access, or limit functionality where suspicious activity is detected.</li>
        <li>We may conduct internal investigations into suspicious transactions or user behavior.</li>
        <li>We will report suspicious activities to relevant authorities as required by law.</li>
        <li>Users are encouraged to report violations of our terms or suspicious activities to support@avie.live.</li>
      </ul>

      <Title level={3}>9. Compliance Officer & Oversight</Title>
      <Paragraph>
        AVIE maintains a dedicated Compliance Officer responsible for:
      </Paragraph>
      <ul className="policy-list">
        <li>Implementing and updating KYC/AML procedures</li>
        <li>Overseeing relationships with KYC/AML service providers</li>
        <li>Monitoring regulatory developments and ensuring compliance</li>
        <li>Conducting regular internal audits of compliance procedures</li>
        <li>Training relevant staff on KYC/AML requirements</li>
      </ul>

      <Title level={3}>10. Amendments</Title>
      <Paragraph>
        This policy may be updated from time to time to reflect regulatory changes, improved security practices, or platform evolution. Significant changes will be notified to users through appropriate channels.
      </Paragraph>

      <Paragraph>
        For questions regarding this policy or our KYC/AML procedures, please contact support@avie.live.
      </Paragraph>
    </div>
  );
} 