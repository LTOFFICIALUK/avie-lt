import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function ContactSupport() {
  return (
    <div className="policy-content">
      <Title level={2}>AVIE Contact & Support Policy</Title>
      <Text type="secondary">Updated: 05/14/2025</Text>

      <Paragraph>
        This policy outlines how users can contact the AVIE team for support, what to expect in terms of response times, and guidelines for effective communication. Our goal is to provide timely, helpful assistance while maintaining a sustainable support ecosystem for our growing community.
      </Paragraph>

      <Title level={3}>1. How to Reach Us</Title>
      <Paragraph>
        AVIE offers the following contact methods for different types of inquiries:
      </Paragraph>
      
      <Title level={4}>1.1 Email Support</Title>
      <ul className="policy-list">
        <li><strong>General Support:</strong> support@avie.live - For account issues, technical problems, and general platform questions.</li>
        <li><strong>Copyright/DMCA:</strong> copyright@avie.live - For copyright infringement reports and counter-notices.</li>
        <li><strong>Privacy Concerns:</strong> privacy@avie.live - For data protection requests and privacy-related inquiries.</li>
        <li><strong>Creator Program:</strong> creators@avie.live - For creator-specific inquiries and program applications.</li>
        <li><strong>Business Inquiries:</strong> business@avie.live - For partnerships, advertising, and business development.</li>
      </ul>

      <Title level={4}>1.2 Community Support</Title>
      <ul className="policy-list">
        <li><strong>Discord Community:</strong> Join our Discord server for peer support and community manager assistance.</li>
        <li><strong>Telegram Channel:</strong> Follow our announcements and access support volunteers through our Telegram channel.</li>
      </ul>

      <Title level={3}>2. Response Time Goals</Title>
      <Paragraph>
        Our team strives to respond to inquiries as quickly as possible. Here's what you can expect:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Email Inquiries:</strong> We aim to respond to all support emails within 48 hours during weekdays. Complex issues may take up to 5 business days for a full resolution.</li>
        <li><strong>Community Channels:</strong> Community managers typically monitor Discord and Telegram during business hours and aim to respond within 24 hours.</li>
        <li><strong>High-Priority Issues:</strong> Security concerns, system-wide errors, and payment problems receive expedited handling.</li>
      </ul>

      <Title level={3}>3. Support Hours</Title>
      <Paragraph>
        The AVIE support team operates during the following hours:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Monday-Friday:</strong> 9:00 AM – 6:00 PM PT (Pacific Time)</li>
        <li><strong>Weekends & Holidays:</strong> Limited coverage for urgent issues</li>
      </ul>
      <Paragraph>
        While we may respond to inquiries outside these hours, especially for critical matters, most requests will be addressed during regular business hours.
      </Paragraph>

      <Title level={3}>4. What We Can Help With</Title>
      <Paragraph>
        Our support team can assist with:
      </Paragraph>
      <ul className="policy-list">
        <li>Technical issues related to streaming, viewing, or platform functionality</li>
        <li>Account access problems and security concerns</li>
        <li>Questions about features, monetization, or platform policies</li>
        <li>Reports of content violations or abusive behavior</li>
        <li>Token and wallet-related inquiries</li>
        <li>Creator onboarding and program information</li>
      </ul>

      <Title level={3}>5. What We Can't Guarantee</Title>
      <ul className="policy-list">
        <li>24/7 live chat support is not currently available</li>
        <li>Phone support is not offered at this time</li>
        <li>We cannot provide financial or legal advice</li>
        <li>We may not be able to address feature requests or bugs immediately</li>
        <li>Support for third-party integrations may be limited to basic troubleshooting</li>
      </ul>

      <Title level={3}>6. Support Best Practices</Title>
      <Paragraph>
        To help us assist you more efficiently, please:
      </Paragraph>
      <ul className="policy-list">
        <li>Provide your AVIE username or wallet address when applicable</li>
        <li>Be specific about the issue, including when it occurred and what steps led to it</li>
        <li>Include screenshots or screen recordings when possible</li>
        <li>Mention your device, browser, and operating system information for technical issues</li>
        <li>Check our Help Center first, as many common questions are answered there</li>
        <li>Remain respectful and patient with support staff</li>
      </ul>

      <Title level={3}>7. Escalation Process</Title>
      <Paragraph>
        If your issue hasn't been resolved satisfactorily through standard support channels:
      </Paragraph>
      <ul className="policy-list">
        <li>Reply to your existing support email thread and request escalation</li>
        <li>Provide any additional information that might help resolve your issue</li>
        <li>A senior support team member will review your case within 3 business days</li>
      </ul>

      <Title level={3}>8. Abuse of Support Services</Title>
      <Paragraph>
        We value respectful communication. Users who engage in abusive behavior toward support staff, submit excessive frivolous requests, or otherwise abuse support channels may face limited access to support services or account restrictions.
      </Paragraph>

      <Title level={3}>9. Need Immediate Help?</Title>
      <Paragraph>
        For urgent security issues that cannot wait for standard response times, email support@avie.live with "URGENT:" in the subject line, clearly explaining the security impact.
      </Paragraph>

      <Paragraph>
        We continuously work to improve our support systems and appreciate your feedback on how we can better serve our community. Thank you for being part of AVIE!
      </Paragraph>
    </div>
  );
} 