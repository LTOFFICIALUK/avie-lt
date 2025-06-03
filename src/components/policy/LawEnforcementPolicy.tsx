import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function LawEnforcementPolicy() {
  return (
    <div className="policy-content">
      <Title level={2}>Law Enforcement Policy</Title>
      <Text type="secondary">Updated: 05/14/2025</Text>

      <Paragraph>
        AVIE is committed to user safety and compliance with applicable laws. This policy outlines how we interact with law enforcement agencies and how we handle requests for user information.
      </Paragraph>

      <Title level={3}>1. General Principles</Title>
      <ul className="policy-list">
        <li>AVIE values user privacy and will only disclose user information to law enforcement when legally required or in emergency situations.</li>
        <li>We require valid legal process before disclosing user data to law enforcement, except in emergencies involving imminent harm.</li>
        <li>All requests are carefully reviewed for legal validity and scope.</li>
        <li>We will notify users about legal requests for their information when permitted by law.</li>
      </ul>

      <Title level={3}>2. Types of Legal Requests</Title>
      <Paragraph>
        AVIE responds to the following types of legal requests from authorized law enforcement agencies:
      </Paragraph>
      
      <Title level={4}>2.1 Preservation Requests</Title>
      <ul className="policy-list">
        <li>Law enforcement may request that we preserve records for a specified period (typically 90 days).</li>
        <li>Preservation requests do not require us to disclose any information but instruct us to save relevant data pending formal legal process.</li>
      </ul>

      <Title level={4}>2.2 Subpoenas, Court Orders, and Search Warrants</Title>
      <ul className="policy-list">
        <li>Subpoenas and court orders may compel disclosure of basic subscriber information.</li>
        <li>Valid search warrants may compel disclosure of additional user content and data.</li>
        <li>International requests must follow proper legal channels, including Mutual Legal Assistance Treaties where applicable.</li>
      </ul>

      <Title level={4}>2.3 Emergency Disclosure Requests</Title>
      <ul className="policy-list">
        <li>In cases involving imminent threat of death or serious physical injury, we may provide information without legal process.</li>
        <li>Emergency requests must be submitted by sworn law enforcement and include specific details about the emergency.</li>
      </ul>

      <Title level={3}>3. Information Available for Disclosure</Title>
      <Paragraph>
        Depending on the legal authority of the request, AVIE may disclose:
      </Paragraph>
      <ul className="policy-list">
        <li><strong>Basic Subscriber Information:</strong> Username, email address, registration date, IP addresses used to access the service.</li>
        <li><strong>Transaction Records:</strong> Records of financial transactions on the platform.</li>
        <li><strong>Usage Information:</strong> Login history, streaming records, connection logs.</li>
        <li><strong>Content:</strong> Publicly available content and, when legally required, private communications or content.</li>
      </ul>
      <Paragraph>
        Note: Encrypted content may not be accessible even with valid legal process.
      </Paragraph>

      <Title level={3}>4. User Notification Policy</Title>
      <ul className="policy-list">
        <li>AVIE will notify users when legal requests are made for their information unless:</li>
        <ul>
          <li>We are legally prohibited from doing so (e.g., by court order or statute).</li>
          <li>We believe notification would risk imminent harm to someone.</li>
          <li>The account shows signs of compromise or is engaged in harmful activities.</li>
        </ul>
        <li>When a non-disclosure order expires, we may notify the affected user.</li>
      </ul>

      <Title level={3}>5. Cost Reimbursement</Title>
      <Paragraph>
        AVIE reserves the right to seek reimbursement for costs associated with processing legal requests as permitted by law.
      </Paragraph>

      <Title level={3}>6. Submitting Law Enforcement Requests</Title>
      <Paragraph>
        Law enforcement agencies should submit requests to: lawenforcement@avie.live
      </Paragraph>
      <Paragraph>
        Requests should include:
      </Paragraph>
      <ul className="policy-list">
        <li>The requesting agency's name, badge/ID number, and contact information.</li>
        <li>A valid official email address from the agency domain.</li>
        <li>The legal basis for the request and specific information sought.</li>
        <li>The AVIE username or other identifier for the account(s) in question.</li>
        <li>A detailed explanation of why the information is needed.</li>
      </ul>

      <Title level={3}>7. International Requests</Title>
      <Paragraph>
        Law enforcement outside the United States should follow proper international legal process. This may include Mutual Legal Assistance Treaties (MLATs) or letters rogatory channeled through the U.S. Department of Justice.
      </Paragraph>

      <Title level={3}>8. Transparency Reporting</Title>
      <Paragraph>
        AVIE is committed to transparency regarding government requests for user information. We publish periodic reports on the number and types of legal requests received, where permitted by law.
      </Paragraph>

      <Title level={3}>9. Policy Updates</Title>
      <Paragraph>
        This policy may be updated periodically. We will post any changes on this page with an updated effective date.
      </Paragraph>

      <Paragraph>
        Note: This policy does not create any enforceable rights against AVIE. The purpose is to provide clarity on how we process law enforcement requests and our commitment to protecting user privacy while complying with legal obligations.
      </Paragraph>
    </div>
  );
} 