import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function ContactSupport() {
  return (
    <div className="policy-content">
      <Title level={2}>AVIE Contact & Support Policy</Title>
      <Text type="secondary">Effective Date: 05/14/2025</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Last Updated: 05/14/2025</Text>

      <Paragraph>
        We're committed to providing timely, respectful, and helpful support for all members of the AVIE community — whether you're a viewer, creator, or early token supporter. This policy outlines how to contact us, what to expect in terms of response times, and our support coverage.
      </Paragraph>

      <Title level={3}>1. How to Reach Us</Title>
      <Paragraph>
        You can contact the AVIE team through the following channels:
      </Paragraph>
      
      <Title level={4}>Email Support</Title>
      <ul className="policy-list">
        <li>All inquiries: support@avie.live</li>
      </ul>

      <Title level={4}>Community Support</Title>
      <ul className="policy-list">
        <li>Join our official Discord server and use the #support channel to ask questions or report issues.</li>
        <li>Telegram community support is also available at https://t.me/+Ng4-vF6UAFE2NWE0.</li>
      </ul>

      <Title level={3}>2. Response Time Goals</Title>
      <Paragraph>
        We aim to respond to most support inquiries within the following timeframes:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Email inquiries:</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Within 48 hours on weekdays</li>
            <li>Complex issues (e.g., account recovery, platform bugs) may take up to 5 business days</li>
          </ul>
        </li>
        <li><strong>Community channels (Discord/Telegram):</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Typically within 24 hours, often sooner during active hours</li>
          </ul>
        </li>
      </ul>
      <Paragraph>
        Please note that during major platform launches, presale windows, or community events, response times may be longer.
      </Paragraph>

      <Title level={3}>3. Support Hours</Title>
      <Paragraph>
        Our support team is available during the following hours:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Monday to Friday</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>9:00 AM – 6:00 PM (PT / Pacific Time time)</li>
          </ul>
        </li>
        <li><strong>Weekends & Holidays</strong>
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Limited coverage; urgent issues may be addressed, but general inquiries may be delayed</li>
          </ul>
        </li>
      </ul>

      <Title level={3}>4. What We Can Help With</Title>
      <ul className="policy-list">
        <li>Technical issues (login problems, platform bugs, feature glitches)</li>
        <li>Questions about features, tools, or account setup</li>
        <li>Report content violations or suspicious behavior</li>
        <li>Inquiries about presale participation or token migration</li>
        <li>Creator onboarding & setup assistance</li>
      </ul>

      <Title level={3}>5. What We Can't Guarantee</Title>
      <ul className="policy-list">
        <li>Real-time 24/7 live chat support (yet)</li>
        <li>Financial, tax, or legal advice</li>
        <li>Token price projections or investment recommendations</li>
      </ul>

      <Title level={3}>6. Support Best Practices</Title>
      <Paragraph>
        To help us assist you faster:
      </Paragraph>
      <ul className="policy-list">
        <li>Include your AVIE username or wallet address (if relevant)</li>
        <li>Be specific about the issue (screenshots or error messages help)</li>
        <li>Avoid sharing personal passwords or sensitive information in public chats</li>
      </ul>

      <Title level={3}>Need Immediate Help?</Title>
      <Paragraph>
        If you are experiencing a serious security issue (e.g., suspected account compromise), email support@avie.live with "URGENT:" followed by a short description of your issue in the subject line.
      </Paragraph>

      <Paragraph>
        We're here to support your journey on AVIE — thank you for building this platform with us.
        Stay creative, stay secure.
      </Paragraph>
    </div>
  );
} 