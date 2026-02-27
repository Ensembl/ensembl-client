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

import classNames from 'classnames';

import facebookIconUrl from 'static/icons/icon_facebook.svg?url';
import twitterIconUrl from 'static/icons/icon_twitter.svg?url';
import blueskyIconUrl from 'static/icons/icon_bluesky.svg?url';
import linkedinIconUrl from 'static/icons/icon_linkedin.svg?url';

import styles from './SocialMediaLinks.module.css';

type Props = {
  className?: string;
};

const SocialMediaLinks = (props: Props) => {
  const componentStyles = classNames(styles.container, props.className);

  return (
    <div className={componentStyles}>
      <a
        className={styles.blog}
        href="https://www.ensembl.info"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ensembl blog
      </a>
      <a
        href="https://bsky.app/profile/ensembl.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          data-part="bluesky-icon"
          src={blueskyIconUrl}
          className={styles.mediaIcon}
          alt="Ensembl profile on Blue Sky"
        />
      </a>
      <a
        href="https://www.linkedin.com/company/ensemblgenomebrowser/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          data-part="linkedin-icon"
          src={linkedinIconUrl}
          className={styles.mediaIcon}
          alt="Ensembl profile on LinkedIn"
        />
      </a>
      <a
        href="https://www.facebook.com/Ensembl.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          data-part="facebook-icon"
          src={facebookIconUrl}
          className={styles.mediaIcon}
          alt="Ensembl profile on Facebook"
        />
      </a>
      <a href="https://x.com/ensembl" target="_blank" rel="noopener noreferrer">
        <img
          data-part="twitter-icon"
          src={twitterIconUrl}
          className={styles.mediaIcon}
          alt="Ensembl profile on X"
        />
      </a>
    </div>
  );
};

export default SocialMediaLinks;
