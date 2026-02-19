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

import {
  useState,
  useLayoutEffect,
  useDeferredValue,
  type InputEvent
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { useLazyGetSpeciesSearchResultsQuery } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import useSelectableGenomesTable from 'src/content/app/species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import AddSpecies from 'src/content/app/species-selector/components/species-search-field/AddSpecies';
import { SpeciesSearchField } from '../species-search-field/SpeciesSearchField';
import SpeciesSearchResultsSummary from 'src/content/app/species-selector/components/species-search-results-summary/SpeciesSearchResultsSummary';
import SpeciesSearchResultsTable from 'src/content/app/species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import GenomesFilterField from 'src/content/app/species-selector/components/genomes-filter-field/GenomesFilterField';
import { CircleLoader } from 'src/shared/components/loader';

import type { SpeciesSearchResponse } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';

import styles from './GenomeSelectorBySearchQuery.module.css';

type Props = {
  onSpeciesAdd: (genomes: SpeciesSearchMatch[]) => void;
  onClose: () => void;
};

const GenomeSelectorBySearchQuery = (props: Props) => {
  const { onClose } = props;
  const [filterQuery, setFilterQuery] = useState('');
  const [canSubmitSearch, setCanSubmitSearch] = useState(false);
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTrigger, result] = useLazyGetSpeciesSearchResultsQuery();
  const { currentData, isFetching } = result;

  const query = searchParams.get('query') as string;

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

  // trigger the query before the component had a chance to render
  useLayoutEffect(() => {
    searchTrigger({ query });
  }, [query, searchTrigger]);

  const onSearchInput = () => {
    if (!canSubmitSearch) {
      setCanSubmitSearch(true);
    }
  };

  const onSpeciesAdd = () => {
    props.onSpeciesAdd(stagedGenomes);
  };

  const onSearchSubmit = (query: string) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('query', query);
    setSearchParams(newSearchParams, { replace: true });
    setCanSubmitSearch(false);
  };

  return (
    <div className={styles.main}>
      <TopSection
        query={query}
        isLoading={isFetching}
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
  onSearchSubmit: (query: string) => void;
  onSearchInput: () => void;
  onGenomesAdd: () => void;
  onFilterChange: (filter: string) => void;
  onClose: () => void;
};

const TopSection = (props: TopSectionProps) => {
  const [query, setQuery] = useState(props.query);

  const onSearchInput = (event: InputEvent<HTMLInputElement>) => {
    const input = event.currentTarget.value;
    setQuery(input);
    props.onSearchInput();
  };

  if (props.isLoading) {
    return (
      <>
        <AddSpecies
          query={props.query}
          canAdd={false}
          onAdd={props.onGenomesAdd}
          onClose={props.onClose}
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
          {props.canAddGenomes ? (
            <AddSpecies
              query={query}
              canAdd={true}
              onAdd={props.onGenomesAdd}
              onClose={props.onClose}
            />
          ) : (
            <SpeciesSearchField
              query={query}
              onInput={onSearchInput}
              canSubmit={props.canSubmitSearch}
              onSearchSubmit={props.onSearchSubmit}
              onClose={props.onClose}
            />
          )}
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
            query={query}
            onInput={props.onSearchInput}
            canSubmit={props.canSubmitSearch}
            onSearchSubmit={props.onSearchSubmit}
            onClose={props.onClose}
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
