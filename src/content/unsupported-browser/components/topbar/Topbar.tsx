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

import Logotype from 'static/img/brand/logotype.svg';
import HomeIcon from 'static/icons/icon_home.svg';

import styles from './Topbar.module.css';

// A version of the Topbar, styled somewhat differently from the Topbar in the Header component
// Shows a bit less, does not use React Router, and should support small screens

const Topbar = () => (
  <div className={styles.topbar}>
    <a href="/" className={styles.homeLink}>
      <HomeIcon className={styles.homeIcon} />
    </a>
    <span className={styles.logotypeWrapper}>
      <Logotype className={styles.logotype} />
    </span>
    <a
      className={styles.copyright}
      href="https://www.ebi.ac.uk"
      target="_blank"
      rel="noopener noreferrer"
    >
      © EMBL-EBI
    </a>
    <span className={styles.topbarRight}>Genome data & annotation</span>
  </div>
);

export default Topbar;
