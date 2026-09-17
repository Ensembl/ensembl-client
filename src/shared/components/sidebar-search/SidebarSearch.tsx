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

import { useId, useState, type InputEvent, type SubmitEvent } from 'react';
import classNames from 'classnames';

import {
  useLazySearchGenesQuery,
  useLazySearchTranscriptsQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';
import { isMissingResourceError } from 'src/shared/state/api-slices/restSlice';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { PrimaryButton } from 'src/shared/components/button/Button';
import ImageButton from 'src/shared/components/image-button/ImageButton';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import { CircleLoader } from 'src/shared/components/loader';
import GeneSearchMatches from 'src/shared/components/search-match/GeneSearchMatches';
import TranscriptSearchMatches from 'src/shared/components/search-match/TranscriptSearchMatches';
import VariantSearchMatches from 'src/shared/components/search-match/VariantSearchMatches';
import NavigateLeftIcon from 'static/icons/navigate-left.svg';
import NavigateRightIcon from 'static/icons/navigate-right.svg';

import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type {
  FeatureSearchAppName,
  FeatureSearchMode
} from 'src/shared/helpers/featureSearchHelpers';
import { Status } from 'src/shared/types/status';

import styles from './SidebarSearch.module.css';

type Props = {
  app: FeatureSearchAppName;
  genomeId: string;
  genomeIdForUrl: string;
  onSearchSubmit?: (query: string) => void;
  onMatchNavigation?: () => void;
};

const SidebarSearch = (props: Props) => {
  const { app, genomeId, genomeIdForUrl, onSearchSubmit, onMatchNavigation } =
    props;
  const [searchInput, setSearchInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const searchInputId = useId();

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const [triggerTranscriptSearch, transcriptSearchResults] =
    useLazySearchTranscriptsQuery();
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();

  const resetSearchResults = () => {
    geneSearchResults.reset();
    transcriptSearchResults.reset();
    variantSearchResults.reset();
  };

  const onFormSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchInput.trim();
    if (!query) {
      return;
    }

    const searchParams = {
      genome_ids: [genomeId],
      query,
      page: 1,
      per_page: 20
    };

    resetSearchResults();
    setSubmittedQuery(query);
    triggerGeneSearch(searchParams);
    triggerTranscriptSearch(searchParams);
    triggerVariantSearch(searchParams);
    onSearchSubmit?.(query);
  };

  const onQueryChange = (event: InputEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value;
    setSearchInput(query);

    if (!query.trim()) {
      setSubmittedQuery('');
      resetSearchResults();
    }
  };

  const searchResults = [
    {
      searchMode: 'gene' as FeatureSearchMode,
      title: 'Gene search results',
      results: geneSearchResults.currentData
    },
    {
      searchMode: 'transcript' as FeatureSearchMode,
      title: 'Transcript search results',
      results: transcriptSearchResults.currentData
    },
    {
      searchMode: 'variant' as FeatureSearchMode,
      title: 'Variant search results',
      results: variantSearchResults.currentData
    }
  ]
    .filter(
      ({ searchMode }) =>
        searchMode !== 'variant' ||
        !isMissingResourceError(variantSearchResults.error)
    )
    .sort(
      (first, second) =>
        (second.results?.meta.total_hits ?? 0) -
        (first.results?.meta.total_hits ?? 0)
    );

  const isLoading =
    geneSearchResults.isFetching ||
    transcriptSearchResults.isFetching ||
    variantSearchResults.isFetching;

  return (
    <div className={styles.sidebarSearch}>
      <form className={styles.searchFormSidebar} onSubmit={onFormSubmit}>
        <label htmlFor={searchInputId}>
          Find a feature in the selected genomes
        </label>
        <ShadedInput
          id={searchInputId}
          onInput={onQueryChange}
          value={searchInput}
          help="Search for a gene, transcript or variant using a stable identifier, symbol or rsID."
          placeholder="Gene, transcript or variant ID..."
          type="search"
          autoFocus={true}
          autoComplete="off"
          size="small"
        />
        <PrimaryButton
          type="submit"
          className={styles.submitSidebar}
          disabled={!searchInput.trim()}
        >
          Go
        </PrimaryButton>
      </form>
      {isLoading ? (
        <CircleLoader className={styles.loader} size="small" />
      ) : (
        submittedQuery &&
        searchResults.map(({ searchMode, title, results }) => (
          <section className={styles.resultsSection} key={searchMode}>
            <div className={styles.sectionTitle}>{title}</div>
            <ResultDetails
              searchMode={searchMode}
              results={results}
              submittedQuery={submittedQuery}
              triggerGeneSearch={triggerGeneSearch}
              genomeId={genomeId}
            />
            <ResultsContent
              app={app}
              genomeIdForUrl={genomeIdForUrl}
              searchMode={searchMode}
              results={results}
              onMatchNavigation={onMatchNavigation}
            />
          </section>
        ))
      )}
    </div>
  );
};

type ResultDetailsProps = {
  searchMode: FeatureSearchMode;
  results: SearchResults | undefined;
  submittedQuery: string;
  genomeId: string;
  triggerGeneSearch: ReturnType<typeof useLazySearchGenesQuery>[0];
};

const ResultDetails = (props: ResultDetailsProps) => {
  const { searchMode, results, submittedQuery, genomeId, triggerGeneSearch } =
    props;

  if (!results || results.meta.total_hits === 0) {
    return null;
  }

  if (searchMode !== 'gene') {
    return (
      <div>
        <span className={styles.totalHits}>
          {formatNumber(results.meta.total_hits)}
        </span>
        <span className={styles.resultsText}> results</span>
      </div>
    );
  }

  const { page, per_page, total_hits } = results.meta;

  return (
    <PageDetails
      results={results}
      hasPreviousPage={page > 1}
      hasNextPage={total_hits > page * per_page}
      onPreviousClick={() =>
        triggerGeneSearch({
          genome_ids: [genomeId],
          query: submittedQuery,
          page: page - 1,
          per_page
        })
      }
      onNextClick={() =>
        triggerGeneSearch({
          genome_ids: [genomeId],
          query: submittedQuery,
          page: page + 1,
          per_page
        })
      }
    />
  );
};

type ResultsContentProps = {
  app: FeatureSearchAppName;
  genomeIdForUrl: string;
  searchMode: FeatureSearchMode;
  results: SearchResults | undefined;
  onMatchNavigation?: () => void;
};

const ResultsContent = (props: ResultsContentProps) => {
  const { app, searchMode, results, genomeIdForUrl, onMatchNavigation } = props;

  if (!results || results.matches.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>No results found</p>
      </div>
    );
  }

  if (searchMode === 'gene') {
    return (
      <GeneSearchMatches
        results={results}
        app={app}
        mode="sidebar"
        genomeIdForUrl={genomeIdForUrl}
        onMatchNavigation={onMatchNavigation}
      />
    );
  }

  if (searchMode === 'transcript') {
    return (
      <TranscriptSearchMatches
        results={results}
        app={app}
        mode="sidebar"
        genomeIdForUrl={genomeIdForUrl}
        onMatchNavigation={onMatchNavigation}
      />
    );
  }

  return (
    <VariantSearchMatches
      results={results}
      app={app}
      mode="sidebar"
      genomeIdForUrl={genomeIdForUrl}
      onMatchNavigation={onMatchNavigation}
    />
  );
};

