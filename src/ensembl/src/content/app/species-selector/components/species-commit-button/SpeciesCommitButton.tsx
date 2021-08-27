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
import { connect } from 'react-redux';

import useAnalyticsService from 'ensemblRoot/src/shared/hooks/useAnalyticsService';

import {
  hasCurrentSpecies,
  canCommitSpecies,
  getSelectedItem
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { commitSelectedSpeciesAndSave } from 'src/content/app/species-selector/state/speciesSelectorActions';

import { PrimaryButton } from 'src/shared/components/button/Button';

import { CurrentItem } from 'src/content/app/species-selector/state/speciesSelectorState';
import { RootState } from 'src/store';

import styles from './SpeciesCommitButton.scss';

type Props = {
  hasCurrentSpecies: boolean; // tells whether a species has been selected and can be committed
  selectedItem: CurrentItem | null;
  disabled: boolean;
  onCommit: () => void;
};

export const SpeciesCommitButton = (props: Props) => {
  const { trackCommitedSpecies } = useAnalyticsService();

  const handleClick = () => {
    props.onCommit();
    props.selectedItem && trackCommitedSpecies(props.selectedItem);
  };

  return props.hasCurrentSpecies ? (
    <div className={styles.speciesCommitButton}>
      <PrimaryButton onClick={handleClick} isDisabled={props.disabled}>
        Add
      </PrimaryButton>
    </div>
  ) : null;
};

const mapStateToProps = (state: RootState) => ({
  hasCurrentSpecies: hasCurrentSpecies(state),
  selectedItem: getSelectedItem(state),
  disabled: !canCommitSpecies(state)
});

const mapDispatchToProps = {
  onCommit: commitSelectedSpeciesAndSave
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpeciesCommitButton);
