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
import { Route, Routes } from 'react-router-dom';

import SpeciesSelectorAppBar from './components/species-selector-app-bar/SpeciesSelectorAppBar';
import SpeciesSearchResultsModalAppBar from './components/species-selector-search-results-app-bar/SpeciesSelectorSearchResultsAppBar';
import SpeciesManagerAppBar from './views/species-manager/species-manager-app-bar/SpeciesManagerAppBar';
import SpeciesSelectorResultsView from './views/species-selector-results-view/SpeciesSelectorResultsView';
import SpeciesSelectorMainView from './views/species-selector-main-view/SpeciesSelectorMainView';
import SpeciesSelectorGeneSearchView from './views/species-selector-gene-search-view/SpeciesSelectorGeneSearchView';
import SpeciesManager from './views/species-manager/SpeciesManager';

import styles from './SpeciesSelector.module.css';

const SpeciesSelector = () => {
  const appBar = (
    <Routes>
      <Route index element={<SpeciesSelectorAppBar />} />
      <Route path="/search" element={<SpeciesSearchResultsModalAppBar />} />
      <Route path="/search/gene" element={<SpeciesSelectorAppBar />} />
      <Route path="/manage-species" element={<SpeciesManagerAppBar />} />
    </Routes>
  );

  const body = (
    <Routes>
      <Route index element={<SpeciesSelectorMainView />} />
      <Route path="/search" element={<SpeciesSelectorResultsView />} />
      <Route path="/search/gene" element={<SpeciesSelectorGeneSearchView />} />
      <Route path="/manage-species" element={<SpeciesManager />} />
    </Routes>
  );

  return (
    <div className={styles.grid}>
      {appBar}
      {body}
    </div>
  );
};

export default SpeciesSelector;
