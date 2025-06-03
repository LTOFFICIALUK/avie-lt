import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function AIDisclosures() {
  return (
    <div className="policy-content">
      <Title level={2}>AI Disclosures & Ethical Use Policy</Title>
      <Text type="secondary">Updated: 05/14/2025</Text>

      <Paragraph>
        AVIE integrates artificial intelligence (AI) technologies throughout the platform to enhance user experience, provide creative tools, and ensure community safety. This policy explains where and how we use AI, the limitations of our AI systems, data usage practices, and your rights regarding AI interactions.
      </Paragraph>

      <Title level={3}>1. Where AVIE Uses AI</Title>
      <Paragraph>
        Our platform incorporates AI in the following ways:
      </Paragraph>
      
      <Title level={4}>1.1 AI Characters & Avatars</Title>
      <ul className="policy-list">
        <li>AVIE offers AI-powered virtual companions and characters that can interact with users and viewers.</li>
        <li>These characters leverage large language models to generate responses and may be customized by creators.</li>
        <li>All AI characters are clearly labeled as "AI" to distinguish them from human users.</li>
      </ul>

      <Title level={4}>1.2 AI Moderation</Title>
      <ul className="policy-list">
        <li>We employ AI systems to help detect and flag potentially violating content, including harmful text, images, and behavior.</li>
        <li>Human moderators review AI-flagged content before most enforcement actions are taken.</li>
      </ul>

      <Title level={4}>1.3 AI Content Generation</Title>
      <ul className="policy-list">
        <li>Creators have access to AI tools that can generate images, text, music, or other creative elements.</li>
        <li>All AI-generated content must be appropriately labeled as created with AI assistance.</li>
      </ul>

      <Title level={4}>1.4 AI-Powered Features</Title>
      <ul className="policy-list">
        <li>AVIE uses AI for content recommendations, translation services, accessibility features, and other platform enhancements.</li>
        <li>These systems are designed to improve user experience while respecting privacy and ethical boundaries.</li>
      </ul>

      <Title level={3}>2. Limitations of AI Use</Title>
      <Paragraph>
        When interacting with AI on AVIE, please be aware of these important limitations:
      </Paragraph>
      <ul className="policy-list">
        <li>AI responses are generated based on patterns in training data and may not always be accurate or appropriate.</li>
        <li>Our AI systems do not possess consciousness, emotions, or independent agency.</li>
        <li>AI content should not be regarded as professional advice (legal, medical, financial, etc.).</li>
        <li>AI may occasionally produce biased, misleading, or factually incorrect information.</li>
        <li>AI-generated responses reflect probabilistic language predictions, not fact-checked information.</li>
      </ul>

      <Title level={3}>3. AI Development Ethics</Title>
      <Paragraph>
        AVIE is committed to developing and deploying AI systems responsibly by:
      </Paragraph>
      <ul className="policy-list">
        <li>Prioritizing human well-being and safety in AI design and implementation.</li>
        <li>Mitigating harmful biases in AI systems to the best of our technical ability.</li>
        <li>Maintaining human oversight of critical AI functions.</li>
        <li>Continuously improving AI systems based on user feedback and emerging best practices.</li>
        <li>Being transparent about AI capabilities and limitations.</li>
      </ul>

      <Title level={3}>4. AI and Data Usage</Title>
      <Paragraph>
        To provide AI features, AVIE:
      </Paragraph>
      <ul className="policy-list">
        <li>May process user inputs (text, images, voice) through our AI systems.</li>
        <li>Uses a combination of proprietary and third-party AI providers, all bound by strict data protection requirements.</li>
        <li>Does not use personally identifiable information to train our AI models without explicit consent.</li>
        <li>Retains logs of AI interactions for quality improvement, abuse prevention, and debugging purposes.</li>
        <li>May use anonymized interactions to improve AI system performance.</li>
      </ul>

      <Title level={3}>5. User Rights & Opt-Out Options</Title>
      <Paragraph>
        As an AVIE user, you have the right to:
      </Paragraph>
      <ul className="policy-list">
        <li>Know when you are interacting with an AI system versus a human.</li>
        <li>Opt out of certain AI features through your account settings.</li>
        <li>Request deletion of your AI interaction data in accordance with our Privacy Policy.</li>
        <li>Flag inappropriate AI responses through our reporting system.</li>
        <li>Provide feedback to help improve our AI systems.</li>
      </ul>

      <Title level={3}>6. Responsible AI Creation</Title>
      <Paragraph>
        Creators using AVIE's AI tools must:
      </Paragraph>
      <ul className="policy-list">
        <li>Clearly disclose when content is AI-generated or AI-assisted.</li>
        <li>Not use AI to impersonate real individuals without consent.</li>
        <li>Not use AI to generate content that violates our Community Guidelines.</li>
        <li>Take responsibility for AI-generated content they share or publish.</li>
        <li>Exercise caution when creating AI characters or personae that might be mistaken for real people.</li>
      </ul>

      <Title level={3}>7. Ongoing Improvements</Title>
      <Paragraph>
        AVIE is continuously working to improve our AI systems to make them more helpful, accurate, and ethical. We welcome user feedback to help us identify areas for improvement and address concerns.
      </Paragraph>

      <Paragraph>
        If you have questions or concerns about AVIE's use of AI technologies, please contact us at ai-ethics@avie.live.
      </Paragraph>

      <Paragraph>
        This AI Disclosures & Ethical Use Policy may be updated periodically. We will notify users of significant changes via our website or other appropriate channels.
      </Paragraph>
    </div>
  );
}