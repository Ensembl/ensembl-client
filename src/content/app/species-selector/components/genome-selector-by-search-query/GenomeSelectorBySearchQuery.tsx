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
  useDeferredValue,
  useCallback,
  type InputEvent
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'src/store';

import { getSortRule } from 'src/content/app/species-selector/helpers/genomeSearchHelpers';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import {
  useGenomesQuery,
  getSpeciesSearchLastPageNumber
} from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import useSelectableGenomesTable from 'src/content/app/species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import AddSpecies from 'src/content/app/species-selector/components/species-search-field/AddSpecies';
import { SpeciesSearchField } from '../species-search-field/SpeciesSearchField';
import SpeciesSearchResultsSummary from 'src/content/app/species-selector/components/species-search-results-summary/SpeciesSearchResultsSummary';
import SpeciesSearchResultsTable from 'src/content/app/species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import Pagination from 'src/shared/components/pagination/Pagination';
import { CircleLoader } from 'src/shared/components/loader';

import type { SpeciesSearchResponse } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';
import type { SortOrderWithNone } from 'src/shared/types/sort-order';

import styles from './GenomeSelectorBySearchQuery.module.css';

type Props = {
  onSpeciesAdd: (genomes: SpeciesSearchMatch[]) => void;
  onClose: () => void;
};

const matchesPerPage = 100;

const GenomeSelectorBySearchQuery = (props: Props) => {
  const { onClose } = props;
  const [canSubmitSearch, setCanSubmitSearch] = useState(false);
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') as string;
  const pageString = searchParams.get('page') ?? '1';
  const sortBy = searchParams.get('sort_by');
  const sortOrder = searchParams.get('order');
  let pageNumber = parseInt(pageString);
  if (!pageNumber) {
    pageNumber = 1;
  }
  const { data, isLoading } = useGenomesQuery({
    query,
    page: pageNumber,
    sortBy,
    sortOrder
  });

  const {
    genomes,
    stagedGenomes,
    isTableExpanded,
    onTableExpandToggle,
    onGenomeStageToggle
  } = useSelectableGenomesTable({
    genomes: data?.matches ?? [],
    selectedGenomes: committedSpecies
  });

  const deferredGenomes = useDeferredValue(genomes);

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

  const onResultsPageChange = (page: number) => {
    const newPageParam = new URLSearchParams(searchParams);
    newPageParam.set('page', `${page}`);
    setSearchParams(newPageParam, { replace: true });
  };

  const sortRule = getSortRule(sortBy, sortOrder);

  const onSortRuleChange = useCallback(
    (sortBy: string, sortOrder: SortOrderWithNone) => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (sortOrder === 'none') {
        newSearchParams.delete('sort_by');
        newSearchParams.delete('order');
      } else {
        newSearchParams.set('sort_by', sortBy);
        newSearchParams.set('order', sortOrder);
      }
      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return (
    <div className={styles.main}>
      <TopSection
        query={query}
        isLoading={isLoading}
        searchResults={data}
        canAddGenomes={stagedGenomes.length > 0}
        canSubmitSearch={canSubmitSearch}
        onSearchSubmit={onSearchSubmit}
        onSearchInput={onSearchInput}
        onGenomesAdd={onSpeciesAdd}
        onClose={onClose}
      />

      {data && data.matches.length > 0 && (
        <>
          <div className={styles.resultsControls}>
            <Pagination
              currentPageNumber={pageNumber}
              lastPageNumber={getSpeciesSearchLastPageNumber({
                data,
                perPage: matchesPerPage
              })}
              onChange={onResultsPageChange}
            />
          </div>
          <div className={styles.tableContainer}>
            <SpeciesSearchResultsTable
              results={deferredGenomes}
              isExpanded={isTableExpanded}
              sortRule={sortRule}
              onSortRuleChange={onSortRuleChange}
              onTableExpandToggle={onTableExpandToggle}
              onSpeciesSelectToggle={onGenomeStageToggle}
            />
          </div>
        </>
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
            onInput={onSearchInput}
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
