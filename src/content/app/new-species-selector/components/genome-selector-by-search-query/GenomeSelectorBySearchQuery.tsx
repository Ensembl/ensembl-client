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

import SpeciesSearchField from 'src/content/app/new-species-selector/components/species-search-field/SpeciesSearchField';
import SpeciesSearchResultsSummary from 'src/content/app/new-species-selector/components/species-search-results-summary/SpeciesSearchResultsSummary';
import SpeciesSearchResultsTable from 'src/content/app/new-species-selector/components/species-search-results-table/SpeciesSearchResultsTable';

import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

import styles from './GenomeSelectorBySearchQuery.scss';

type Props = {
  query: string;
  onSpeciesAdd: (genomes: SpeciesSearchMatch[]) => void;
};

const GenomeSelectorBySearchQuery = (props: Props) => {
  const { query } = props;
  const [hasQueryChangedSinceSubmission, setHasQueryChangedSinceSubmission] =
    useState(false);
  const [searchTrigger, result] = useLazyGetSpeciesSearchResultsQuery();
  const { currentData } = result;

  const {
    genomes,
    stagedGenomes,
    setStagedGenomes,
    isTableExpanded,
    onTableExpandToggle,
    onGenomePreselectToggle
  } = useSelectableGenomesTable(currentData?.matches ?? []);

  useEffect(() => {
    searchTrigger({ query });
  }, []);

  const onInput = () => {
    setHasQueryChangedSinceSubmission(true);
    setStagedGenomes([]); // remove all preselected species because user has changed value of the search field
  };

  const onSearchSubmit = () => {
    searchTrigger({ query });
    setHasQueryChangedSinceSubmission(false);
  };

  const onSpeciesAdd = () => {
    props.onSpeciesAdd(stagedGenomes);
  };

  const speciesSearchFieldMode = stagedGenomes.length
    ? 'species-add'
    : 'species-search';

  return (
    <div className={styles.main}>
      <SpeciesSearchField
        onInput={onInput}
        onSearchSubmit={onSearchSubmit}
        mode={speciesSearchFieldMode}
        onSpeciesAdd={onSpeciesAdd}
        canSubmit={hasQueryChangedSinceSubmission}
      />
      {currentData && !hasQueryChangedSinceSubmission && (
        <>
          <SpeciesSearchResultsSummary searchResult={currentData} />
          <div className={styles.tableContainer}>
            <SpeciesSearchResultsTable
              results={genomes}
              isExpanded={isTableExpanded}
              onTableExpandToggle={onTableExpandToggle}
              onSpeciesSelectToggle={onGenomePreselectToggle}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GenomeSelectorBySearchQuery;
