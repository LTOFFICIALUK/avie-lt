import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function AIDisclosures() {
  return (
    <div className="policy-content">
      <Title level={2}>AI Disclosures & Ethical Use Policy</Title>
      <Text type="secondary">Effective Date: 05/14/2025</Text>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>Last Updated: 05/14/2025</Text>

      <Paragraph>
        At AVIE, we leverage artificial intelligence (AI) to enhance your streaming and content experience through interactive characters, intelligent moderation, content automation, and more. This policy explains where AI is used, its capabilities and limitations, how data may be processed, and your rights as a user.
      </Paragraph>

      <Title level={3}>1. Where AVIE Uses AI</Title>
      <Paragraph>
        AI technologies are integrated into several areas of the AVIE platform:
      </Paragraph>
      
      <Title level={4}>AI Characters & Avatars</Title>
      <ul className="policy-list">
        <li>AVIE and LIV are examples of AI-powered digital personalities designed to interact with users through chat, social media posts, and community engagement.</li>
        <li>These characters are powered by large language models (LLMs) and behave based on pre-set parameters, user input, and platform logic.</li>
      </ul>

      <Title level={4}>AI Moderation</Title>
      <ul className="policy-list">
        <li>Real-time chat moderation using AI tools helps detect spam, hate speech, and inappropriate content.</li>
        <li>Moderation bots may intervene, flag, or filter comments based on risk or violation of community guidelines.</li>
      </ul>

      <Title level={4}>AI Content Tools (Beta/Optional)</Title>
      <ul className="policy-list">
        <li>Suggestions for stream titles, thumbnails, tags, and descriptions may be generated using AI.</li>
        <li>AI-driven features for creators may include automatic video clipping, engagement scoring, and highlight suggestions.</li>
      </ul>

      <Title level={4}>AI-Powered Social Bots</Title>
      <ul className="policy-list">
        <li>Certain creators may opt-in to use AI agents to manage their social media interactions, post updates, or respond to mentions in character.</li>
      </ul>

      <Title level={3}>2. Limitations of AI Use</Title>
      <Paragraph>
        While our AI systems are designed to support creators and enhance community experience, they have limitations:
      </Paragraph>
      <ul className="policy-list">
        <li>AI responses may not be accurate, current, or reflective of AVIE's official views.</li>
        <li>Do not treat AI character responses as facts or legal advice.</li>
        <li>Generated content may occasionally contain errors, inappropriate suggestions, or misunderstandings.</li>
        <li>We regularly update and refine our models to minimize such risks.</li>
        <li>AI systems are not humans.</li>
        <li>Conversations with AI characters are generated using statistical patterns and algorithms and do not represent human emotions or consciousness.</li>
      </ul>

      <Title level={3}>3. AI and Data Usage</Title>
      
      <Title level={4}>Data Inputs:</Title>
      <ul className="policy-list">
        <li>AI features may learn from real-time prompts, feedback, and interaction patterns to improve user experience and relevance.</li>
        <li>However, no personally identifiable information (PII) is used to train AVIE's AI models without explicit consent.</li>
      </ul>

      <Title level={4}>Training Sources:</Title>
      <ul className="policy-list">
        <li>Publicly available data, synthetic prompts, and anonymized content may be used to fine-tune internal models.</li>
        <li>AI features may be powered by third-party providers (e.g., OpenAI, Anthropic) with appropriate agreements in place.</li>
      </ul>

      <Title level={4}>Content Generation Logs:</Title>
      <ul className="policy-list">
        <li>Interactions may be logged for moderation, safety, or improvement purposes. These logs are retained in accordance with our [Privacy Policy].</li>
      </ul>

      <Title level={3}>4. User Rights & Opt-Out Options</Title>
      <Paragraph>
        AVIE users may:
      </Paragraph>
      <ul className="policy-list">
        <li>Opt out of AI interaction features (where applicable), such as disabling chat suggestions or declining to use AI assistants on their streams.</li>
        <li>Flag incorrect or inappropriate AI responses using provided tools.</li>
        <li>Request data deletion related to AI interactions via support@avie.live, in line with our data protection policies.</li>
      </ul>
      <Paragraph>
        Note: Core moderation systems powered by AI may not be individually deactivated as they are critical for platform safety.
      </Paragraph>

      <Title level={3}>5. Ethical Commitments</Title>
      <Paragraph>
        We commit to the following principles in our use of AI:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Transparency:</strong> We disclose where and how AI is used across the platform.</li>
        <li><strong>Safety:</strong> We monitor and moderate AI outputs to minimize harmful or inappropriate content.</li>
        <li><strong>Fairness:</strong> We do not use AI to promote bias or discriminate against any group of users.</li>
        <li><strong>Consent:</strong> Where required, we seek user opt-in before using their data in AI-enhanced features.</li>
      </ul>

      <Title level={3}>Questions or Concerns?</Title>
      <Paragraph>
        If you have concerns about how AI is used on AVIE, please contact support@avie.live
      </Paragraph>
    </div>
  );
}