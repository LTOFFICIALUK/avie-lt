import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function AccessibilityStatement() {
  return (
    <div className="policy-content">
      <Title level={2}>Accessibility Statement</Title>
      <Text type="secondary">Effective Date: 05/14/2025</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Last Updated: 05/14/2025</Text>

      <Paragraph>
        At AVIE, we are committed to ensuring that our platform is accessible to the widest possible audience, regardless of technology or ability. We believe that everyone should be able to engage with content, stream, and participate in our community in a barrier-free way.
      </Paragraph>

      <Title level={3}>1. Our Commitment to Accessibility</Title>
      <Paragraph>
        AVIE is actively working to comply with internationally recognized accessibility standards, including the:
      </Paragraph>
      <ul className="policy-list">
        <li>Web Content Accessibility Guidelines (WCAG) 2.1, Level AA</li>
        <li>Applicable regional accessibility laws, such as the ADA (Americans with Disabilities Act) in the U.S. and UK Equality Act 2010</li>
      </ul>
      <Paragraph>
        We regularly audit and improve our platform to support:
      </Paragraph>
      <ul className="policy-list">
        <li>Screen reader compatibility</li>
        <li>Keyboard-only navigation</li>
        <li>Color contrast and text legibility</li>
        <li>Clear and intuitive interfaces</li>
        <li>Captions and transcripts (where applicable)</li>
      </ul>

      <Title level={3}>2. Ongoing Improvements</Title>
      <Paragraph>
        Accessibility is a continuous process. We are:
      </Paragraph>
      <ul className="policy-list">
        <li>Conducting regular accessibility audits (manual and automated)</li>
        <li>Incorporating accessibility into our design and development workflows</li>
        <li>Training our team to prioritize inclusive design</li>
        <li>Ensuring new features are reviewed for accessibility compliance before release</li>
      </ul>

      <Title level={3}>3. Third-Party Content & Integrations</Title>
      <Paragraph>
        While we strive to ensure all areas of AVIE are accessible, some third-party services or plugins (e.g., embedded content, linked platforms) may not fully conform to our accessibility standards. We welcome feedback to improve wherever possible.
      </Paragraph>

      <Title level={3}>4. Feedback & Support</Title>
      <Paragraph>
        If you experience difficulty accessing any part of AVIE or have specific accessibility needs, please let us know. We value your feedback and aim to resolve issues promptly.
      </Paragraph>
      <Paragraph>
        Email: support@avie.live<br />
        Subject: "Accessibility Feedback – [Your Issue]"
      </Paragraph>
      <Paragraph>
        Please include:
      </Paragraph>
      <ul className="policy-list">
        <li>A description of the problem</li>
        <li>The page or feature where it occurred</li>
        <li>Your browser and operating system (if known)</li>
        <li>Any assistive technologies used</li>
      </ul>

      <Title level={3}>5. Formal Complaints & Escalation</Title>
      <Paragraph>
        If you're not satisfied with our response or believe we're not meeting accessibility requirements, you may escalate your concern to the appropriate authority in your region. We are committed to resolving accessibility issues fairly and quickly.
      </Paragraph>

      <Paragraph>
        <strong>AVIE is for everyone.</strong><br />
        We believe accessibility is not a feature — it's a right. Thank you for helping us build a more inclusive platform.
      </Paragraph>
    </div>
  );
} 