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

import React, { useState } from 'react';

import { SecondaryButton } from 'src/shared/components/button/Button';
import ExternalLink from 'src/shared/components/external-link/ExternalLink';

import { ReactComponent as BlogIcon } from 'static/img/home/blog.svg';
import { ReactComponent as FacebookIcon } from 'static/img/home/facebook.svg';
import { ReactComponent as TwitterIcon } from 'static/img/home/twitter.svg';

import styles from './ContactUs.scss';

const ContactUs = () => {
  const [shouldShowForm, setShouldShowForm] = useState(false);

  if (shouldShowForm) {
    return <div>Will display the form</div>;
  }

  const externalLinkClass = { link: styles.externalLink };

  return (
    <div className={styles.wrapper}>
      <div>
        <p>
          Please contact us if you have a problem with the website or need help
        </p>
        <SecondaryButton onClick={() => setShouldShowForm(!shouldShowForm)}>
          Contact us
        </SecondaryButton>
      </div>
      <div>
        <section className={styles.socialMediaInfo}>
          <p>
            Visit the blog for details of releases, workshops and other tidbits
            of information about the Ensembl project.
          </p>
          <p>
            Visit Facebook or Twitter for the latest breaking Ensembl news and
            service status updates.
          </p>
          <p>
            <a href="https://www.ensembl.info/">
              <span className={styles.socialMediaLinkText}>Ensembl Blog</span>{' '}
              <BlogIcon className={styles.icon} />{' '}
            </a>
            <a href="https://www.facebook.com/Ensembl.org/">
              <FacebookIcon className={styles.icon} />{' '}
            </a>
            <a href="https://twitter.com/ensembl">
              <TwitterIcon className={styles.icon} />
            </a>
          </p>
        </section>
        <section>
          <h2>Online Help</h2>
          <p>
            Each app has a Help icon (top right) that will show
            context-sensitive help for that view.
          </p>
          <p>All Help articles and videos can be found in the Help app.</p>
        </section>
        <section>
          <h2>Mailing lists</h2>
          <p> We have two public mailing lists: </p>
          <dl>
            <dt>
              <ExternalLink
                linkText="announce"
                to="https://www.ensembl.info/category/01-release/"
                classNames={externalLinkClass}
              />
            </dt>
            <dd>
              a low-traffic list for release announcements and web status
              updates
            </dd>
            <dt>
              <ExternalLink
                linkText="dev"
                to=""
                classNames={externalLinkClass}
              />
            </dt>
            <dd>
              programming help from the Ensembl development team and other
              Ensembl power users
            </dd>
          </dl>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
