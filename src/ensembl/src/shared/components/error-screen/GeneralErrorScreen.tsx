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

import { ReleaseVersion, Copyright } from 'src/header/Header';
// import { HomeLink } from 'src/header/header-buttons/HeaderButtons';

import { ReactComponent as Logotype } from 'static/img/brand/logotype.svg';

import styles from './ErrorScreen.scss';
import headerStyles from 'src/header/Header.scss';

import generalErrorImage1 from './images/general-error-1.jpg';
import generalErrorImage2 from './images/general-error-2.jpg';
import generalErrorImage3 from './images/general-error-3.jpg';

//       <HomeLink />

const GeneralErrorScreen = () => (
  <section className={styles.generalErrorScreen}>
    <header className={`${headerStyles.topbar} ${styles.generalErrorHeader}`}>
      <Logotype className={headerStyles.logotype} />
      <ReleaseVersion />
      <Copyright />
    </header>
    <div className={styles.generalErrorBody}>
      <p className={styles.generalErrorTopMessage}>
        Sorry, something seems to have gone wrong
      </p>
      <div className={styles.generalErrorImages}>
        <img src={generalErrorImage1} />
        <img src={generalErrorImage2} />
        <img src={generalErrorImage3} />
      </div>
      <div className={styles.generalErrorBottomMessage}>
        <p>We‘re trying to fix it right now</p>
        <p>Please try again later...</p>
      </div>
    </div>
  </section>
);

export default GeneralErrorScreen;
