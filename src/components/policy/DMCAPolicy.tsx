import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function DMCAPolicy() {
  return (
    <div className="policy-content">
      <Title level={2}>DMCA / Copyright Policy</Title>
      <Text type="secondary">Effective Date: 05/14/2025</Text>

      <Paragraph>
        AVIE respects the intellectual property rights of creators and content owners and complies with the provisions of the Digital Millennium Copyright Act (DMCA). This policy explains how copyright owners can report alleged infringement, and how users can respond if their content is removed by mistake.
      </Paragraph>

      <Title level={3}>1. Reporting Copyright Infringement (Takedown Notice)</Title>
      <Paragraph>
        If you are a copyright owner (or authorized to act on behalf of one) and believe that content hosted on AVIE infringes your copyright, please send us a DMCA takedown notice that includes the following:
      </Paragraph>
      <ul className="policy-list">
        <li>Your full name, address, telephone number, and email address.</li>
        <li>A clear description of the copyrighted work you claim has been infringed.</li>
        <li>The exact URL or identification of where the infringing content appears on AVIE.</li>
        <li>A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
        <li>A statement, under penalty of perjury, that the information in the notice is accurate, and that you are the copyright owner or authorized to act on their behalf.</li>
        <li>Your physical or electronic signature.</li>
      </ul>
      <Paragraph>
        Send your DMCA notice to support@avie.live
      </Paragraph>

      <Title level={3}>2. Responding to a Takedown (Counter-Notice)</Title>
      <Paragraph>
        If your content was removed in response to a DMCA notice and you believe the removal was a mistake or that you have the right to use the content, you may submit a counter-notice. The counter-notice must include:
      </Paragraph>
      <ul className="policy-list">
        <li>Your full name, address, telephone number, and email address.</li>
        <li>Identification of the material that was removed and the location where it previously appeared.</li>
        <li>A statement under penalty of perjury that you believe the content was removed due to mistake or misidentification.</li>
        <li>A statement that you consent to the jurisdiction of the federal district court where you are located (or AVIE's jurisdiction if outside the U.S.) and will accept service of process from the original complainant.</li>
        <li>Your physical or electronic signature.</li>
      </ul>
      <Paragraph>
        Send your counter-notice to support@avie.live
      </Paragraph>

      <Title level={3}>3. Designated DMCA Agent</Title>
      <Paragraph>
        AVIE's designated agent's information can be obtained by contacting support@avie.live providing sufficient evidence supporting a claim can be provided.
        We will register this agent with the U.S. Copyright Office for formal compliance.
      </Paragraph>

      <Title level={3}>4. Repeat Infringer Policy</Title>
      <Paragraph>
        AVIE has a zero-tolerance policy for repeat copyright infringement. Users who receive multiple valid DMCA takedown notices may have their accounts permanently terminated.
        We also reserve the right to remove content, restrict features, or suspend accounts at our discretion if we believe a user is abusing the copyright system.
      </Paragraph>

      <Paragraph>
        If you have any questions about this policy or need help navigating copyright concerns, please contact support@avie.live. We're here to help protect creators and uphold fair use across the platform.
      </Paragraph>
    </div>
  );
} 