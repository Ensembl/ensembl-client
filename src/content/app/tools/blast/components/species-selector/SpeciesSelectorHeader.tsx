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
import { useSelector, useDispatch } from 'react-redux';

import {
  switchToSequencesStep,
  clearSelectedSpecies
} from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { getSelectedSpecies } from 'src/content/app/tools/blast//state/blast-form/blastFormSelectors';

import { SecondaryButton } from 'src/shared/components/button/Button';

import styles from './SpeciesSelector.scss';

export type Props = {
  compact: boolean;
};

const SpeciesSelectorHeader = (props: Props) => {
  const { compact } = props;
  const dispatch = useDispatch();

  const selectedSpecies = useSelector(getSelectedSpecies);

  const onSwitchToSequence = () => {
    dispatch(switchToSequencesStep());
  };

  const onClearAll = () => {
    dispatch(clearSelectedSpecies());
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerGroup}>
        <span className={styles.headerTitle}>Blast against</span>
        <span className={styles.speciesCounter}>
          {Object.keys(selectedSpecies).length}
        </span>
        <span className={styles.maxSpecies}>of 7 species</span>
        {compact && (
          <span className={styles.clearAll} onClick={onClearAll}>
            Clear all
          </span>
        )}
      </div>
      <div className={styles.headerGroup}>
        {!compact && (
          <span className={styles.clearAll} onClick={onClearAll}>
            Clear all
          </span>
        )}
        {compact && (
          <SecondaryButton
            className={styles.sequencesButton}
            onClick={onSwitchToSequence}
          >
            Sequences
          </SecondaryButton>
        )}
      </div>
    </div>
  );
};

export default SpeciesSelectorHeader;
