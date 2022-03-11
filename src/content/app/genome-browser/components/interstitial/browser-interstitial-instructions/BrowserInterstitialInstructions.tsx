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
import { useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { Step } from 'src/shared/components/step/Step';
import { PrimaryButton } from 'src/shared/components/button/Button';
import {
  SpeciesSelectorIcon,
  GenomeBrowserIcon
} from 'src/shared/components/app-icon';

import SearchIcon from 'static/icons/icon_search.svg';

import styles from './BrowserInterstitialInstructions.scss';

const BrowserInterstitialInstructions = () => {
  const navigate = useNavigate();

  const goToSpeciesSelector = () => {
    const url = urlFor.speciesSelector();
    navigate(url);
  };

  return (
    <section className={styles.instructionsPanel}>
      <div className={styles.instructionsWrapper}>
        <div className={styles.stepWrapper}>
          <Step count={1} label="Find and add a species">
            <div className={styles.description}>
              <SpeciesSelectorIcon />
              <div className={styles.iconLabel}>Species Selector</div>
            </div>
          </Step>
        </div>

        <div className={styles.stepWrapper}>
          <Step count={2} label="Return to this app">
            <div className={styles.description}>
              <GenomeBrowserIcon />
              <div className={styles.iconLabel}>Genome Browser</div>
            </div>
          </Step>
        </div>

        <div className={styles.stepWrapper}>
          <Step
            count={3}
            label="Use Search or the example links to view a gene or region"
          >
            <div className={styles.searchDescription}>
              <SearchIcon className={styles.searchIcon} />
              <div className={styles.exampleText}>Example gene</div>
              <div className={styles.exampleText}>Example region</div>
            </div>
          </Step>
        </div>

        <PrimaryButton
          className={styles.speciesSelectorButton}
          onClick={goToSpeciesSelector}
        >
          Go to Species Selector
        </PrimaryButton>
      </div>
    </section>
  );
};

export default BrowserInterstitialInstructions;
