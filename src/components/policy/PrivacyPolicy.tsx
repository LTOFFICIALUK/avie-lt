import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function PrivacyPolicy() {
  return (
    <div className="policy-content">
      <Title level={2}>Privacy Policy</Title>
      <Text type="secondary">Effective Date: 05/14/2025</Text>
      
      <Paragraph>
        AVIE ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you access or use our website, platform, services, and features (collectively, the "Platform"). By using the Platform, you agree to the terms of this Privacy Policy.
      </Paragraph>

      <Title level={3}>1. Information We Collect</Title>
      <Paragraph>
        We may collect the following types of information:
      </Paragraph>
      
      <Title level={4}>a. Information You Provide to Us:</Title>
      <ul className="policy-list">
        <li>Account registration details (e.g., username, email address, phone number, profile photo, bio)</li>
        <li>Payment and payout information (e.g., wallet addresses, bank information, billing details)</li>
        <li>Content you upload or stream (e.g., videos, avatars, chat messages)</li>
        <li>User support requests and feedback</li>
      </ul>

      <Title level={4}>b. Information Collected Automatically:</Title>
      <ul className="policy-list">
        <li>IP address and geolocation</li>
        <li>Device type, OS, browser type, and device identifiers</li>
        <li>Activity logs (e.g., pages viewed, buttons clicked, time spent on pages)</li>
        <li>Stream viewing history, engagement data (likes, chats)</li>
        <li>Cookies, web beacons, and similar tracking technologies</li>
      </ul>

      <Title level={4}>c. Information from Third Parties:</Title>
      <ul className="policy-list">
        <li>Analytics providers</li>
        <li>Identity verification services (for KYC/AML compliance)</li>
        <li>Social media integrations (if you connect third-party accounts)</li>
      </ul>

      <Title level={3}>2. How We Use Your Information</Title>
      <Paragraph>
        We use your information to:
      </Paragraph>
      <ul className="policy-list">
        <li>Provide and maintain the Platform</li>
        <li>Process transactions and payouts</li>
        <li>Personalize content and recommendations</li>
        <li>Communicate with you (support, updates, marketing where permitted)</li>
        <li>Enforce platform safety and compliance (e.g., moderation, fraud prevention)</li>
        <li>Monitor and improve platform performance and user experience</li>
        <li>Comply with legal obligations (e.g., KYC, AML, tax, law enforcement requests)</li>
      </ul>

      <Title level={3}>3. Sharing Your Information</Title>
      <Paragraph>
        We may share your information with:
      </Paragraph>
      <ul className="policy-list">
        <li>Third-party service providers (e.g., cloud hosting, payment processors, identity verification services)</li>
        <li>Analytics and infrastructure partners</li>
        <li>Moderators and community management tools (for safety and enforcement)</li>
        <li>Legal authorities where required by law or to enforce our Terms of Service</li>
        <li>Affiliates and successors in the event of a business transition or acquisition</li>
      </ul>
      <Paragraph>
        We will never sell your personal information.
      </Paragraph>

      <Title level={3}>4. Your Rights and Choices</Title>
      <Paragraph>
        Depending on your jurisdiction, you may have the right to:
      </Paragraph>
      <ul className="policy-list">
        <li>Access and obtain a copy of your personal data</li>
        <li>Correct inaccurate or incomplete data</li>
        <li>Request deletion of your data</li>
        <li>Object to or restrict certain processing</li>
        <li>Withdraw consent (where applicable)</li>
      </ul>
      <Paragraph>
        To exercise these rights, please contact support@avie.live. We may verify your identity before fulfilling your request.
      </Paragraph>

      <Title level={3}>5. Cookies and Tracking Technologies</Title>
      <Paragraph>
        We use cookies and similar technologies to:
      </Paragraph>
      <ul className="policy-list">
        <li>Remember your preferences</li>
        <li>Analyze platform usage</li>
        <li>Enable core features (e.g., login, live chat)</li>
        <li>Personalize content and ads (if applicable)</li>
      </ul>
      <Paragraph>
        You can control cookie settings through your browser. For more, see our [Cookie Policy].
      </Paragraph>

      <Title level={3}>6. Data Retention</Title>
      <Paragraph>
        We retain your data only for as long as necessary to:
      </Paragraph>
      <ul className="policy-list">
        <li>Provide the Platform</li>
        <li>Fulfill contractual and legal obligations</li>
        <li>Resolve disputes and enforce our agreements</li>
        <li>Maintain platform integrity and safety</li>
      </ul>

      <Title level={3}>7. Data Security</Title>
      <Paragraph>
        We implement technical and organizational safeguards including:
      </Paragraph>
      <ul className="policy-list">
        <li>Encryption at rest and in transit</li>
        <li>Access control and role-based permissions</li>
        <li>Regular security audits</li>
        <li>Incident response protocols</li>
      </ul>
      <Paragraph>
        Despite these efforts, no system is 100% secure. Use the Platform at your own risk.
      </Paragraph>

      <Title level={3}>8. Children's Privacy</Title>
      <Paragraph>
        Our Platform is not intended for children under the age of 13. We do not knowingly collect personal data from users under 13. If we become aware of such data, we will delete it.
      </Paragraph>

      <Title level={3}>9. International Data Transfers</Title>
      <Paragraph>
        If you access the Platform from outside your country of residence, your information may be transferred to and stored in countries with different data protection laws. Where required, we implement Standard Contractual Clauses or other safeguards.
      </Paragraph>

      <Title level={3}>10. Changes to This Privacy Policy</Title>
      <Paragraph>
        We reserve the right to update this Privacy Policy from time to time. We will notify users of material changes via email or in-app notification. Continued use of the Platform after such changes constitutes your acceptance.
      </Paragraph>

      <Title level={3}>11. Contact Us</Title>
      <Paragraph>
        For questions or concerns about this policy:
      </Paragraph>
      <Paragraph>
        Email: support@avie.live
      </Paragraph>

      <Paragraph>
        This Privacy Policy ensures AVIE complies with GDPR, UK GDPR, CCPA, and other relevant data protection frameworks.
      </Paragraph>
    </div>
  );
} 