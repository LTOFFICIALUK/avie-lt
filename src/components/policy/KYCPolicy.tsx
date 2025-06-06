import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function KYCPolicy() {
  return (
    <div className="policy-content">
      <Title level={2}>KYC / AML Policy</Title>
      <Text type="secondary">Effective Date: 05/14/2025</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Last Updated: 05/14/2025</Text>

      <Paragraph>
        AVIE is committed to the highest standards of Anti-Money Laundering (AML) compliance and Know Your Customer (KYC) procedures to protect our users, ensure platform integrity, and comply with applicable laws and regulations. This policy outlines how AVIE implements KYC and AML protocols for platform participants.
      </Paragraph>

      <Title level={3}>1. Purpose</Title>
      <Paragraph>
        The purpose of this policy is to:
      </Paragraph>
      <ul className="policy-list">
        <li>Prevent the use of AVIE for money laundering, terrorism financing, fraud, crypto scams, and other illicit activity</li>
        <li>Ensure compliance with international AML laws, including those of the U.S., UK, EU, and other applicable jurisdictions</li>
        <li>Verify the identity of users participating in financial transactions, including token presales, donations, and payouts</li>
        <li>Protect the AVIE ecosystem and its community from bad actors</li>
      </ul>

      <Title level={3}>2. Scope</Title>
      <Paragraph>
        This policy may apply to:
      </Paragraph>
      <ul className="policy-list">
        <li>Users participating in the $AVIE token presale</li>
        <li>Users or creators receiving AP Rewards, tips, subscriptions, or plugin revenue</li>
        <li>Users accessing platform features with financial value</li>
        <li>Any wallet address, account, or entity flagged for suspicious behavior or compliance risk</li>
      </ul>

      <Title level={3}>3. User Verification (KYC)</Title>
      <Paragraph>
        Users subject to KYC must provide the following:
      </Paragraph>
      <ul className="policy-list">
        <li>Full legal name</li>
        <li>Date of birth</li>
        <li>Government-issued ID (passport, national ID, or driver's license)</li>
        <li>Proof of address (utility bill, bank statement, or official document issued within the last 3 months)</li>
        <li>Selfie verification (for facial recognition where applicable)</li>
      </ul>
      <Paragraph>
        All KYC information is securely collected through a third-party KYC provider compliant with industry standards and local regulations (e.g., GDPR, CCPA, UK DPA 2018).
      </Paragraph>

      <Title level={3}>4. AML Risk Controls</Title>
      <Paragraph>
        AVIE uses both automated and manual methods to detect and prevent illicit activity:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Wallet monitoring:</strong> Analysis of wallet history and behavior using blockchain analytics tools</li>
        <li><strong>Transaction tracking:</strong> Pattern analysis for donations, tips, or purchases that indicate unusual behavior</li>
        <li><strong>Geofencing:</strong> Restricted access to users in sanctioned jurisdictions (e.g., North Korea, Iran)</li>
        <li><strong>Watchlists:</strong> Screening against global sanction and PEP (Politically Exposed Person) lists</li>
      </ul>

      <Title level={3}>5. Enhanced Due Diligence (EDD)</Title>
      <Paragraph>
        In certain cases, additional checks may be required:
      </Paragraph>
      <ul className="policy-list">
        <li>High-volume creators or users with significant earnings</li>
        <li>Users flagged by transaction behavior or third-party risk signals</li>
        <li>Jurisdictions deemed high-risk by FATF or regulatory authorities</li>
        <li>Community reports of suspicious or fraudulent activity</li>
      </ul>
      <Paragraph>
        EDD may include additional documentation, background checks, or source-of-funds validation.
      </Paragraph>

      <Title level={3}>6. Data Privacy & Retention</Title>
      <ul className="policy-list">
        <li>All personal data collected under KYC is encrypted and stored securely in accordance with our Privacy Policy.</li>
        <li>KYC records are retained for at least 5 years after account closure or last activity, as required by applicable AML laws.</li>
        <li>Users have rights under GDPR and UK GDPR to access or delete their data, except where we are legally required to retain it.</li>
      </ul>

      <Title level={3}>7. Prohibited Users</Title>
      <Paragraph>
        AVIE does not permit platform access or financial transactions from:
      </Paragraph>
      <ul className="policy-list">
        <li>Users under the age of 18</li>
        <li>Users from sanctioned or restricted jurisdictions</li>
        <li>Users who fail to complete KYC when required</li>
        <li>Wallets or individuals flagged for money laundering, fraud, or terrorism financing</li>
      </ul>
      <Paragraph>
        We reserve the right to block, suspend, or terminate such users without notice.
      </Paragraph>

      <Title level={3}>8. Reporting Suspicious Activity</Title>
      <Paragraph>
        If AVIE detects or is notified of suspicious behavior, we may:
      </Paragraph>
      <ul className="policy-list">
        <li>Freeze associated funds or wallet addresses</li>
        <li>Conduct an internal investigation</li>
        <li>Submit a Suspicious Activity Report (SAR) to appropriate authorities</li>
        <li>Cooperate with law enforcement agencies</li>
      </ul>
      <Paragraph>
        Users may report suspected AML or KYC violations by emailing compliance@avie.live.
      </Paragraph>

      <Title level={3}>9. Compliance Officer & Oversight</Title>
      <Paragraph>
        AVIE has appointed a dedicated Compliance Officer responsible for:
      </Paragraph>
      <ul className="policy-list">
        <li>Ensuring ongoing KYC/AML implementation</li>
        <li>Maintaining relationships with KYC vendors and regulators</li>
        <li>Monitoring changes to applicable law and updating this policy</li>
        <li>Conducting internal audits and compliance training</li>
      </ul>

      <Title level={3}>10. Amendments</Title>
      <Paragraph>
        This policy may be updated as needed to reflect changes in legal requirements, technology, or risk. Any changes will be posted on this page with a revised effective date.
      </Paragraph>

      <Paragraph>
        By using AVIE, you agree to comply with this KYC / AML Policy.<br />
        If you have any questions please contact support@avie.live.
      </Paragraph>
    </div>
  );
} 