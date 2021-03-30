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
import { useSelector } from 'react-redux';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { ReactComponent as SearchIcon } from 'static/img/launchbar/search.svg';
import { ReactComponent as SpeciesSelectorIcon } from 'static/img/launchbar/species-selector.svg';
import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';
import { ReactComponent as CustomDownloadIcon } from 'static/img/launchbar/custom-download.svg';
import { ReactComponent as HelpIcon } from 'static/img/launchbar/help.svg';
import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import LaunchbarButton from './LaunchbarButton';

import styles from './Launchbar.scss';

export const getCategoryClass = (separator: boolean): string => {
  return separator ? 'border' : '';
};

const Launchbar = () => {
  const committedSpecies = useSelector(getEnabledCommittedSpecies);

  return (
    <div className={styles.launchbar}>
      <div className={styles.categoriesWrapper}>
        <div className={styles.categories}>
          <div className={styles.category}>
            <LaunchbarButton
              app="global-search"
              description="Site search"
              icon={SearchIcon}
              enabled={false}
            />
            <LaunchbarButton
              app="species-selector"
              description="Species selector"
              icon={SpeciesSelectorIcon}
              enabled={true}
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              app="genome-browser"
              description="Genome browser"
              icon={BrowserIcon}
              enabled={committedSpecies.length > 0}
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              app="entity-viewer"
              description="Entity Viewer"
              icon={EntityViewerIcon}
              enabled={committedSpecies.length > 0}
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              app="custom-download"
              description="Downloads"
              icon={CustomDownloadIcon}
              enabled={
                isEnvironment([
                  Environment.DEVELOPMENT,
                  Environment.INTERNAL
                ]) && committedSpecies.length > 0
              }
            />
          </div>
          <div className={styles.category}>
            <LaunchbarButton
              app="help-docs"
              description="Help & documentation"
              icon={HelpIcon}
              enabled={false}
            />
          </div>
        </div>
      </div>
      <div className={styles.about}>
        <span className={styles.aboutText}>Genome data & annotation</span>
      </div>
    </div>
  );
};

export default Launchbar;
