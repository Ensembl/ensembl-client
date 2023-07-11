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

import React, { useState, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';

import { getSpeciesSearchQuery } from 'src/content/app/new-species-selector/state/species-selector-search-slice/speciesSelectorSearchSelectors';

import { useLazyGetSpeciesSearchResultsQuery } from 'src/content/app/new-species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import { setQuery } from 'src/content/app/new-species-selector/state/species-selector-search-slice/speciesSelectorSearchSlice';
import { setModalView } from 'src/content/app/new-species-selector/state/species-selector-ui-slice/speciesSelectorUISlice';

import ModalView from 'src/shared/components/modal-view/ModalView';
import SpeciesSearchField from 'src/content/app/new-species-selector/components/species-search-field/SpeciesSearchField';
import SpeciesSearchResultsSummary from 'src/content/app/new-species-selector/components/species-search-results-summary/SpeciesSearchResultsSummary';
import SpeciesSearchResultsTable from 'src/content/app/new-species-selector/components/species-search-results-table/SpeciesSearchResultsTable';

import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

import styles from './SpeciesSelectorResultsView.scss';

const SpeciesSelectorResultslView = () => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(setQuery(''));
    dispatch(setModalView(null));
  };

  return (
    <ModalView onClose={onClose}>
      <Content />
    </ModalView>
  );
};

const Content = () => {
  const query = useAppSelector(getSpeciesSearchQuery);
  const [searchTrigger, result] = useLazyGetSpeciesSearchResultsQuery();
  const { currentData } = result;
  const [preselectedSpecies, setPreselectedSpecies] = useState<
    SpeciesSearchMatch[]
  >([]);
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  useEffect(() => {
    searchTrigger({ query });
  }, []);

  const onSearchSubmit = () => {
    searchTrigger({ query });
  };

  const onSpeciesPreselectToggle = (
    species: SpeciesSearchMatch,
    isAdding?: boolean
  ) => {
    if (isAdding) {
      setPreselectedSpecies([...preselectedSpecies, species]);
    } else {
      const updatedList = preselectedSpecies.filter(
        ({ genome_id }) => genome_id !== species.genome_id
      );
      setPreselectedSpecies(updatedList);
    }
  };

  const onTableExpandToggle = () => {
    setIsTableExpanded(!isTableExpanded);
  };

  return (
    <div className={styles.main}>
      <SpeciesSearchField onSearchSubmit={onSearchSubmit} />
      <SpeciesSearchResultsSummary searchResult={currentData} />
      {currentData && (
        <div className={styles.tableContainer}>
          <SpeciesSearchResultsTable
            results={currentData.matches}
            isExpanded={isTableExpanded}
            onTableExpandToggle={onTableExpandToggle}
            preselectedSpecies={preselectedSpecies}
            onSpeciesSelectToggle={onSpeciesPreselectToggle}
          />
        </div>
      )}
    </div>
  );
};

export default SpeciesSelectorResultslView;
