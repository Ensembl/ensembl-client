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

import SpeciesSearchField from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';
import SpeciesCommitButton from 'src/content/app/species-selector/components/species-commit-button/SpeciesCommitButton';
import AssemblySelector from 'src/content/app/species-selector/components/assembly-selector/AssemblySelector';

import styles from './SpeciesSearchPanel.scss';

const SearchPanel = () => {
  return (
    <section className={styles.speciesSearchPanel}>
      <div className={styles.speciesSearchPanelRow}>
        <SpeciesSearchField />
        <SpeciesCommitButton />
      </div>
      <div className={styles.assemblyWrapper}>
        <AssemblySelector />
      </div>
    </section>
  );
};

export default SearchPanel;
