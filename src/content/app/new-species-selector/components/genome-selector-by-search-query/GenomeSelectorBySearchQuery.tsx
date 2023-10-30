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

import React, { useState, useEffect, useDeferredValue } from 'react';

import { useAppSelector } from 'src/store';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { useLazyGetSpeciesSearchResultsQuery } from 'src/content/app/new-species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import useSelectableGenomesTable from 'src/content/app/new-species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import AddSpecies from 'src/content/app/new-species-selector/components/species-search-field/AddSpecies';
import SpeciesSearchField from '../species-search-field/SpeciesSearchField';
import SpeciesSearchResultsSummary from 'src/content/app/new-species-selector/components/species-search-results-summary/SpeciesSearchResultsSummary';
import SpeciesSearchResultsTable from 'src/content/app/new-species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import GenomesFilterField from 'src/content/app/new-species-selector/components/genomes-filter-field/GenomesFilterField';
import { CircleLoader } from 'src/shared/components/loader';

import type { SpeciesSearchResponse } from 'src/content/app/new-species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

import styles from './GenomeSelectorBySearchQuery.scss';

type Props = {
  query: string;
  onSpeciesAdd: (genomes: SpeciesSearchMatch[]) => void;
  onClose: () => void;
};

const GenomeSelectorBySearchQuery = (props: Props) => {
  const { query, onClose } = props;
  const [filterQuery, setFilterQuery] = useState('');
  const [canSubmitSearch, setCanSubmitSearch] = useState(false);
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const [searchTrigger, result] = useLazyGetSpeciesSearchResultsQuery();
  const { currentData, isLoading } = result;

  const {
    genomes,
    stagedGenomes,
    isTableExpanded,
    onTableExpandToggle,
    onGenomeStageToggle,
    sortRule,
    changeSortRule
  } = useSelectableGenomesTable({
    genomes: currentData?.matches ?? [],
    selectedGenomes: committedSpecies,
    filterQuery
  });

  const deferredGenomes = useDeferredValue(genomes);

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
      <TopSection
        query={query}
        isLoading={isLoading}
        searchResults={currentData}
        canAddGenomes={stagedGenomes.length > 0}
        canSubmitSearch={canSubmitSearch}
        onSearchSubmit={onSearchSubmit}
        onSearchInput={onSearchInput}
        onGenomesAdd={onSpeciesAdd}
        onFilterChange={setFilterQuery}
        onClose={onClose}
      />

      {currentData && currentData.matches.length > 0 && (
        <div className={styles.tableContainer}>
          <SpeciesSearchResultsTable
            results={deferredGenomes}
            isExpanded={isTableExpanded}
            sortRule={sortRule}
            onSortRuleChange={changeSortRule}
            onTableExpandToggle={onTableExpandToggle}
            onSpeciesSelectToggle={onGenomeStageToggle}
          />
        </div>
      )}
    </div>
  );
};

// TODO: consider errors in response to search request
type TopSectionProps = {
  query: string;
  isLoading: boolean;
  searchResults?: SpeciesSearchResponse;
  canAddGenomes: boolean;
  canSubmitSearch: boolean;
  onSearchSubmit: () => void;
  onSearchInput: () => void;
  onGenomesAdd: () => void;
  onFilterChange: (filter: string) => void;
  onClose: () => void;
};

const TopSection = (props: TopSectionProps) => {
  if (props.isLoading) {
    return (
      <>
        <AddSpecies
          query={props.query}
          canAdd={false}
          onAdd={props.onGenomesAdd}
          onCancel={props.onClose}
        />
        <CircleLoader className={styles.loader} />
      </>
    );
  }

  // search returned some results
  if (props.searchResults?.matches.length) {
    return (
      <section className={styles.topSection}>
        <div className={styles.searchFieldWrapper}>
          <AddSpecies
            query={props.query}
            canAdd={props.canAddGenomes}
            onAdd={props.onGenomesAdd}
            onCancel={props.onClose}
          />
        </div>
        <div className={styles.resultsSummaryWrapper}>
          <SpeciesSearchResultsSummary searchResults={props.searchResults} />
        </div>
        <div className={styles.filterFieldWrapper}>
          <GenomesFilterField onFilterChange={props.onFilterChange} />
        </div>
      </section>
    );
  }

  // search returned no results
  if (props.searchResults?.matches.length === 0) {
    return (
      <section className={styles.topSection}>
        <div className={styles.searchFieldWrapper}>
          <SpeciesSearchField
            onInput={props.onSearchInput}
            canSubmit={props.canSubmitSearch}
            onSearchSubmit={props.onSearchSubmit}
          />
        </div>
        <div className={styles.resultsSummaryWrapper}>
          <SpeciesSearchResultsSummary searchResults={props.searchResults} />
        </div>
      </section>
    );
  }

  // this must be an error
  return <div>An unexpected error happened during search.</div>;
};

export default GenomeSelectorBySearchQuery;
