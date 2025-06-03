import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function CommunityGuidelines() {
  return (
    <div className="policy-content">
      <Title level={2}>AVIE Community Guidelines</Title>
      <Text type="secondary">Updated: 05/14/2025</Text>
      
      <Paragraph>
        Welcome to AVIE, a platform built to empower creators and foster inclusive, innovative communities. These Community Guidelines are designed to ensure a safe, respectful, and creative environment for everyone. By using AVIE, you agree to abide by these rules. Failure to follow them may result in account restrictions, suspension, or permanent bans.
      </Paragraph>

      <Title level={3}>1. Prohibited Content</Title>
      <Paragraph>
        To maintain a positive and respectful space, the following types of content are strictly prohibited on AVIE:
      </Paragraph>

      <Title level={4}>1.1 Hate Speech & Discrimination</Title>
      <ul className="policy-list">
        <li>No content that promotes, incites, or glorifies, but not limited to, hatred or violence against individuals or groups based on race, ethnicity, nationality, gender, gender identity, sexual orientation, religion, disability, or age.</li>
        <li>Slurs, dehumanizing language, or symbols associated with hate groups are not allowed.</li>
      </ul>

      <Title level={4}>1.2 Harassment & Threats</Title>
      <ul className="policy-list">
        <li>No targeted harassment, bullying, or threats of violence.</li>
        <li>Do not engage in doxing (releasing personal information), stalking, or coordinated attacks.</li>
      </ul>

      <Title level={4}>1.3 Sexual Content & Nudity</Title>
      <ul className="policy-list">
        <li>Sexually explicit content is not permitted.</li>
        <li>Nudity is allowed only in educational, artistic, or medical contexts with proper flagging.</li>
        <li>Pornographic material, sexual exploitation, or solicitation is strictly prohibited.</li>
      </ul>

      <Title level={4}>1.4 Harmful Behavior & Illegal Activities</Title>
      <ul className="policy-list">
        <li>Content that promotes or depicts self-harm, suicide, substance abuse, or eating disorders is not allowed.</li>
        <li>Do not stream or promote criminal activity, including the sale, possession or use of illegal goods or services.</li>
      </ul>

      <Title level={4}>1.5 Misinformation, Scams & Misleading Content</Title>
      <ul className="policy-list">
        <li>Avoid knowingly promoting scam content, financial fraud, phishing, or pyramid schemes.</li>
        <li>Avoid knowingly spreading misinformation or misleading your audience for personal gain.</li>
      </ul>

      <Title level={4}>1.6 Personal Data & Privacy Violations</Title>
      <ul className="policy-list">
        <li>Sharing private information (such as full names, addresses, phone numbers, or financial data) without consent is strictly prohibited.</li>
      </ul>

      <Title level={4}>1.7 AI Abuse & Deepfakes</Title>
      <ul className="policy-list">
        <li>Misleading impersonation or harmful use of AI-generated content (e.g., fake avatars, deepfakes, AI clones of real people) is not allowed.</li>
        <li>Use of AVIE bots or AI tools to spread disinformation, harass others, or mimic real individuals without consent is prohibited.</li>
      </ul>

      <Title level={3}>2. Behavioral Expectations</Title>
      <Paragraph>
        AVIE is a place to create, connect, and grow. We expect our users to:
      </Paragraph>
      <ul className="policy-list">
        <li>Be respectful in chat and comments. Personal attacks, slurs, or spam will not be tolerated.</li>
        <li>Impersonating other users, creators, AVIE staff, or public figures is strictly prohibited and will result in account termination.</li>
        <li>Refrain from flooding chat or comments with repetitive, disruptive, or irrelevant content.</li>
        <li>Use AI tools responsibly. Abuse of AVIE bots or characters for prohibited content is forbidden.</li>
        <li>Users are encouraged to report content that violates these guidelines using the platform's built in report feature, through the AVIE Discord server or by emailing support@avie.live.</li>
      </ul>

      <Title level={4}>2.1 Content Labeling & Flagging</Title>
      <ul className="policy-list">
        <li>Users are required to flag streams or content containing mature themes (e.g., intense language, suggestive content) using available tools.</li>
      </ul>

      <Title level={4}>2.2 Age Restrictions</Title>
      <ul className="policy-list">
        <li>AVIE is not intended for users under the age of 13. Users under 18 must obtain parental consent where applicable.</li>
        <li>Creators must not target or solicit interaction from minors in inappropriate ways.</li>
      </ul>

      <Title level={3}>3. Moderation & Enforcement</Title>
      <Title level={4}>3.1 Enforcement Tiers</Title>
      <Paragraph>
        Depending on the severity of a violation, AVIE may take the following actions:
      </Paragraph>
      <ul className="policy-list">
        <li>Warning: For minor first-time infractions.</li>
        <li>Temporary Suspension: For repeated or moderately severe violations.</li>
        <li>Permanent Ban: For severe or repeated misconduct.</li>
      </ul>

      <Title level={4}>3.2 Moderation Scope</Title>
      <ul className="policy-list">
        <li>AVIE reserves the right to moderate public and private content, including stream chats, stream titles, usernames, metadata, video content, and platform-integrated bots.</li>
        <li>Moderation may be human- or AI-assisted and is applied without notice where necessary to prevent harm.</li>
      </ul>

      <Title level={4}>3.3 Appeals</Title>
      <ul className="policy-list">
        <li>Users who believe enforcement action was taken in error may submit an appeal by email at support@avie.live.</li>
        <li>Appeals will be reviewed by our moderation team, and decisions will be final.</li>
      </ul>

      <Title level={4}>3.4 Spam & Manipulation</Title>
      <ul className="policy-list">
        <li>Artificial manipulation of platform features (e.g., follower inflation, engagement bots, view count manipulation) is strictly prohibited.</li>
      </ul>

      <Title level={4}>3.5 Token & Financial Activity</Title>
      <ul className="policy-list">
        <li>Do not knowingly promote pump-and-dump schemes, unregistered securities, or speculative investment products via AVIE.</li>
      </ul>

      <Title level={3}>4. Protecting the Platform & Each Other</Title>
      <Paragraph>
        AVIE is built with the community in mind. We rely on our users to help maintain a safe, creative, and empowering space for all:
      </Paragraph>
      <ul className="policy-list">
        <li>Use reporting tools to flag inappropriate content or behavior.</li>
        <li>Support others by encouraging creativity, innovation and respectful interaction.</li>
        <li>Help us grow by providing constructive feedback and suggestions through the appropriate channels.</li>
      </ul>
      <Paragraph>
        AVIE may provide educational guidance about safe platform use, digital literacy, and responsible content creation.
      </Paragraph>

      <Paragraph>
        Thank you for being part of the AVIE community.
        Together, we're building the future of creator-first streaming with integrity and care.
        If you have questions or feedback about these guidelines, please contact us at support@avie.live.
      </Paragraph>
    </div>
  );
} 