/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import privacyConfig from 'src/shared/components/privacy-banner/privacyConfig';

import ContactUsTopBar from './components/contact-us-top-bar/ContactUsTopBar';
import { DefaultContactUsForm } from './components/contact-us-form';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import SocialMediaLinks from 'src/shared/components/social-media-links/SocialMediaLinks';

import styles from './ContactUs.module.css';

const ContactUs = () => {
  return (
    <div className={styles.page}>
      <ContactUsTopBar />
      <div className={styles.scrollableContent}>
        <DefaultContactUsForm />
        <footer>
          <div className={styles.personalData}>
            <span className={styles.light}>How we use your personal data </span>
            <ExternalLink to={privacyConfig.policyUrl}>
              Privacy policy
            </ExternalLink>
          </div>
          <div className={styles.footerLevel2}>
            <SocialMediaLinks />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ContactUs;
