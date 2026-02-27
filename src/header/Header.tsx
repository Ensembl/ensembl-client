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

import { Link } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import useHasMounted from 'src/shared/hooks/useHasMounted';

import Launchbar from './launchbar/Launchbar';
import EnsemblReleaseVersion from './EnsemblReleaseVersion';

import Logotype from 'static/img/brand/logotype.svg';
import HomeIcon from 'static/icons/icon_home.svg';

import styles from './Header.module.css';

export const Copyright = () => (
  <div className={styles.copyright}>
    <a href="https://www.ebi.ac.uk" target="_blank" rel="noopener noreferrer">
      © EMBL-EBI
    </a>
  </div>
);

export const HomeLink = () => (
  <div className={styles.homeLink}>
    <Link to="/" aria-label="Ensembl home page">
      <HomeIcon />
    </Link>
  </div>
);

export const Topbar = () => (
  <div className={styles.topbar}>
    <div className={styles.topbarLeft}>
      <HomeLink />
      <div className={styles.logotypeWrapper}>
        <Link to="/" tabIndex={-1} aria-hidden="true">
          <Logotype className={styles.logotype} />
        </Link>
      </div>
      <div className={styles.topbarLeftText}>
        <EnsemblReleaseVersion />
        <Copyright />
      </div>
    </div>
    <div className={styles.topbarRight}>
      <span>Genome data & annotation</span>
      <Link to={urlFor.contactUs()} className={styles.contactUs}>
        Contact us
      </Link>
    </div>
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
