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

import { useAppSelector } from 'src/store';

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import {
  GenomeBrowserIcon,
  SpeciesSelectorIcon,
  GlobalSearchIcon,
  EntityViewerIcon,
  CustomDownloadIcon,
  HelpIcon
} from 'src/shared/components/app-icon';
import LaunchbarButton from './LaunchbarButton';
import BlastLaunchbarButton from './BlastLaunchbarButton';

import Logotype from 'static/img/brand/logotype.svg';

import styles from './Launchbar.scss';

export const getCategoryClass = (separator: boolean): string => {
  return separator ? 'border' : '';
};

const Launchbar = () => {
  const committedSpecies = useAppSelector(getEnabledCommittedSpecies);

  return (
    <div className={styles.launchbar}>
      <div className={styles.categoriesWrapper}>
        <div className={styles.categories}>
          <div className={styles.category}>
            <LaunchbarButton
              path="/global-search"
              description="Site search"
              icon={GlobalSearchIcon}
              enabled={false}
            />
            <LaunchbarButton
              path="/species-selector"
              description="Species selector"
              icon={SpeciesSelectorIcon}
              enabled={true}
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              path="/genome-browser"
              description="Genome browser"
              icon={GenomeBrowserIcon}
              enabled={true}
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              path="/entity-viewer"
              description="Entity Viewer"
              icon={EntityViewerIcon}
              enabled={true}
            />
          </div>
          {isEnvironment([Environment.DEVELOPMENT, Environment.INTERNAL]) && (
            <div className={styles.category}>
              <BlastLaunchbarButton />
            </div>
          )}
          {isEnvironment([Environment.DEVELOPMENT, Environment.INTERNAL]) && (
            <div className={styles.category}>
              <LaunchbarButton
                path="/custom-download"
                description="Downloads"
                icon={CustomDownloadIcon}
                enabled={committedSpecies.length > 0}
              />
            </div>
          )}
          <div className={styles.category}>
            <LaunchbarButton
              path="/help"
              description="Help & documentation"
              icon={HelpIcon}
              enabled={true}
            />
          </div>
        </div>
      </div>
      <AboutEnsembl />
    </div>
  );
};

const AboutEnsembl = () => (
  <Link to="/about" className={styles.aboutEnsembl}>
    About the
    <Logotype className={styles.logotype} />
    team & its work
  </Link>
);

export default Launchbar;
