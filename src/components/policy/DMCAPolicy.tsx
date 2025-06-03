import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export function DMCAPolicy() {
  return (
    <div className="policy-content">
      <Title level={2}>DMCA / Copyright Policy</Title>
      <Text type="secondary">Updated: 05/14/2025</Text>

      <Paragraph>
        AVIE respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we have established the following policy to address claims of copyright infringement on our platform.
      </Paragraph>

      <Title level={3}>1. Notification of Claimed Copyright Infringement</Title>
      <Paragraph>
        If you believe that your copyrighted work has been used or displayed on AVIE in a way that constitutes copyright infringement, please send a notification to our designated copyright agent with the following information:
      </Paragraph>
      <ul className="policy-list">
        <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf.</li>
        <li>Identification of the copyrighted work claimed to have been infringed.</li>
        <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material.</li>
        <li>Your contact information, including address, telephone number, and email address.</li>
        <li>A statement by you that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
        <li>A statement that the information in the notification is accurate, and, under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
      </ul>

      <Paragraph>
        Please submit DMCA notices to: copyright@avie.live
      </Paragraph>

      <Title level={3}>2. Counter-Notification Process</Title>
      <Paragraph>
        If you believe that your content was removed by mistake or misidentification, you may submit a counter-notification to our designated copyright agent with the following information:
      </Paragraph>
      <ul className="policy-list">
        <li>Your physical or electronic signature.</li>
        <li>Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled.</li>
        <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled.</li>
        <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the federal court for the judicial district in which your address is located, or if your address is outside of the United States, for any judicial district in which AVIE may be found, and that you will accept service of process from the person who provided notification or an agent of such person.</li>
      </ul>

      <Title level={3}>3. Repeat Infringer Policy</Title>
      <Paragraph>
        AVIE maintains a policy of terminating, in appropriate circumstances, the accounts of users who are repeat copyright infringers. We reserve the right to terminate an account based on a single instance of copyright infringement where the circumstances warrant such action.
      </Paragraph>

      <Title level={3}>4. AVIE's Response to DMCA Notices</Title>
      <Paragraph>
        Upon receipt of a valid DMCA notice, AVIE will:
      </Paragraph>
      <ul className="policy-list">
        <li>Remove or disable access to the allegedly infringing content.</li>
        <li>Make a reasonable effort to notify the user whose content has been removed.</li>
        <li>Provide the user with a copy of the copyright infringement complaint and information about submitting a counter-notice.</li>
        <li>Upon receipt of a valid counter-notice, we will promptly forward it to the original complainant.</li>
        <li>If the copyright owner does not notify us within 10 business days that they have filed a legal action seeking a court order to prevent further infringement, we will restore the removed content.</li>
      </ul>

      <Title level={3}>5. Fair Use & Content Guidelines</Title>
      <Paragraph>
        AVIE encourages creativity and respects fair use principles. Fair use permits limited use of copyrighted material without permission for purposes such as criticism, comment, news reporting, teaching, scholarship, or research.
      </Paragraph>
      <Paragraph>
        However, users should be aware that:
      </Paragraph>
      <ul className="policy-list">
        <li>The determination of whether a use is "fair" depends on several factors and can be subjective.</li>
        <li>AVIE cannot provide legal advice regarding whether specific uses constitute fair use.</li>
        <li>When in doubt, it's best to obtain permission from the copyright holder or use content available under appropriate licenses (such as Creative Commons).</li>
      </ul>

      <Title level={3}>6. Content ID & Licensing</Title>
      <Paragraph>
        AVIE works with content identification services and copyright holders to identify potential copyright infringement on our platform. We may implement automated systems to detect copyrighted content.
      </Paragraph>
      <Paragraph>
        To avoid copyright issues, we recommend:
      </Paragraph>
      <ul className="policy-list">
        <li>Using original content you've created yourself.</li>
        <li>Obtaining proper licenses for any third-party content you wish to use.</li>
        <li>Using royalty-free or Creative Commons licensed content with appropriate attribution.</li>
        <li>Understanding the terms of any platform-specific licenses for content you may use.</li>
      </ul>

      <Title level={3}>7. Disclaimer</Title>
      <Paragraph>
        This policy is intended to comply with the DMCA and is not legal advice. If you have questions about copyright law or the DMCA, please consult an attorney.
      </Paragraph>

      <Paragraph>
        AVIE reserves the right to modify this policy at any time by posting changes on this page.
      </Paragraph>

      <Paragraph>
        If you have any questions about this Copyright Policy, please contact us at copyright@avie.live
      </Paragraph>
    </div>
  );
} 