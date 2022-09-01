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

import * as urlFor from 'src/shared/helpers/urlHelper';

import ButtonLink from 'src/shared/components/button-link/ButtonLink';
import BlastJobListsNavigation from '../blast-job-lists-navigation/BlastJobListsNavigation';

import styles from './BlastViewsNavigation.scss';

const BlastViewsNavigation = () => {
  return (
    <div className={styles.blastViewsNavigation}>
      <div className={styles.leftColumn}>
        <div className={styles.wrapperLeft}>
          <h1 className={styles.title}>Blast</h1>
          <ButtonLink to={urlFor.blastForm()} end={true}>
            New job
          </ButtonLink>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.wrapperRight}>
          <BlastJobListsNavigation />
        </div>
      </div>
    </div>
  );
};

export default BlastViewsNavigation;
