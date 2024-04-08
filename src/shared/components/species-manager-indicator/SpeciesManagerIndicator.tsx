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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';

import styles from './SpeciesManagerIndicator.module.css';

type Props =
  | {
      mode?: 'default';
    }
  | {
      mode: 'close';
      onClose: () => void;
    };

const SpeciesManagerIndicator = (props: Props) => {
  const { mode = 'default' } = props;
  const selectedSpecies = useAppSelector(getCommittedSpecies);

  // temporarily hide on live deployments
  if (isEnvironment([Environment.PRODUCTION])) {
    return null;
  }

  const totalSpeciesCount = selectedSpecies.length;
  const enabledSpeciesCount = selectedSpecies.filter(
    (species) => species.isEnabled
  ).length;

  const onClose = props.mode === 'close' ? props.onClose : undefined;

  const pathToSpeciesManager = urlFor.speciesManager();

  return totalSpeciesCount > 0 ? (
    <div className={styles.container}>
      <SpeciesInUse
        enabledSpeciesCount={enabledSpeciesCount}
        totalSpeciesCount={totalSpeciesCount}
      />
      {mode === 'default' && <Link to={pathToSpeciesManager}>Manage</Link>}
      {mode === 'close' && <CloseButtonWithLabel onClick={onClose} />}
    </div>
  ) : null;
};

const SpeciesInUse = ({
  enabledSpeciesCount,
  totalSpeciesCount
}: {
  enabledSpeciesCount: number;
  totalSpeciesCount: number;
}) => {
  return (
    <div className={styles.speciesInUse}>
      <span className={styles.label}>
        <span className={styles.light}>Species</span> in use
      </span>
      <div className={styles.speciesInUsePill}>
        <span className={styles.speciesInUseNumerator}>
          {enabledSpeciesCount}
        </span>
        <span className={styles.speciesInUseDenominator}>
          /{totalSpeciesCount}
        </span>
      </div>
    </div>
  );
};

export default SpeciesManagerIndicator;
