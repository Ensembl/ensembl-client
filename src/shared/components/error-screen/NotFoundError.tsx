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
import classNames from 'classnames';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { PrimaryButton } from '../button/Button';

import styles from './ErrorScreen.scss';

const NotFoundErrorScreen = () => {
  // TODO: 404s should be logged in the service monitoring system being developed by BE.

  const goToHomePage = () => {
    window.location.replace(urlFor.home());
  };

  return (
    <section className={styles.generalErrorScreen}>
      <div className={styles.generalErrorBody}>
        <p className={styles.generalErrorTopMessage}>Venn of the not found</p>
        <div className={styles.generalErrorImage}>
          <div className={classNames(styles.vennCircle, styles.vennCircleLeft)}>
            <span> We may have moved this page...</span>
          </div>
          <div
            className={classNames(styles.vennCircle, styles.vennCircleRight)}
          >
            <div className={styles.vennIntersection}>
              <div className={styles.infoText}>404</div>
            </div>
            <span>...or your link has changed or gone</span>
          </div>
        </div>
        <div className={styles.homeButton}>
          <PrimaryButton onClick={goToHomePage}>Home page</PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default NotFoundErrorScreen;
