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

import React from 'react';
import { Link } from 'react-router-dom';

import useHasMounted from 'src/shared/hooks/useHasMounted';

import Launchbar from './launchbar/Launchbar';

import { ReactComponent as Logotype } from 'static/img/brand/logotype.svg';
import { ReactComponent as HomeIcon } from 'static/img/header/home.svg';

import styles from './Header.scss';

export const ReleaseVersion = () => (
  <div className={styles.release}>Pre-release</div>
);

export const Copyright = () => (
  <div className={styles.copyright}>
    <a href="https://www.ebi.ac.uk" target="_blank" rel="noopener noreferrer">
      © EMBL-EBI
    </a>
  </div>
);

export const HomeLink = (
  { useRegularLink }: { useRegularLink?: boolean } = { useRegularLink: false }
) => (
  <div className={styles.homeLink}>
    {useRegularLink ? (
      <a href="/">
        <HomeIcon />
      </a>
    ) : (
      <Link to="/">
        <HomeIcon />
      </Link>
    )}
  </div>
);

export const Topbar = (
  { useRegularHomeLink }: { useRegularHomeLink?: boolean } = {
    useRegularHomeLink: false
  }
) => (
  <div className={styles.topbar}>
    <div className={styles.topbarLeft}>
      <HomeLink useRegularLink={useRegularHomeLink} />
      <div className={styles.topbarLeftTextBlock}>
        <div className={styles.logotypeWrapper}>
          <Logotype className={styles.logotype} />
        </div>
        <div className={styles.logotypeAssociatedText}>
          <ReleaseVersion />
          <Copyright />
        </div>
      </div>
    </div>
    <div className={styles.topbarRight}>Genome data & annotation</div>
  </div>
);

export const Header = () => {
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <header />;
  }

  return (
    <header>
      <Topbar />
      <Launchbar />
    </header>
  );
};

export default Header;
