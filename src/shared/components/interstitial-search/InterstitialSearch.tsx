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

import { useEffect, useState, type InputEvent, type ReactNode } from 'react';

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

import type { FeatureSearchAppName } from 'src/shared/helpers/featureSearchHelpers';

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
      title: 'Gene search results',
      results: currentGeneSearchResults,
      content: currentGeneSearchResults?.matches.length ? (
        <GeneSearchMatches
          results={currentGeneSearchResults}
          app={app}
          mode="interstitial"
          genomeIdForUrl={genomeIdForUrl}
        />
      ) : (
        <NoResults />
      )
    },
    {
      title: 'Transcript search results',
      results: currentTranscriptSearchResults,
      content: currentTranscriptSearchResults?.matches.length ? (
        <TranscriptSearchMatches
          results={currentTranscriptSearchResults}
          app={app}
          mode="interstitial"
          genomeIdForUrl={genomeIdForUrl}
        />
      ) : (
        <NoResults />
      )
    },
    {
      title: 'Variant search results',
      results: currentVariantSearchResults,
      content: isMissingResourceError(variantSearchError) ? (
        <span className={styles.warning}>
          {getErrorMessage(variantSearchError)}
        </span>
      ) : currentVariantSearchResults?.matches.length ? (
        <VariantSearchMatches
          results={currentVariantSearchResults}
          app={app}
          mode="interstitial"
          genomeIdForUrl={genomeIdForUrl}
        />
      ) : (
        <NoResults />
      )
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
            searchResults.map(({ title, content }) => (
              <SearchResultsSection key={title} title={title}>
                {content}
              </SearchResultsSection>
            ))}
        </div>
      )}
    </div>
  );
};

const SearchResultsSection = (props: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <section className={styles.searchResultsSection}>
      <div className={styles.sectionTitle}>{props.title}</div>
      {props.children}
    </section>
  );
};

const NoResults = () => (
  <div className={styles.noResults}>No results found</div>
);

export default InterstitialSearch;
