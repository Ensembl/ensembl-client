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
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { Step } from 'src/shared/components/step/Step';
import { ImageButton } from 'src/shared/components/image-button/ImageButton';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { Status } from 'src/shared/types/status';

import { ReactComponent as SpeciesSelectorIcon } from 'static/img/launchbar/species-selector.svg';
import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as SearchIcon } from 'static/img/sidebar/search.svg';

import styles from './BrowserInterstitialInstructions.scss';

const BrowserInterstitialInstructions = () => {
  const dispatch = useDispatch();

  const goToSpeciesSelector = () => {
    const url = urlFor.speciesSelector();
    dispatch(push(url));
  };

  return (
    <section className={styles.instructionsPanel}>
      <div className={styles.instructionsWrapper}>
        <div className={styles.stepWrapper}>
          <Step count={1} label="Find and add a species">
            <div className={styles.description}>
              <ImageButton
                className={styles.imageButtonIcon}
                status={Status.DISABLED}
                image={SpeciesSelectorIcon}
              />
              <div className={styles.iconLabel}>Species Selector</div>
            </div>
          </Step>
        </div>

        <div className={styles.stepWrapper}>
          <Step count={2} label="Return to this app">
            <div className={styles.description}>
              <ImageButton
                className={styles.imageButtonIcon}
                status={Status.DISABLED}
                image={BrowserIcon}
              />
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
              <ImageButton
                className={styles.searchButtonIcon}
                status={Status.DISABLED}
                image={SearchIcon}
              />
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
