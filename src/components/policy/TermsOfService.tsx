import { Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function TermsOfService() {
  return (
    <div className="policy-content">
      <Title level={2}>Terms of Service</Title>
      <Text type="secondary">Last updated: 05/14/2025</Text>
      
      <Paragraph>
        Welcome to AVIE ("we," "our," "us"). These Terms of Service ("Terms") govern your access to and use of the AVIE platform, website, and services (the "Platform"). By accessing, using, or registering on AVIE, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use the Platform.
      </Paragraph>

      <Title level={3}>1. Acceptance of Terms</Title>
      <Paragraph>
        By creating an account and using AVIE, you agree to comply with these Terms, including the understanding that any digital assets, AP or tokens available on the platform are for utility purposes only. This is a binding agreement between you and AVIE.
      </Paragraph>

      <Title level={3}>2. Eligibility</Title>
      <Paragraph>
        To use AVIE:
      </Paragraph>
      <ul className="policy-list">
        <li>You must be at least 13 years old (or the age of digital consent in your jurisdiction).</li>
        <li>Users under 18 must have parental or legal guardian consent to access certain features.</li>
        <li>You must not be barred from using the Platform under applicable law.</li>
        <li>You represent and warrant that all information you provide is accurate and up to date.</li>
      </ul>

      <Title level={3}>3. Account Requirements</Title>
      <Paragraph>
        To access the platform, you must register and create an account. You agree to:
      </Paragraph>
      <ul className="policy-list">
        <li>Maintain the confidentiality of your account credentials.</li>
        <li>Be fully responsible for all activities under your account.</li>
        <li>Promptly notify us of any unauthorized use of your account.</li>
      </ul>
      <Paragraph>
        AVIE reserves the right to refuse registration, suspend, or terminate accounts at its discretion.
      </Paragraph>

      <Title level={3}>4. Platform Usage Rules</Title>
      <Paragraph>
        You agree not to:
      </Paragraph>
      <ul className="policy-list">
        <li>Stream, upload, or share any content that violates intellectual property rights, privacy laws, or community standards.</li>
        <li>Engage in harassment, hate speech, illegal conduct, or any abusive behavior.</li>
        <li>Use the Platform to distribute malware, spam, or conduct phishing attacks.</li>
        <li>Circumvent, disable, or interfere with platform security features.</li>
        <li>Impersonate AVIE, our team, or other users.</li>
        <li>Use bots or any other non-human system within the AVIE ecosystem. This includes, but is not limited to manipulating features such as viewer, subscription or follower counts and chat messages.</li>
      </ul>
      <Paragraph>
        We reserve the right to monitor usage and enforce our rules through moderation, suspension, or legal action.
      </Paragraph>

      <Title level={3}>5. License Grant</Title>
      <Paragraph>
        You retain full ownership of your content. When uploading, broadcasting, or sharing content on AVIE, you grant us a limited, non-exclusive license to:
      </Paragraph>
      <ul className="policy-list">
        <li>Host, distribute, display, and reproduce your content on the AVIE Platform and social media.</li>
        <li>Promote and market your content in connection with AVIE's services.</li>
        <li>Store and cache content as required to operate the Platform.</li>
      </ul>
      <Paragraph>
        We shall retain a limited right to use clips of your content for marketing purposes related to the platform. This license survives deletion of your content from the Platform, except where limited by applicable law or to comply with investigations.
      </Paragraph>

      <Title level={3}>6. Streaming & Content Responsibility</Title>
      <Paragraph>
        As a creator, you are solely responsible for your content, including streams, audio, video, messages, chat interactions, and uploads. AVIE does not endorse or take responsibility for any content users submit.
        You acknowledge that live streaming and content creation carry legal responsibilities. It is your obligation to:
      </Paragraph>
      <ul className="policy-list">
        <li>Comply with copyright laws and licensing requirements (e.g., music usage).</li>
        <li>Respect community standards and applicable laws.</li>
        <li>Use moderation tools provided (including AI moderation and chat filters if available).</li>
      </ul>

      <Title level={3}>7. Enforcement Rights</Title>
      <Paragraph>
        AVIE reserves the right, but is not obligated, to:
      </Paragraph>
      <ul className="policy-list">
        <li>Remove or restrict access to content that violates these Terms or any law.</li>
        <li>Suspend or terminate accounts for misconduct.</li>
        <li>Cooperate with law enforcement investigations.</li>
        <li>Enforce platform integrity to maintain a safe and fair environment.</li>
      </ul>

      <Title level={3}>8. Termination</Title>
      <Paragraph>
        You may terminate your account at any time by contacting support or using in-platform settings.
        We may suspend or terminate your access:
      </Paragraph>
      <ul className="policy-list">
        <li>For violations of these Terms or any policy.</li>
        <li>If your account is inactive or presents legal/technical risks.</li>
        <li>With or without notice, depending on the severity.</li>
      </ul>
      <Paragraph>
        Upon termination:
      </Paragraph>
      <ul className="policy-list">
        <li>Your access to content, AP, platform utility tokens, and platform features may be revoked, with no compensation for any potential perceived value of digital assets.</li>
        <li>AVIE may retain your data as necessary for compliance with applicable laws.</li>
      </ul>

      <Title level={3}>9. Dispute Resolution & Governing Law</Title>
      <Paragraph>
        These Terms are governed by the laws of the United States.
        By using the Platform, you agree to:
      </Paragraph>
      <ul className="policy-list">
        <li>First attempt to resolve disputes informally by contacting AVIE.</li>
        <li>Submit any unresolved disputes to binding arbitration (if applicable in your jurisdiction).</li>
        <li>Waive class action rights where legally permissible.</li>
      </ul>

      <Title level={3}>10. Changes to the Terms</Title>
      <Paragraph>
        We reserve the right to update these Terms at any time. When we do, we will:
      </Paragraph>
      <ul className="policy-list">
        <li>Post a notice on the Platform.</li>
        <li>Update the "Last Updated" date.</li>
        <li>Notify you via email or in-platform notification (when possible).</li>
      </ul>
      <Paragraph>
        Continued use of AVIE after changes take effect constitutes your agreement to the updated Terms.
      </Paragraph>

      <Title level={3}>11. Contact Us</Title>
      <Paragraph>
        If you have questions or need clarification, please contact:
      </Paragraph>
      <Paragraph>
        Email: support@avie.live<br />
        Discord: https://discord.gg/EPJCeVfK<br />
        Telegram: https://t.me/+Ng4-vF6UAFE2NWE0<br />
        X (formerly Twitter): @AvieProtocol
      </Paragraph>
      <Paragraph>
        These links may expire. Please get in touch via email to obtain a valid link.
      </Paragraph>
      <Paragraph>
        Thank you for being a part of the AVIE community.
      </Paragraph>
    </div>
  );
} 