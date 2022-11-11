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

import React, { useState } from 'react';

import { useAppSelector } from 'src/store';

import { getSelectedItem } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import SpeciesSearchField from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';
import SpeciesCommitButton from 'src/content/app/species-selector/components/species-commit-button/SpeciesCommitButton';
import FindGeneInstructions from 'src/content/app/species-selector/components/find-gene-instructions/FindGeneInstructions';
import ShowHide from 'src/shared/components/show-hide/ShowHide';

import styles from './SpeciesSearchPanel.scss';

const SearchPanel = () => {
  const [shouldShowFindGeneInstructions, showFindGeneInstructions] =
    useState(false);

  return (
    <section className={styles.speciesSearchPanel}>
      <div className={styles.speciesSearchPanelRow}>
        <SpeciesSearchField />
        <SpeciesCommitButton />
      </div>
      <SelectedAssembly />
      <ShowHide
        label="How to find genes"
        isExpanded={shouldShowFindGeneInstructions}
        onClick={() =>
          showFindGeneInstructions(!shouldShowFindGeneInstructions)
        }
        className={styles.showHide}
      />
      {shouldShowFindGeneInstructions && <FindGeneInstructions />}
    </section>
  );
};

const SelectedAssembly = () => {
  const selectedSpecies = useAppSelector(getSelectedItem);
  const selectedAssembly = selectedSpecies?.assembly_name;

  if (!selectedAssembly) {
    return null;
  }

  return (
    <div className={styles.selectedAssembly}>
      <span className={styles.selectedAssemblyLabel}>Assembly</span>
      <span>{selectedAssembly}</span>
    </div>
  );
};

export default SearchPanel;
