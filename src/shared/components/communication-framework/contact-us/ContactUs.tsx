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

import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppDispatch } from 'src/store';

import { toggleCommunicationPanel } from 'src/shared/state/communication/communicationSlice';

import { SecondaryButton } from 'src/shared/components/button/Button';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';
import SocialMediaLinks from 'src/shared/components/social-media-links/SocialMediaLinks';

import styles from './ContactUs.module.css';

const ContactUs = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onContactUsButtonClick = () => {
    dispatch(toggleCommunicationPanel());
    navigate(urlFor.contactUs());
  };

  return (
    <div className={styles.wrapper} ref={elementRef}>
      <section>
        <p>
          Please contact us if you have a problem with the website or need help
        </p>
        <SecondaryButton onClick={onContactUsButtonClick}>
          Contact us
        </SecondaryButton>
      </section>
      <section className={styles.socialMediaInfo}>
        <p>
          Visit the blog for details of releases, workshops and other tidbits of
          information about the Ensembl project.
        </p>
        <p>
          Visit Facebook or Twitter for the latest breaking Ensembl news and
          service status updates.
        </p>
        <SocialMediaLinks className={styles.socialMediaLinks} />
      </section>
      <section>
        <h2>Online Help</h2>
        <p>
          Each app has a Help icon (top right) that will show context-sensitive
          help for that view.
        </p>
        <p>All Help articles and videos can be found in the Help app.</p>
      </section>
      <section>
        <h2>Mailing lists</h2>
        <p> We have two public mailing lists: </p>
        <dl>
          <dt>
            <ExternalLink to="https://lists.ensembl.org/mailman/listinfo/announce_ensembl.org">
              announce
            </ExternalLink>
          </dt>
          <dd>
            a low-traffic list for release announcements and web status updates
          </dd>
          <dt>
            <ExternalLink to="https://lists.ensembl.org/mailman/listinfo/dev_ensembl.org">
              dev
            </ExternalLink>
          </dt>
          <dd>
            programming help from the Ensembl development team and other Ensembl
            power users
          </dd>
        </dl>
      </section>
    </div>
  );
};

export default ContactUs;
