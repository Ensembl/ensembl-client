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

import React, { FunctionComponent } from 'react';
import privacyConfig from './privacyConfig';

import styles from './PrivacyBanner.module.css';

type PrivacyBannerProps = {
  closeBanner: () => void;
};

export const PrivacyBanner: FunctionComponent<PrivacyBannerProps> = (
  props: PrivacyBannerProps
) => {
  return (
    <section className={styles.privacyBanner}>
      <p>
        This website requires cookies, and the limited processing of your
        personal data in order to function. By using the site you are agreeing
        to this as outlined in our{' '}
        <a
          href={privacyConfig.policyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>{' '}
        and
        <a
          href={privacyConfig.termsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          Terms of Use
        </a>
        .
        <button className={styles.agreeButton} onClick={props.closeBanner}>
          I agree
        </button>
      </p>
    </section>
  );
};

export default PrivacyBanner;
