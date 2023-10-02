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

import { useLazyGetSpeciesSearchResultsQuery } from 'src/content/app/new-species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import useSelectableGenomesTable from 'src/content/app/new-species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import AddFoundSpecies from 'src/content/app/new-species-selector/components/species-search-field/AddFoundSpecies';
import SpeciesSearchField from '../species-search-field/SpeciesSearchField';
import SpeciesSearchResultsSummary from 'src/content/app/new-species-selector/components/species-search-results-summary/SpeciesSearchResultsSummary';
import SpeciesSearchResultsTable from 'src/content/app/new-species-selector/components/species-search-results-table/SpeciesSearchResultsTable';

import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

import styles from './GenomeSelectorBySearchQuery.scss';

type Props = {
  query: string;
  onSpeciesAdd: (genomes: SpeciesSearchMatch[]) => void;
  onClose: () => void;
};

const GenomeSelectorBySearchQuery = (props: Props) => {
  const { query, onClose } = props;
  const [canSubmitSearch, setCanSubmitSearch] = useState(false);
  const [searchTrigger, result] = useLazyGetSpeciesSearchResultsQuery();
  const { currentData } = result;

  const {
    genomes,
    stagedGenomes,
    isTableExpanded,
    onTableExpandToggle,
    onGenomePreselectToggle
  } = useSelectableGenomesTable(currentData?.matches ?? []);

  useEffect(() => {
    searchTrigger({ query });
  }, []);

  const onSearchInput = () => {
    if (!canSubmitSearch) {
      setCanSubmitSearch(true);
    }
  };

  const onSpeciesAdd = () => {
    props.onSpeciesAdd(stagedGenomes);
  };

  const onSearchSubmit = () => {
    searchTrigger({ query });
    setCanSubmitSearch(false);
  };

  return (
    <div className={styles.main}>
      {currentData?.matches.length ? (
        <AddFoundSpecies
          query={query}
          canAdd={stagedGenomes.length > 0}
          onAdd={onSpeciesAdd}
          onCancel={onClose}
        />
      ) : (
        <SpeciesSearchField
          onInput={onSearchInput}
          canSubmit={canSubmitSearch}
          onSearchSubmit={onSearchSubmit}
        />
      )}

      {currentData && (
        <>
          <SpeciesSearchResultsSummary searchResult={currentData} />

          {currentData.matches.length > 0 && (
            <div className={styles.tableContainer}>
              <SpeciesSearchResultsTable
                results={genomes}
                isExpanded={isTableExpanded}
                onTableExpandToggle={onTableExpandToggle}
                onSpeciesSelectToggle={onGenomePreselectToggle}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GenomeSelectorBySearchQuery;
