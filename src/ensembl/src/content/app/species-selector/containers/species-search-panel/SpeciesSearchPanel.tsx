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

import {
  getCurrentSpeciesGenomeId,
  getCurrentSpeciesAssemblies
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import SpeciesSearchField from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';
import SpeciesCommitButton from 'src/content/app/species-selector/components/species-commit-button/SpeciesCommitButton';

import { Assembly } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSearchPanel.scss';

const SearchPanel = () => {
  return (
    <section className={styles.speciesSearchPanel}>
      <div className={styles.speciesSearchPanelRow}>
        <SpeciesSearchField />
        <SpeciesCommitButton />
      </div>
      <SelectedAssembly />
    </section>
  );
};

const SelectedAssembly = () => {
  const genomeId = useSelector(getCurrentSpeciesGenomeId);
  // TODO: we probably shouldn't be fetching alternative assemblies for a given genome id
  // If so, need to remove the fetching logic from redux, and change the shape of the state
  const assembliesRelatedToSelectedGenome: Assembly[] = useSelector(
    getCurrentSpeciesAssemblies
  );
  const selectedAssembly = assembliesRelatedToSelectedGenome.find(
    (assembly) => assembly.genome_id === genomeId
  );

  if (!genomeId || !selectedAssembly) {
    return null;
  }

  return (
    <div className={styles.selectedAssembly}>
      <span className={styles.selectedAssemblyLabel}>Assembly</span>
      <span>{selectedAssembly.assembly_name}</span>
    </div>
  );
};

export default SearchPanel;
