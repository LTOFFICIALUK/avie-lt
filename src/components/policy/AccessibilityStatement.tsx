import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function AccessibilityStatement() {
  return (
    <div className="policy-content">
      <Title level={2}>Accessibility Statement</Title>
      <Text type="secondary">Updated: 05/14/2025</Text>

      <Paragraph>
        AVIE is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards to the best of our ability.
      </Paragraph>

      <Title level={3}>1. Our Commitment to Accessibility</Title>
      <Paragraph>
        AVIE strives to ensure that our platform is accessible to all users, regardless of technology or ability. We aim to comply with:
      </Paragraph>
      <ul className="policy-list">
        <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards</li>
        <li>Section 508 of the Rehabilitation Act</li>
        <li>Americans with Disabilities Act (ADA)</li>
        <li>Other relevant accessibility laws and regulations in the regions we serve</li>
      </ul>

      <Title level={3}>2. Specific Accessibility Features</Title>
      <Paragraph>
        Our platform includes the following accessibility features:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Screen Reader Compatibility:</strong> We design our interface to work with popular screen readers.</li>
        <li><strong>Keyboard Navigation:</strong> All platform functions can be accessed using a keyboard.</li>
        <li><strong>Text Alternatives:</strong> We provide alt text for images and descriptive labels for interactive elements.</li>
        <li><strong>Color Contrast:</strong> We maintain sufficient contrast between text and background colors.</li>
        <li><strong>Customizable Experience:</strong> Users can adjust font sizes and contrast settings through their browsers.</li>
        <li><strong>Closed Captioning:</strong> We support closed captioning on video content where available.</li>
        <li><strong>Responsive Design:</strong> Our platform functions across different devices and screen sizes.</li>
      </ul>

      <Title level={3}>3. Ongoing Improvements</Title>
      <Paragraph>
        We recognize that accessibility is a journey, not a destination. We are actively working to increase the accessibility and usability of our platform by:
      </Paragraph>
      <ul className="policy-list">
        <li>Conducting regular accessibility audits</li>
        <li>Incorporating accessibility into our design and development process</li>
        <li>Training our team on inclusive design and development practices</li>
        <li>Working with users with disabilities to test and improve our platform</li>
        <li>Staying current with evolving accessibility standards and technologies</li>
      </ul>

      <Title level={3}>4. Third-Party Content & Integrations</Title>
      <Paragraph>
        While we strive to ensure that our platform is accessible, some content created by third parties (such as user-generated content, embedded applications, or integrated services) may not be fully within our control. We encourage all content creators on our platform to consider accessibility in their content creation.
      </Paragraph>

      <Title level={3}>5. Feedback & Support</Title>
      <Paragraph>
        If you experience any difficulty accessing our platform or have suggestions for improving accessibility, please contact us at:
      </Paragraph>
      <ul className="policy-list">
        <li>Email: accessibility@avie.live</li>
      </ul>
      <Paragraph>
        When reporting an accessibility issue, please:
      </Paragraph>
      <ul className="policy-list">
        <li>Describe the issue and how it affects your ability to use the platform</li>
        <li>Specify which pages or features you were trying to access</li>
        <li>Include information about any assistive technology you use</li>
        <li>Provide contact information if you wish to receive a response</li>
      </ul>

      <Title level={3}>6. Formal Complaints & Escalation</Title>
      <Paragraph>
        If you are not satisfied with our response to your accessibility feedback, you can escalate your concern to senior management by emailing legal@avie.live with "Accessibility Escalation" in the subject line.
      </Paragraph>

      <Title level={3}>7. Inclusivity Statement</Title>
      <Paragraph>
        At AVIE, we believe that digital environments should be accessible to everyone. We see accessibility not as a compliance requirement but as a core value that aligns with our mission to create an inclusive platform for all creators and audiences.
      </Paragraph>

      <Paragraph>
        This accessibility statement was last updated on the date shown above and will be reviewed and updated as our platform evolves.
      </Paragraph>
    </div>
  );
} 