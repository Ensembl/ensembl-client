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
import { useDispatch, useSelector } from 'react-redux';

import useSpeciesSelectorAnalytics from 'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics';

import { getSelectedItem } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { commitSelectedSpeciesAndSave } from 'src/content/app/species-selector/state/speciesSelectorActions';

import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './SpeciesCommitButton.scss';

export const SpeciesCommitButton = () => {
  const currentSpecies = useSelector(getSelectedItem);
  const dispatch = useDispatch();

  const { trackCommittedSpecies } = useSpeciesSelectorAnalytics();

  const handleClick = () => {
    dispatch(commitSelectedSpeciesAndSave());
    currentSpecies && trackCommittedSpecies(currentSpecies);
  };

  return currentSpecies ? (
    <div className={styles.speciesCommitButton}>
      <PrimaryButton onClick={handleClick}>Add</PrimaryButton>
    </div>
  ) : null;
};

export default SpeciesCommitButton;
