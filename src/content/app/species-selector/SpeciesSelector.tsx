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

import React, { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getSpeciesSelectorModalView } from './state/species-selector-ui-slice/speciesSelectorUISelectors';
import { setModalView } from 'src/content/app/species-selector/state/species-selector-ui-slice/speciesSelectorUISlice';

import SpeciesSelectorAppBar from './components/species-selector-app-bar/SpeciesSelectorAppBar';
import SpeciesSearchResultsModalAppBar from './components/species-selector-search-results-app-bar/SpeciesSelectorSearchResultsAppBar';
import SpeciesSelectorResultsView from './views/species-selector-results-view/SpeciesSelectorResultsView';
import SpeciesSelectorMainView from './views/species-selector-main-view/SpeciesSelectorMainView';
import SpeciesSelectorGeneSearchView from './views/species-selector-gene-search-view/SpeciesSelectorGeneSearchView';

import styles from './SpeciesSelector.module.css';

const SpeciesSelector = () => {
  const modalView = useAppSelector(getSpeciesSelectorModalView);
  const dispatch = useAppDispatch();

  const shouldShowResultsView = [
    'species-search',
    'popular-species-genomes'
  ].includes(modalView || '');

  useEffect(() => {
    return () => {
      // close the modal view when leaving Species Selector
      dispatch(setModalView(null));
    };
  }, []);

  const appBar = shouldShowResultsView ? (
    <SpeciesSearchResultsModalAppBar />
  ) : (
    <SpeciesSelectorAppBar />
  );

  const body = shouldShowResultsView ? (
    <SpeciesSelectorResultsView />
  ) : modalView === 'gene-search' ? (
    <SpeciesSelectorGeneSearchView />
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
