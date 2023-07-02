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

import { useAppSelector, useAppDispatch } from 'src/store';

import { getSpeciesSelectorModalView } from './state/species-selector-ui-slice/speciesSelectorUISelectors';
import { setModalView } from 'src/content/app/new-species-selector/state/species-selector-ui-slice/speciesSelectorUISlice';

import SpeciesSelectorAppBar from './components/species-selector-app-bar/SpeciesSelectorAppBar';
import SpeciesSearchResultsModalAppBar from './components/species-selector-search-results-app-bar/SpeciesSelectorSearchResultsAppBar';
import SpeciesSelectorSelectionModalView from './components/species-selector-selection-modal-view/SpeciesSelectorSelectionModalView';

import styles from './SpeciesSelector.scss';

const SpeciesSelector = () => {
  const dispatch = useAppDispatch();
  const modalView = useAppSelector(getSpeciesSelectorModalView);

  const openSelectionModalView = () => {
    dispatch(setModalView('species-search'));
  };

  // TODO: add 'find a gene' functionality

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
      <div>
        This will be the page for our new species selector
        <div>
          <button onClick={openSelectionModalView}>Open modal view</button>
        </div>
      </div>
    );

  return (
    <div className={styles.grid}>
      {appBar}
      {body}
    </div>
  );
};

export default SpeciesSelector;
