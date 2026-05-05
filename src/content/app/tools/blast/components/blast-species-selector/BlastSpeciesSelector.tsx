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

import {
  getSortRule,
  DEFAULT_NUM_RESULTS_PER_PAGE
} from 'src/content/app/species-selector/helpers/genomeSearchHelpers';

import {
  useGenomesQuery,
  getSpeciesSearchLastPageNumber
} from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import useSelectableGenomesTable from 'src/content/app/species-selector/components/selectable-genomes-table/useSelectableGenomesTable';

import AddSpecies from 'src/content/app/species-selector/components/species-search-field/AddSpecies';
import { SpeciesSearchField } from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';
import SpeciesSearchResultsSummary from 'src/content/app/species-selector/components/species-search-results-summary/SpeciesSearchResultsSummary';
import {
  SpeciesSearchResultsTableWrapper,
  TableControlsSection,
  TableSection
} from 'src/content/app/species-selector/components/species-search-results-table-wrapper/SpeciesSearchResultsTableWrapper';
import SpeciesSearchResultsTable from 'src/content/app/species-selector/components/species-search-results-table/SpeciesSearchResultsTable';
import PaginationWithPerPage from 'src/shared/components/pagination/PaginationWithPerPage';
import { CircleLoader } from 'src/shared/components/loader';

import type { SpeciesSearchResponse } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';
import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';
import type { SortOrderWithNone } from 'src/shared/types/sort-order';

import styles from './BlastSpeciesSelector.module.css';

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
  const [searchResultsPage, setSearchResultsPage] = useState(1);
  const [searchResultsPerPage, setSearchResultsPerPage] = useState(
    DEFAULT_NUM_RESULTS_PER_PAGE
  );
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>(null);

  const { data, isLoading, isError } = useGenomesQuery(
    {
      query: searchQuery,
      page: searchResultsPage,
      perPage: searchResultsPerPage,
      sortBy,
      sortOrder
    },
    {
      skip: !searchQuery
    }
  );

  const { genomes, stagedGenomes, onTableExpandToggle, onGenomeStageToggle } =
    useSelectableGenomesTable({
      genomes: data?.matches ?? [],
      selectedGenomes: selectedSpecies
    });

  const deferredGenomes = useDeferredValue(genomes);

  const maxSelectableGenomesCount =
    'maxSelectableGenomesCount' in props
      ? props.maxSelectableGenomesCount
      : Infinity;
  const selectedGenomesCount = selectedSpecies.length;

  const onSpeciesAdd = () => {
    props.onSpeciesAdd(stagedGenomes);
  };

  const onSearchSubmit = (query: string) => {
    setSearchResultsPage(1);
    setSearchQuery(query);
  };

  const onPageNumberChange = (pageNumber: number) => {
    setSearchResultsPage(pageNumber);
  };

  const onResultsPerPageChange = (perPage: number) => {
    setSearchResultsPage(1);
    setSearchResultsPerPage(perPage);
  };

  const sortRule = getSortRule(sortBy, sortOrder);

  const onSortRuleChange = useCallback(
    (sortBy: string, sortOrder: SortOrderWithNone) => {
      if (sortOrder === 'none') {
        setSortBy(null);
        setSortOrder(null);
      } else {
        setSortBy(sortBy);
        setSortOrder(sortOrder);
      }
    },
    []
  );

  return (
    <div className={styles.main}>
      <TopSection
        isLoading={isLoading}
        isError={isError}
        searchResults={data}
        canAddGenomes={stagedGenomes.length > 0}
        onSearchSubmit={onSearchSubmit}
        onGenomesAdd={onSpeciesAdd}
        onClose={onClose}
      />

      {data?.matches.length ? (
        <SpeciesSearchResultsTableWrapper>
          <TableControlsSection>
            <PaginationWithPerPage
              currentPageNumber={searchResultsPage}
              lastPageNumber={getSpeciesSearchLastPageNumber({
                data,
                perPage: searchResultsPerPage
              })}
              onPageChange={onPageNumberChange}
              perPageValue={searchResultsPerPage}
              onPerPageChange={onResultsPerPageChange}
            />
          </TableControlsSection>
          <TableSection>
            <SpeciesSearchResultsTable
              results={deferredGenomes}
              maxStagedGenomesNumber={
                maxSelectableGenomesCount - selectedGenomesCount
              }
              sortRule={sortRule}
              onSortRuleChange={onSortRuleChange}
              onTableExpandToggle={onTableExpandToggle}
              onSpeciesSelectToggle={onGenomeStageToggle}
            />
          </TableSection>
        </SpeciesSearchResultsTableWrapper>
      ) : null}
    </div>
  );
};

// TODO: consider errors in response to search request
type TopSectionProps = {
  isLoading: boolean;
  isError: boolean;
  searchResults?: SpeciesSearchResponse;
  canAddGenomes: boolean;
  onSearchSubmit: (query: string) => void;
  onGenomesAdd: () => void;
  onClose: () => void;
};

const TopSection = (props: TopSectionProps) => {
  const [query, setQuery] = useState('');
  const [canSubmitSearch, setCanSubmitSearch] = useState(false);

  const onQueryInput = (event: InputEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    setCanSubmitSearch(true);
  };

  const onSubmit = () => {
    setCanSubmitSearch(false);
    props.onSearchSubmit(query);
  };

  if (props.isError) {
    return <div>An unexpected error happened during search.</div>;
  }

  if (props.isLoading) {
    return (
      <>
        <AddSpecies
          query={query}
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
          <AddSpecies
            query={query}
            canAdd={props.canAddGenomes}
            onAdd={props.onGenomesAdd}
            onClose={props.onClose}
          />
        </div>
        <div className={styles.resultsSummaryWrapper}>
          <SpeciesSearchResultsSummary searchResults={props.searchResults} />
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
            query={query}
            onInput={onQueryInput}
            canSubmit={canSubmitSearch}
            onSearchSubmit={onSubmit}
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
};

export default BlastSpeciesSelector;
