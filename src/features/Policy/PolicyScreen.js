import React, {useRef} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Links} from '../../shared/functions';
import {global} from '../../shared/styles/theme';

const PolicyScreen = props => {
  const scrollRef = useRef();

  let section1,
    section2,
    section3,
    section4,
    section5,
    section6,
    section7,
    section8,
    section9,
    section10,
    section11,
    section12,
    section13,
    section14,
    section15;

  const scrollTo = position => {
    scrollRef.current?.scrollTo({y: position.y, animated: true});
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      props.setButton();
    }
  };

  return (
    <ScrollView
      style={styles.container}
      ref={scrollRef}
      onScroll={({nativeEvent}) => {
        isCloseToBottom(nativeEvent);
      }}>
      <Text style={styles.date}>Last updated March 01, 2020</Text>
      <Text style={styles.p}>
        Thank you for choosing to be part of our community at Rate The Refs, LLC
        (<Text style={styles.bold}>"Company"</Text>,
        <Text style={styles.bold}> "we"</Text>,
        <Text style={styles.bold}> "us"</Text>, or
        <Text style={styles.bold}> "our"</Text>). We are committed to protecting
        your personal information and your right to privacy. If you have any
        questions or concerns about our policy, or our practices with regards to
        your personal information, please contact us at info@ratetherefs.com.
      </Text>
      <Text style={styles.p}>
        When you visit our website{' '}
        <Text
          style={styles.hyperlink}
          onPress={() => Links.openUrl('https://ratetherefs.com')}>
          https://www.ratetherefs.com
        </Text>
        , mobile application, and use our services, you trust us with your
        personal information. We take your privacy very seriously. In this
        policy, we seek to explain to you in the clearest way possible what
        information we collect, how we use it and what rights you have in
        relation to it. We hope you take some time to read through it carefully,
        as it is important. If there are any terms in this privacy policy that
        you do not agree with, please discontinue use of our Sites or Apps and
        our services.
      </Text>
      <Text style={styles.p}>
        This privacy policy applies to all information collected through our
        website (such as{' '}
        <Text
          style={styles.hyperlink}
          onPress={() => Links.openUrl('https://ratetherefs.com')}>
          https://www.ratetherefs.com
        </Text>
        ), mobile application,(
        <Text style={styles.bold}>"Apps"</Text>), and/or any related marketing
        or events (we refer to them collectively in this this this privacy
        policy as the <Text style={styles.bold}>"Services"</Text>).
      </Text>
      <Text style={[styles.p, styles.bold]}>
        Please read this privacy policy carefully as it will help you make
        informed decisions about sharing your personal information with us.
      </Text>

      <Text style={styles.sectionTitle}>TABLE OF CONTENTS</Text>
      <Text style={styles.list}>
        1.{'   '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section1)}>
          WHAT INFORMATION DO WE COLLECT?
        </Text>
        {'\n'}
        2.{'   '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section2)}>
          HOW DO WE USE YOUR INFORMATION?
        </Text>
        {'\n'}
        3.{'   '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section3)}>
          WILL YOUR INFORMATION BE SHARED WITH ANYONE?
        </Text>
        {'\n'}
        4.{'   '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section4)}>
          DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
        </Text>
        {'\n'}
        5.{'   '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section5)}>
          DO WE USE GOOGLE MAPS?
        </Text>
        {'\n'}
        6.{'   '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section6)}>
          HOW DO WE HANDLE YOUR SOCIAL LOGINS?
        </Text>
        {'\n'}
        7.{'   '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section7)}>
          WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
        </Text>
        {'\n'}
        8.{'   '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section8)}>
          HOW LONG DO WE KEEP YOUR INFORMATION?
        </Text>
        {'\n'}
        9.{'   '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section9)}>
          HOW DO WE KEEP YOUR INFORMATION SAFE?
        </Text>
        {'\n'}
        10.{' '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section10)}>
          DO WE COLLECT INFORMATION FROM MINORS?
        </Text>
        {'\n'}
        11.{' '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section11)}>
          WHAT ARE YOUR PRIVACY RIGHTS?
        </Text>
        {'\n'}
        12.{' '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section12)}>
          CONTROLS FOR DO-NOT-TRACK FEATURES
        </Text>
        {'\n'}
        13.{' '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section13)}>
          DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
        </Text>
        {'\n'}
        14.{' '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section14)}>
          DO WE MAKE UPDATES TO THIS POLICY?
        </Text>
        {'\n'}
        15.{' '}
        <Text style={styles.hyperlink} onPress={() => scrollTo(section15)}>
          HOW CAN YOU CONTACT US ABOUT THIS POLICY?
        </Text>
        {'\n'}
      </Text>

      <View
        onLayout={event => {
          section1 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          1. WHAT INFORMATION DO WE COLLECT?
        </Text>
        <Text style={styles.sectionHeader}>
          Personal information you disclose to us
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              We collect personal information that you provide to us.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          We collect personal information that you voluntarily provide to us
          when registering at the Services or Apps, expressing an interest in
          obtaining information about us or our products and services, when
          participating in activities on the Services or Apps (such as posting
          messages in our online forums or entering competitions, contests or
          giveaways) or otherwise contacting us.
          {'\n'}
          {'\n'}
          The personal information that we collect depends on the context of
          your interactions with us and the Services or Apps, the choices you
          make and the products and features you use. The personal information
          we collect can include the following:
          {'\n'}
          {'\n'}
          <Text style={styles.bold}>
            Publicly Available Personal Information.
          </Text>{' '}
          We collect first name, maiden name, last name, and nickname; ID;
          current and former address; phone numbers; email addresses; social
          media; and other similar data.
          {'\n'}
          {'\n'}
          <Text style={styles.bold}>
            Personal Information Provided by You.
          </Text>{' '}
          We collect app usage; political and social affiliation to different
          groups; and other similar data.
          {'\n'}
          {'\n'}
          <Text style={styles.bold}>Social Media Login Data.</Text> We may
          provide you with the option to register using social media account
          details, like your Facebook, Twitter or other social media account. If
          you choose to register in this way, we will collect the Information
          described in the section called{' '}
          <Text style={styles.hyperlink} onPress={() => scrollTo(section6)}>
            "HOW DO WE HANDLE YOUR SOCIAL LOGINS"
          </Text>
          below.
          {'\n'}
          {'\n'}
          All personal information that you provide to us must be true, complete
          and accurate, and you must notify us of any changes to such personal
          information.
        </Text>
        <Text style={styles.sectionHeader}>
          Information automatically collected
        </Text>

        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              Some information — such as IP address and/or browser and device
              characteristics — is collected automatically when you visit our
              Services or Apps.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          We automatically collect certain information when you visit, use or
          navigate the Services or Apps. This information does not reveal your
          specific identity (like your name or contact information) but may
          include device and usage information, such as your IP address, browser
          and device characteristics, operating system, language preferences,
          referring URLs, device name, country, location, information about how
          and when you use our Services or Apps and other technical information.
          This information is primarily needed to maintain the security and
          operation of our Services or Apps, and for our internal analytics and
          reporting purposes.
          {'\n'}
          {'\n'}
          Like many businesses, we also collect information through cookies and
          similar technologies.
          {'\n'}
          {'\n'}
          <Text style={styles.bold}>Online Identifiers.</Text> We collect
          devices; applications; tools and protocols, such as IP (Internet
          Protocol) addresses; device's geolocation; cookie identifiers, or
          others such as the ones used for analytics and marketing; and other
          similar data.
        </Text>

        <Text style={styles.sectionHeader}>
          Personal information you disclose to us
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              We may collect information regarding your geo-location, mobile
              device, push notifications, when you use our apps.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          If you use our Apps, we may also collect the following information:
          {'\n'}
          {'\n'}
          {'\u2022'}{' '}
          <Text style={styles.italic}>Geo-Location Information.</Text> We may
          request access or permission track location-based information from
          your mobile device, either continuously or while you are using our
          mobile application, to provide location-based services. If you wish to
          change our access or permissions, you may do so in your device's
          settings.
          {'\n'}
          {'\n'}
          {'\u2022'} <Text style={styles.italic}>Mobile Device Access.</Text> We
          may request access or permission to certain features from your mobile
          device, including your mobile device's camera, camera, contacts,
          reminders, sms messages, social media accounts, storage, and other
          features. If you wish to change our access or permissions, you may do
          so in your device's settings.
          {'\n'}
          {'\n'}
          {'\u2022'} <Text style={styles.italic}>Mobile Device Data.</Text> We
          may automatically collect device information (such as your mobile
          device ID, model and manufacturer), operating system, version
          information and IP address.
          {'\n'}
          {'\n'}
          {'\u2022'} <Text style={styles.italic}>Push Notifications.</Text> We
          may request to send you push notifications regarding your account or
          the mobile application. If you wish to opt-out from receiving these
          types of communications, you may turn them off in your device's
          settings.
        </Text>
      </View>

      <View
        onLayout={event => {
          section2 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          2. HOW DO WE USE YOUR INFORMATION?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              We process your information for purposes based on legitimate
              business interests, the fulfillment of our contract with you,
              compliance with our legal obligations, and/or your consent.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          We use personal information collected via our Services or Apps for a
          variety of business purposes described below. We process your personal
          information for these purposes in reliance on our legitimate business
          interests, in order to enter into or perform a contract with you, with
          your consent, and/or for compliance with our legal obligations. We
          indicate the specific processing grounds we rely on next to each
          purpose listed below.
          {'\n'}
          {'\n'}
          We use the information we collect or receive:
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>
            To facilitate account creation and logon process.
          </Text>{' '}
          If you choose to link your account with us to a third party account
          (such as your Google or Facebook account), we use the information you
          allowed us to collect from those third parties to facilitate account
          creation and logon process for the performance of the contract. See
          the section below headed{' '}
          <Text style={styles.hyperlink} onPress={() => scrollTo(section6)}>
            "HOW DO WE HANDLE YOUR SOCIAL LOGINS"
          </Text>{' '}
          for further information.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>
            To send you marketing and promotional communications.
          </Text>{' '}
          We and/or our third party marketing partners may use the personal
          information you send to us for our marketing purposes, if this is in
          accordance with your marketing preferences. You can opt-out of our
          marketing emails at any time (see the{' '}
          <Text style={styles.hyperlink} onPress={() => scrollTo(section11)}>
            "WHAT ARE YOUR PRIVACY RIGHTS"
          </Text>{' '}
          below).
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>
            To send administrative information to you.
          </Text>{' '}
          We may use your personal information to send you product, service and
          new feature information and/or information about changes to our terms,
          conditions, and policies.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>To post testimonials.</Text> We post
          testimonials on our Services or Apps that may contain personal
          information. Prior to posting a testimonial, we will obtain your
          consent to use your name and testimonial. If you wish to update, or
          delete your testimonial, please contact us at info@ratetherefs.com and
          be sure to include your name, testimonial location, and contact
          information.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Request Feedback.</Text> We may use your
          information to request feedback and to contact you about your use of
          our Services or Apps.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>To protect our Services.</Text> We may use
          your information as part of our efforts to keep our Services or Apps
          safe and secure (for example, for fraud monitoring and prevention).
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>
            To enable user-to-user communications.
          </Text>{' '}
          We may use your information in order to enable user-to-user
          communications with each user's consent.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>
            To enforce our terms, conditions and policies for Business Purposes,
            Legal Reasons and Contractual.
          </Text>
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>
            To respond to legal requests and prevent harm.
          </Text>{' '}
          If we receive a subpoena or other legal request, we may need to
          inspect the data we hold to determine how to respond.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>To manage user accounts.</Text> We may use
          your information for the purposes of managing our account and keeping
          it in working order.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>To deliver services to the user.</Text> We
          may use your information to provide you with the requested service.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>
            To respond to user inquiries/offer support to users.
          </Text>{' '}
          We may use your information to respond to your inquiries and solve any
          potential issues you might have with the use of our Services.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>For other Business Purposes.</Text> We may
          use your information for other Business Purposes, such as data
          analysis, identifying usage trends, determining the effectiveness of
          our promotional campaigns and to evaluate and improve our Services or
          Apps, products, marketing and your experience. We may use and store
          this information in aggregated and anonymized form so that it is not
          associated with inpidual end users and does not include personal
          information. We will not use identifiable personal information without
          your consent.
        </Text>
      </View>

      <View
        onLayout={event => {
          section3 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              We only share information with your consent, to comply with laws,
              to provide you with services, to protect your rights, or to
              fulfill business obligations.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          We may process or share data based on the following legal basis:
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Consent:</Text> We may process your data if
          you have given us specific consent to use your personal information in
          a specific purpose.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Legitimate Interests:</Text> We may process
          your data when it is reasonably necessary to achieve our legitimate
          business interests.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Performance of a Contract:</Text> Where we
          have entered into a contract with you, we may process your personal
          information to fulfill the terms of our contract.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Legal Obligations:</Text> We may disclose
          your information where we are legally required to do so in order to
          comply with applicable law, governmental requests, a judicial
          proceeding, court order, or legal process, such as in response to a
          court order or a subpoena (including in response to public authorities
          to meet national security or law enforcement requirements).
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Vital Interests: </Text> We may disclose
          your information where we believe it is necessary to investigate,
          prevent, or take action regarding potential violations of our
          policies, suspected fraud, situations involving potential threats to
          the safety of any person and illegal activities, or as evidence in
          litigation in which we are involved.
          {'\n'}
          {'\n'}
          More specifically, we may need to process your data or share your
          personal information in the following situations:
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>
            Vendors, Consultants and Other Third-Party Service Providers.
          </Text>{' '}
          We may share your data with third party vendors, service providers,
          contractors or agents who perform services for us or on our behalf and
          require access to such information to do that work. Examples include:
          payment processing, data analysis, email delivery, hosting services,
          customer service and marketing efforts. We may allow selected third
          parties to use tracking technology on the Services or Apps, which will
          enable them to collect data about how you interact with the Services
          or Apps over time. This information may be used to, among other
          things, analyze and track data, determine the popularity of certain
          content and better understand online activity. Unless described in
          this Policy, we do not share, sell, rent or trade any of your
          information with third parties for their promotional purposes.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Business Transfers.</Text> We may share or
          transfer your information in connection with, or during negotiations
          of, any merger, sale of company assets, financing, or acquisition of
          all or a portion of our business to another company.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Third-Party Advertisers.</Text> We may use
          third-party advertising companies to serve ads when you visit the
          Services or Apps. These companies may use information about your
          visits to our Website(s) and other websites that are contained in web
          cookies and other tracking technologies in order to provide
          advertisements about goods and services of interest to you.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Business Partners.</Text> We may share your
          information with our business partners to offer you certain products,
          services or promotions.
          {'\n'}
          {'\n'}
          {'\u2022'}
          <Text style={styles.bold}>Other Users. </Text> When you share personal
          information (for example, by posting comments, contributions or other
          content to the Services or Apps) or otherwise interact with public
          areas of the Services or Apps, such personal information may be viewed
          by all users and may be publicly distributed outside the Services or
          Apps in perpetuity. If you interact with other users of our Services
          or Apps and register through a social network (such as Facebook), your
          contacts on the social network will see your name, profile photo, and
          descriptions of your activity. Similarly, other users will be able to
          view descriptions of your activity, communicate with you within our
          Services or Apps, and view your profile.
        </Text>
      </View>

      <View
        onLayout={event => {
          section4 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              We may use cookies and other tracking technologies to collect and
              store your information.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          We may use cookies and similar tracking technologies (like web beacons
          and pixels) to access or store information. Specific information about
          how we use such technologies and how you can refuse certain cookies is
          set out in our{' '}
          <Text
            style={styles.hyperlink}
            onPress={() =>
              Links.openUrl('https://www.ratetherefs.com/cookie-policy')
            }>
            Cookie Policy.
          </Text>
        </Text>
      </View>

      <View
        onLayout={event => {
          section5 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>5. DO WE USE GOOGLE MAPS?</Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              Yes, we use Google Maps for the purpose of providing better
              service.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          This website, mobile application, or Facebook application uses Google
          Maps APIs. You may find the Google Maps APIs Terms of Service{' '}
          <Text
            style={styles.hyperlink}
            onPress={() =>
              Links.openUrl('https://cloud.google.com/maps-platform/terms/')
            }>
            here.
          </Text>{' '}
          To better understand Google's Privacy Policy, please refer to this
          <Text
            style={styles.hyperlink}
            onPress={() =>
              Links.openUrl('https://policies.google.com/privacy')
            }>
            {' '}
            link.
          </Text>
          {'\n'}
          {'\n'}
          By using our Maps API Implementation, you agree to be bound by
          Google's Terms of Service. You agree to allow us to obtain or cache
          your location. You may revoke your consent at anytime. We use
          information about location in conjunction with data from other data
          providers.
        </Text>
      </View>

      <View
        onLayout={event => {
          section6 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              If you choose to register or log in to our services using a social
              media account, we may have access to certain information about
              you.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          Our Services or Apps offer you the ability to register and login using
          your third party social media account details (like your Facebook or
          Twitter logins). Where you choose to do this, we will receive certain
          profile information about you from your social media provider. The
          profile Information we receive may vary depending on the social media
          provider concerned, but will often include your name, e-mail address,
          friends list, profile picture as well as other information you choose
          to make public.
          {'\n'}
          {'\n'}
          We will use the information we receive only for the purposes that are
          described in this privacy policy or that are otherwise made clear to
          you on the Services or Apps. Please note that we do not control, and
          are not responsible for, other uses of your personal information by
          your third party social media provider. We recommend that you review
          their privacy policy to understand how they collect, use and share
          your personal information, and how you can set your privacy
          preferences on their sites and apps.
        </Text>
      </View>

      <View
        onLayout={event => {
          section7 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          7. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              We are not responsible for the safety of any information that you
              share with third-party providers who advertise, but are not
              affiliated with, our websites.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          The Services or Apps may contain advertisements from third parties
          that are not affiliated with us and which may link to other websites,
          online services or mobile applications. We cannot guarantee the safety
          and privacy of data you provide to any third parties. Any data
          collected by third parties is not covered by this privacy policy. We
          are not responsible for the content or privacy and security practices
          and policies of any third parties, including other websites, services
          or applications that may be linked to or from the Services or Apps.
          You should review the policies of such third parties and contact them
          directly to respond to your questions.
        </Text>
      </View>

      <View
        onLayout={event => {
          section8 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          8. HOW LONG DO WE KEEP YOUR INFORMATION?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              We keep your information for as long as necessary to fulfill the
              purposes outlined in this privacy policy unless otherwise required
              by law.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          We will only keep your personal information for as long as it is
          necessary for the purposes set out in this privacy policy, unless a
          longer retention period is required or permitted by law (such as tax,
          accounting or other legal requirements). No purpose in this policy
          will require us keeping your personal information for longer than 2
          years past the start of idle period of the user's account.
          {'\n'}
          {'\n'}
          When we have no ongoing legitimate business need to process your
          personal information, we will either delete or anonymize it, or, if
          this is not possible (for example, because your personal information
          has been stored in backup archives), then we will securely store your
          personal information and isolate it from any further processing until
          deletion is possible.
        </Text>
      </View>

      <View
        onLayout={event => {
          section9 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          9. HOW DO WE KEEP YOUR INFORMATION SAFE?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              We aim to protect your personal information through a system of
              organizational and technical security measures.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          We have implemented appropriate technical and organizational security
          measures designed to protect the security of any personal information
          we process. However, please also remember that we cannot guarantee
          that the internet itself is 100% secure. Although we will do our best
          to protect your personal information, transmission of personal
          information to and from our Services or Apps is at your own risk. You
          should only access the services within a secure environment.
        </Text>
      </View>

      <View
        onLayout={event => {
          section10 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          10. DO WE COLLECT INFORMATION FROM MINORS?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              We do not knowingly collect data from or market to children under
              18 years of age.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          We do not knowingly solicit data from or market to children under 18
          years of age. By using the Services or Apps, you represent that you
          are at least 18 or that you are the parent or guardian of such a minor
          and consent to such minor dependent’s use of the Services or Apps. If
          we learn that personal information from users less than 18 years of
          age has been collected, we will deactivate the account and take
          reasonable measures to promptly delete such data from our records. If
          you become aware of any data we have collected from children under age
          18, please contact us at info@ratetherefs.com.
        </Text>
      </View>

      <View
        onLayout={event => {
          section11 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          11. WHAT ARE YOUR PRIVACY RIGHTS?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              You may review, change, or terminate your account at any time.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          If you are resident in the European Economic Area and you believe we
          are unlawfully processing your personal information, you also have the
          right to complain to your local data protection supervisory authority.
          You can find their contact details here:{' '}
          <Text
            style={styles.hyperlink}
            onPress={() =>
              Links.openUrl(
                'https://ec.europa.eu/newsroom/article29/items/612080',
              )
            }>
            http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm.
          </Text>
          {'\n'}
          {'\n'}
          If you have questions or comments about your privacy rights, you may
          email us at info@ratetherefs.com.
          {'\n'}
          {'\n'}
          <Text style={styles.sectionHeader}>Account Information</Text>
          {'\n'}
          {'\n'}
          If you would at any time like to review or change the information in
          your account or terminate your account, you can:
          {'\n'}
          {'\n'}
          {'\u2022'}Log into your account settings and update your user account.
          {'\n'}
          {'\n'}
          Upon your request to terminate your account, we will deactivate or
          delete your account and information from our active databases.
          However, some information may be retained in our files to prevent
          fraud, troubleshoot problems, assist with any investigations, enforce
          our Terms of Use and/or comply with legal requirements.
          {'\n'}
          {'\n'}
          <Text style={[styles.bold, styles.underlined]}>
            Opting out of email marketing:
          </Text>{' '}
          You can You can You can unsubscribe from our marketing email list at
          any time any time clicking on the unsubscribe link in the emails that
          we send contacting us using the details provided below. You will then
          be removed from the marketing email list - however, we will still need
          to send you service-related emails that are necessary for the
          administration and use of your account. To otherwise opt-out, you may:
          {'\n'}
          {'\n'}
          {'\u2022'}Note your preferences when you register an account with the
          site.
          {'\n'}
          {'\n'}
          {'\u2022'}Access your account settings and update preferences.
        </Text>
      </View>

      <View
        onLayout={event => {
          section12 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          12. CONTROLS FOR DO-NOT-TRACK FEATURES
        </Text>
        <Text style={styles.p}>
          Most web browsers and some mobile operating systems and mobile
          applications include a Do-Not-Track (“DNT”) feature or setting you can
          activate to signal your privacy preference not to have data about your
          online browsing activities monitored and collected. No uniform
          technology standard for recognizing and implementing DNT signals has
          been finalized. As such, we do not currently respond to DNT browser
          signals or any other mechanism that automatically communicates your
          choice not to be tracked online. If a standard for online tracking is
          adopted that we must follow in the future, we will inform you about
          that practice in a revised version of this privacy policy.
        </Text>
      </View>

      <View
        onLayout={event => {
          section13 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          13. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              Yes, if you are a resident of California, you are granted specific
              rights regarding access to your personal information.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          California Civil Code Section 1798.83, also known as the “Shine The
          Light” law, permits our users who are California residents to request
          and obtain from us, once a year and free of charge, information about
          categories of personal information (if any) we disclosed to third
          parties for direct marketing purposes and the names and addresses of
          all third parties with which we shared personal information in the
          immediately preceding calendar year. If you are a California resident
          and would like to make such a request, please submit your request in
          writing to us using the contact information provided below.
          {'\n'}
          {'\n'}
          If you are under 18 years of age, reside in California, and have a
          registered account with the Services or Apps, you have the right to
          request removal of unwanted data that you publicly post on the
          Services or Apps. To request removal of such data, please contact us
          using the contact information provided below, and include the email
          address associated with your account and a statement that you reside
          in California. We will make sure the data is not publicly displayed on
          the Services or Apps, but please be aware that the data may not be
          completely or comprehensively removed from our systems.
        </Text>
      </View>

      <View
        onLayout={event => {
          section14 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          14. DO WE MAKE UPDATES TO THIS POLICY?
        </Text>
        <Text style={styles.p}>
          <Text style={styles.shorts}>
            <Text style={[styles.bold, styles.italic]}>In Short: </Text>
            <Text style={styles.italic}>
              Yes, we will update this policy as necessary to stay compliant
              with relevant laws.
            </Text>
          </Text>
          {'\n'}
          {'\n'}
          We may update this privacy policy from time to time. The updated
          version will be indicated by an updated “Revised” date and the updated
          version will be effective as soon as it is accessible. If we make
          material changes to this privacy policy, we may notify you either by
          prominently posting a notice of such changes or by directly sending
          you a notification. We encourage you to review this privacy policy
          frequently to be informed of how we are protecting your information.
        </Text>
      </View>

      <View
        onLayout={event => {
          section15 = event.nativeEvent.layout;
        }}>
        <Text style={styles.sectionTitle}>
          15. HOW CAN YOU CONTACT US ABOUT THIS POLICY?
        </Text>
        <Text style={styles.p}>
          If you have questions or comments about this policy, you may email us
          at info@ratetherefs.com or by post to:
          {'\n'}
          {'\n'}
          Rate The Refs, LLC
          {'\n'}
          {'\n'}
          521 S 515 W Cedar City, UT 84720 United States
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
      </Text>
      <Text style={styles.p}>
        Based on the laws of some countries, you may have the right to request
        access to the personal information we collect from you, change that
        information, or delete it in some circumstances. To request to review,
        update, or delete your personal information, please submit a request
        form by clicking{' '}
        <Text
          style={styles.hyperlink}
          onPress={() =>
            Links.openUrl(
              'https://app.termly.io/notify/028eb9f5-b5d7-44dd-a8c6-39f9cce3b6d1',
            )
          }>
          here
        </Text>
        . We will respond to your request within 30 days.
      </Text>
    </ScrollView>
  );
};

const styles = {
  container: {
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    ...global.textStyles.header,
    fontSize: 30,
    alignSelf: 'center',
    marginTop: 15,
  },
  p: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    ...global.textStyles.subText,
  },
  list: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  policyContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  bold: {
    fontWeight: 'bold',
  },
  underlined: {
    textDecorationLine: 'underline',
  },
  italic: {
    fontStyle: 'italic',
  },
  date: {
    ...global.textStyles.title,
    marginRight: 'auto',
    marginTop: 25,
    marginBottom: 25,
  },
  hyperlink: {
    color: 'rgb(68, 185, 237)',
  },
  sectionTitle: {
    paddingTop: 5,
    paddingBottom: 5,
    ...global.textStyles.header,
    color: 'rgb(68, 185, 237)',
    fontWeight: 'bold',
  },
  sectionHeader: {
    paddingTop: 5,
    paddingBottom: 5,
    ...global.textStyles.title,
    color: 'rgb(68, 185, 237)',
    fontWeight: 'bold',
  },
  shorts: {
    fontSize: 14,
  },
};

export default PolicyScreen;