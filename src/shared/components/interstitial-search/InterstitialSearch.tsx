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

import { useEffect, useState, type InputEvent } from 'react';

import {
  useLazySearchGenesQuery,
  useLazySearchTranscriptsQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';
import {
  isMissingResourceError,
  getErrorMessage
} from 'src/shared/state/api-slices/restSlice';

import { CircleLoader } from 'src/shared/components/loader';

import MainSearchField from 'src/shared/components/main-search-field/MainSearchField';
import GeneSearchMatches from 'src/shared/components/search-match/GeneSearchMatches';
import TranscriptSearchMatches from 'src/shared/components/search-match/TranscriptSearchMatches';
import VariantSearchMatches from 'src/shared/components/search-match/VariantSearchMatches';

import type {
  FeatureSearchAppName,
  FeatureSearchMode
} from 'src/shared/helpers/featureSearchHelpers';
import type { SearchResults } from 'src/shared/types/search-api/search-results';

import styles from './InterstitialSearch.module.css';

export type Props = {
  app: FeatureSearchAppName;
  genomeId: string;
  genomeIdForUrl: string; // this should be a temporary measure; it should be returned by search api
  onSearchSubmit?: (query: string) => void;
};

const InterstitialSearch = (props: Props) => {
  const { app, genomeId, genomeIdForUrl, onSearchSubmit } = props;
  const [searchInput, setSearchInput] = useState('');
  const [prevGenomeId, setPrevGenomeId] = useState(genomeId);

  if (genomeId !== prevGenomeId) {
    setSearchInput('');
    setPrevGenomeId(genomeId);
  }

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const [triggerTranscriptSearch, transcriptSearchResults] =
    useLazySearchTranscriptsQuery();
  const { currentData: currentTranscriptSearchResults } =
    transcriptSearchResults;
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();
  const resetGeneSearch = geneSearchResults.reset;
  const resetTranscriptSearch = transcriptSearchResults.reset;
  const resetVariantSearch = variantSearchResults.reset;
  const {
    currentData: currentVariantSearchResults,
    error: variantSearchError
  } = variantSearchResults;

  useEffect(() => {
    resetGeneSearch();
    resetTranscriptSearch();
    resetVariantSearch();
  }, [genomeId, resetGeneSearch, resetTranscriptSearch, resetVariantSearch]);

  const onFeatureSearchSubmit = (input: string) => {
    const query = input.trim();
    const searchParams = {
      genome_ids: [genomeId],
      query,
      page: 1,
      per_page: 50
    };

    triggerGeneSearch(searchParams);
    triggerTranscriptSearch(searchParams);
    triggerVariantSearch(searchParams);

    onSearchSubmit?.(query);
  };

  const onInput = (event: InputEvent<HTMLInputElement>) => {
    const newInput = event.currentTarget.value;
    setSearchInput(newInput);

    if (newInput.trim() === '') {
      resetGeneSearch();
      resetTranscriptSearch();
      resetVariantSearch();
    }
  };

  const isLoading =
    geneSearchResults.isFetching ||
    transcriptSearchResults.isFetching ||
    variantSearchResults.isFetching;

  const hasSearchResults =
    currentGeneSearchResults ||
    currentTranscriptSearchResults ||
    currentVariantSearchResults ||
    variantSearchError;

  const searchResults = [
    {
      searchMode: 'gene' as FeatureSearchMode,
      title: 'Gene search results',
      results: currentGeneSearchResults
    },
    {
      searchMode: 'transcript' as FeatureSearchMode,
      title: 'Transcript search results',
      results: currentTranscriptSearchResults
    },
    {
      searchMode: 'variant' as FeatureSearchMode,
      title: 'Variant search results',
      results: currentVariantSearchResults
    }
  ].sort(
    (first, second) =>
      (second.results?.meta.total_hits ?? 0) -
      (first.results?.meta.total_hits ?? 0)
  );

  return (
    <div className={styles.interstitialSearch}>
      <MainSearchField
        query={searchInput}
        onInput={onInput}
        onSearchSubmit={onFeatureSearchSubmit}
        canSubmit={searchInput.trim() !== ''}
        label="Find a feature in the selected genome"
        placeholder="Gene, transcript or variant ID..."
        help="Search for a gene, transcript or variant using a stable identifier, symbol or rsID"
      />
      {isLoading ? (
        <CircleLoader className={styles.spinner} size="small" />
      ) : (
        <div className={styles.resultsContainer}>
          {hasSearchResults &&
            searchResults.map(({ searchMode, title, results }) => (
              <section className={styles.searchResultsSection} key={searchMode}>
                <div className={styles.sectionTitle}>{title}</div>
                {searchMode === 'variant' &&
                isMissingResourceError(variantSearchError) ? (
                  <span className={styles.warning}>
                    {getErrorMessage(variantSearchError)}
                  </span>
                ) : (
                  <ResultsContent
                    app={app}
                    genomeIdForUrl={genomeIdForUrl}
                    searchMode={searchMode}
                    results={results}
                  />
                )}
              </section>
            ))}
        </div>
      )}
    </div>
  );
};

type ResultsContentProps = {
  app: FeatureSearchAppName;
  genomeIdForUrl: string;
  searchMode: FeatureSearchMode;
  results: SearchResults | undefined;
};

const ResultsContent = (props: ResultsContentProps) => {
  const { app, searchMode, results, genomeIdForUrl } = props;

  if (!results || results.matches.length === 0) {
    return <div className={styles.noResults}>No results found</div>;
  }

  if (searchMode === 'gene') {
    return (
      <GeneSearchMatches
        results={results}
        app={app}
        mode="interstitial"
        genomeIdForUrl={genomeIdForUrl}
      />
    );
  }

  if (searchMode === 'transcript') {
    return (
      <TranscriptSearchMatches
        results={results}
        app={app}
        mode="interstitial"
        genomeIdForUrl={genomeIdForUrl}
      />
    );
  }

  return (
    <VariantSearchMatches
      results={results}
      app={app}
      mode="interstitial"
      genomeIdForUrl={genomeIdForUrl}
    />
  );
};

export default InterstitialSearch;
