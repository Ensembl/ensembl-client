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

import React, { useState, useDeferredValue, type FormEvent } from 'react';

import { useLazyGetSpeciesSearchResultsQuery } from 'src/content/app/new-species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import useSelectableGenomesTable from 'src/content/app/new-species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import AddSpecies from 'src/content/app/new-species-selector/components/species-search-field/AddSpecies';
import { SpeciesSearchField } from 'src/content/app/new-species-selector/components/species-search-field/SpeciesSearchField';
import SpeciesSearchResultsSummary from 'src/content/app/new-species-selector/components/species-search-results-summary/SpeciesSearchResultsSummary';
import SpeciesSearchResultsTable from 'src/content/app/new-species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import GenomesFilterField from 'src/content/app/new-species-selector/components/genomes-filter-field/GenomesFilterField';
import { CircleLoader } from 'src/shared/components/loader';

import type { SpeciesSearchResponse } from 'src/content/app/new-species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

import styles from './BlastSpeciesSelector.scss';

type Props = {
  onSpeciesAdd: (genomes: SpeciesSearchMatch[]) => void;
  selectedSpecies: Array<{ genome_id: string }>;
  onClose: () => void;
};

// These additional properties enable the limitation of the number of genomes
// that can be selected.
type PropsWithMaximumSelectableSpeciesCount = Props & {
  maxSelectableGenomesCount: number;
};

/**
 * NOTE
 * This component is almost an exact copy of GenomeSelectorBySearchQuery; with the following notable exceptions:
 * - It starts with an empty query. Meanwhile, GenomeSelectorBySearchQuery always starts with a query
 *   that user has entered on the main screen of Species Selector
 * - It has a limit on how many genomes can be selected (we aren't allowing more than 25 in BLAST).
 *   GenomeSelectorBySearchQuery has no such limit.
 * It is thus very likely that this component will be shared across different tools;
 * but we won't know for sure until we see relevant designs.
 * Whether we want to use the same component as in the Species Selector app though, is questionable to me.
 */

const BlastSpeciesSelector = (
  props: Props | PropsWithMaximumSelectableSpeciesCount
) => {
  const { onClose, selectedSpecies } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [canSubmitSearch, setCanSubmitSearch] = useState(false);
  const [searchTrigger, result] = useLazyGetSpeciesSearchResultsQuery();
  const { currentData, isLoading, isError } = result;

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
    selectedGenomes: selectedSpecies,
    filterQuery
  });

  const deferredGenomes = useDeferredValue(genomes);

  const maxSelectableGenomesCount =
    'maxSelectableGenomesCount' in props
      ? props.maxSelectableGenomesCount
      : Infinity;
  const selectedGenomesCount = selectedSpecies.length;

  const onSearchInput = (event: FormEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value);
    if (!canSubmitSearch) {
      setCanSubmitSearch(true);
    }
  };

  const onSpeciesAdd = () => {
    props.onSpeciesAdd(stagedGenomes);
  };

  const onSearchSubmit = () => {
    searchTrigger({ query: searchQuery });
    setCanSubmitSearch(false);
  };

  return (
    <div className={styles.main}>
      <TopSection
        query={searchQuery}
        isLoading={isLoading}
        isError={isError}
        searchResults={currentData}
        canAddGenomes={stagedGenomes.length > 0}
        canSubmitSearch={canSubmitSearch}
        onSearchSubmit={onSearchSubmit}
        onSearchInput={onSearchInput}
        onGenomesAdd={onSpeciesAdd}
        onFilterChange={setFilterQuery}
        onClose={onClose}
      />

      {currentData?.matches.length && (
        <div className={styles.tableContainer}>
          <SpeciesSearchResultsTable
            results={deferredGenomes}
            isExpanded={isTableExpanded}
            maxStagedGenomesNumber={
              maxSelectableGenomesCount - selectedGenomesCount
            }
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
  isError: boolean;
  searchResults?: SpeciesSearchResponse;
  canAddGenomes: boolean;
  canSubmitSearch: boolean;
  onSearchSubmit: () => void;
  onSearchInput: (event: FormEvent<HTMLInputElement>) => void;
  onGenomesAdd: () => void;
  onFilterChange: (filter: string) => void;
  onClose: () => void;
};

const TopSection = (props: TopSectionProps) => {
  if (props.isError) {
    return <div>An unexpected error happened during search.</div>;
  }

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
  if (!props.searchResults || props.searchResults?.matches.length === 0) {
    return (
      <section className={styles.topSection}>
        <div className={styles.searchFieldWrapper}>
          <SpeciesSearchField
            query={props.query}
            onInput={props.onSearchInput}
            canSubmit={props.canSubmitSearch}
            onSearchSubmit={props.onSearchSubmit}
          />
        </div>
        {props.searchResults && (
          <div className={styles.resultsSummaryWrapper}>
            <SpeciesSearchResultsSummary searchResults={props.searchResults} />
          </div>
        )}
      </section>
    );
  }

  // this shouldn't happen
  return null;
};

export default BlastSpeciesSelector;
