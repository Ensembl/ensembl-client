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

import SpeciesSearchPanel from 'src/content/app/species-selector/containers/species-search-panel/SpeciesSearchPanel';
import SpeciesSelectorAppBar from './components/species-selector-app-bar/SpeciesSelectorAppBar';
import PopularSpeciesPanel from 'src/content/app/species-selector/containers/popular-species-panel/PopularSpeciesPanel';
import GeneSearchPanel from 'src/shared/components/gene-search-panel/GeneSearchPanel';

import styles from './SpeciesSelector.scss';

// TODO: figure out how gene search ought to work alongside the species search results
type View = 'default' | 'gene-search';

const SpeciesSelector = () => {
  const [currentView, setCurrentView] = useState<View>('default');

  const onGeneSearchClose = () => {
    setCurrentView('default');
  };

  const onGeneSearchToggle = () => {
    const nextView = currentView === 'default' ? 'gene-search' : 'default';
    setCurrentView(nextView);
  };

  const main =
    currentView === 'gene-search' ? (
      <GeneSearchPanel onClose={onGeneSearchClose} />
    ) : (
      <div>
        <SpeciesSearchPanel />
        <PopularSpeciesPanel />
      </div>
    );

  return (
    <div className={styles.grid}>
      <SpeciesSelectorAppBar
        onGeneSearchToggle={onGeneSearchToggle}
        isGeneSearchMode={currentView === 'gene-search'}
      />
      {main}
    </div>
  );
};

export default SpeciesSelector;
