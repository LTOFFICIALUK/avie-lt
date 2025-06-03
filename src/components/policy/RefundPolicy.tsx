import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function RefundPolicy() {
  return (
    <div className="policy-content">
      <Title level={2}>AVIE Refund Policy</Title>
      <Text type="secondary">Effective Date: 05/14/2025</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Last Updated: 05/14/2025</Text>
      
      <Paragraph>
        AVIE provides creators and viewers with access to a range of paid features including subscriptions, donation tools, and premium plugins. This Refund Policy explains how refund requests are handled, when they apply, and any exceptions.
      </Paragraph>
      <Paragraph>
        By using AVIE and engaging with paid services, you agree to the terms below.
      </Paragraph>

      <Title level={3}>1. General Policy</Title>
      <Paragraph>
        AVIE operates on a no-refund policy for all digital goods and services, unless explicitly stated otherwise or required by law. This applies to:
      </Paragraph>
      <ul className="policy-list">
        <li>Plugin purchases or activations</li>
        <li>Viewer donations to creators</li>
        <li>Channel subscriptions or membership fees</li>
        <li>Creator token purchases</li>
      </ul>
      <Paragraph>
        All transactions are considered final once processed.
      </Paragraph>

      <Title level={3}>2. Donations</Title>
      <Paragraph>
        Donations made by viewers to creators are voluntary and non-refundable. These contributions:
      </Paragraph>
      <ul className="policy-list">
        <li>Are transferred directly to creators (minus applicable platform fees)</li>
        <li>Are not reversible unless due to a confirmed platform error or unauthorized transaction</li>
      </ul>
      <Paragraph>
        <strong>Important:</strong> If you believe your donation was made in error or via unauthorized access, please contact support@avie.live within 48 hours for review.
      </Paragraph>

      <Title level={3}>3. Plugins & Premium Features</Title>
      <Paragraph>
        Plugins and premium add-ons (such as Multistream, AI Character Generator, etc.) are digital services provided on a subscription or time-limited basis. Refunds will not be issued if:
      </Paragraph>
      <ul className="policy-list">
        <li>You forget to cancel before a renewal</li>
        <li>You no longer use or need the feature</li>
        <li>You purchased by mistake but accessed the service</li>
      </ul>
      <Paragraph>
        Contact our support team providing sufficient evidence within 72 hours of purchase if you believe a plugin is malfunctioning and refund may be warranted.
      </Paragraph>

      <Title level={3}>4. Chargebacks & Disputes</Title>
      <Paragraph>
        Filing a chargeback or payment dispute without first contacting our support team may result in:
      </Paragraph>
      <ul className="policy-list">
        <li>Immediate suspension of your AVIE account</li>
        <li>Forfeiture of any remaining plugin access or subscriptions</li>
        <li>Permanent loss of monetization privileges</li>
      </ul>
      <Paragraph>
        We encourage users to reach out to support@avie.live for resolution before pursuing disputes through payment providers.
      </Paragraph>

      <Title level={3}>5. Legal Compliance & Jurisdiction</Title>
      <Paragraph>
        Refund rights may vary by jurisdiction. Where required by local law, AVIE will comply with applicable refund regulations. EU/UK users may have specific rights under consumer protection laws.
      </Paragraph>

      <Title level={3}>6. Contact Us</Title>
      <Paragraph>
        If you have questions about this policy or believe you're eligible for a refund exception, please contact:
      </Paragraph>
      <Paragraph>
        Email: support@avie.live<br />
        Subject: "Refund Request – [Your Username]"
      </Paragraph>
      <Paragraph>
        Please include your transaction ID, date of purchase, and a detailed description of the issue.
      </Paragraph>

      <Paragraph>
        AVIE is committed to providing fair, transparent experiences for both creators and supporters. Thank you for helping us build a platform rooted in trust and mutual respect.
      </Paragraph>
    </div>
  );
} 