type PageDetailsProps = {
  results: SearchResults;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPreviousClick: () => void;
  onNextClick: () => void;
};

const PageDetails = (props: PageDetailsProps) => {
  const {
    results,
    hasPreviousPage,
    hasNextPage,
    onPreviousClick,
    onNextClick
  } = props;
  const { total_hits, page, per_page } = results.meta;

  const from = formatNumber((page - 1) * per_page + 1);
  const to = formatNumber(Math.min(page * per_page, total_hits));
  const totalHitsFormatted = formatNumber(total_hits);

  return (
    <div className={styles.pageDetails}>
      <div>
        <span className={styles.pageRange}>
          {from}-{to}
        </span>
        <span className={styles.totalHits}> /{totalHitsFormatted}</span>
        <span className={styles.resultsText}> results</span>
      </div>
      {total_hits > per_page && (
        <div>
          <ImageButton
            status={hasPreviousPage ? Status.DEFAULT : Status.DISABLED}
            description="Previous page"
            className={styles.pageNavButton}
            onClick={onPreviousClick}
            image={NavigateLeftIcon}
          />
          <ImageButton
            status={hasNextPage ? Status.DEFAULT : Status.DISABLED}
            description="Next page"
            className={classNames(
              styles.pageNavButton,
              styles.pageNavNextButton
            )}
            onClick={onNextClick}
            image={NavigateRightIcon}
          />
        </div>
      )}
    </div>
  );
};

export default SidebarSearch;
