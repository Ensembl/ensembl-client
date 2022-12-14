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

import { getDisplayName } from 'src/shared/components/selected-species/selectedSpeciesHelpers';

import AlertButton from 'src/shared/components/alert-button/AlertButton';
import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './UrlError.scss';

type GenomeFields = {
  common_name: string | null;
  scientific_name: string;
};

type Props = {
  featureId: string;
  genome: GenomeFields | null;
  showTopBar?: boolean;
  onContinue: () => void;
};

const MissingFeatureError = (props: Props) => {
  const { featureId, genome, showTopBar, onContinue } = props;

  const speciesDisplayName = genome ? getDisplayName(genome) : 'this species';

  return (
    <div>
      {showTopBar && <div className={styles.topBar} />}
      <main className={styles.main}>
        <AlertButton className={styles.alertButton} />
        <div className={styles.errorMessage}>
          We do not recognise "{featureId}" in {speciesDisplayName}
        </div>
        <div className={styles.suggestion}>
          Find a gene or use the example links
        </div>
        <div className={styles.continueButtonWrapper}>
          <PrimaryButton onClick={onContinue}>Continue</PrimaryButton>
        </div>
      </main>
    </div>
  );
};

export default MissingFeatureError;
