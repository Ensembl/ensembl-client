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
import noop from 'lodash/noop';

import { useAppSelector } from 'src/store';

import { getSpeciesSelectorModalView } from './state/species-selector-ui-slice/speciesSelectorUISelectors';

import SpeciesSelectorAppBar from './components/species-selector-app-bar/SpeciesSelectorAppBar';
import SpeciesSearchResultsModalAppBar from './components/species-selector-search-results-app-bar/SpeciesSelectorSearchResultsAppBar';
import SpeciesSelectorSelectionModalView from './components/species-selector-selection-modal-view/SpeciesSelectorSelectionModalView';
import SpeciesSelectorMainView from './views/species-selector-main-view/SpeciesSelectorMainView';

import styles from './SpeciesSelector.scss';

const SpeciesSelector = () => {
  const modalView = useAppSelector(getSpeciesSelectorModalView);

  const appBar =
    modalView === 'species-search' ? (
      <SpeciesSearchResultsModalAppBar />
    ) : (
      <SpeciesSelectorAppBar
        onGeneSearchToggle={noop}
        isGeneSearchMode={false}
      />
    );

  const body =
    modalView === 'species-search' ? (
      <SpeciesSelectorSelectionModalView />
    ) : (
      <SpeciesSelectorMainView />
    );

  return (
    <div className={styles.grid}>
      {appBar}
      {body}
    </div>
  );
};

export default SpeciesSelector;
