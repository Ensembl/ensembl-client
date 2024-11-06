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

import { useNavigate } from 'react-router';

import { SpeciesSelectorIcon } from 'src/shared/components/app-icon';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { Step } from 'src/shared/components/step/Step';
import * as urlFor from 'src/shared/helpers/urlHelper';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import styles from './BiomartInterstitialInstructions.module.css';
import BiomartIcon from 'src/shared/components/app-icon/BiomartIcon';

const BiomartInterstitialInstructions = () => {
  const navigate = useNavigate();
  const { trackInterstitialPageNavigation } = useGenomeBrowserAnalytics();

  const goToSpeciesSelector = () => {
    trackInterstitialPageNavigation();
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
          <Step count={2} label="Return to this tool">
            <div className={styles.description}>
              <BiomartIcon />
              <div className={styles.iconLabel}>Biomart</div>
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

export default BiomartInterstitialInstructions;
