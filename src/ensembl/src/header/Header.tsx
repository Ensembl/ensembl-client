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

import HeaderButtons from './header-buttons/HeaderButtons';
import LaunchbarContainer from './launchbar/LaunchbarContainer';
import Account from './account/Account';

import { ReactComponent as Logotype } from 'static/img/brand/logotype.svg';

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

export const Header = () => (
  <header>
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <Logotype className={styles.logotype} />
        <ReleaseVersion />
        <Copyright />
      </div>
      <HeaderButtons />
    </div>
    <Account />
    <LaunchbarContainer />
  </header>
);

export default Header;
