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

import { useEffect, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useLazySearchGenesQuery,
  useLazySearchTranscriptsQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';

import { CircleLoader } from 'src/shared/components/loader';
import { FeatureSearchResults } from 'src/shared/components/feature-search-results/FeatureSearchResults';
import {
  isMissingResourceError,
  getErrorMessage
} from 'src/shared/state/api-slices/restSlice';

import type { FeatureSearchMode } from 'src/shared/helpers/featureSearchHelpers';
import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './FeatureSearchResultsView.module.css';

type Props = {
  query: string;
  speciesList: CommittedItem[];
  hasLoadedSpecies?: boolean;
  missingSpeciesRedirectPath: string;
  searchField: ReactNode;
};

const FeatureSearchResultsView = (props: Props) => {
  const {
    query,
    speciesList,
    hasLoadedSpecies = true,
    missingSpeciesRedirectPath,
    searchField
  } = props;
  const navigate = useNavigate();

  const genomeIds = useMemo(
    () => speciesList.map(({ genome_id }) => genome_id),
    [speciesList]
  );

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const [triggerTranscriptSearch, transcriptSearchResults] =
    useLazySearchTranscriptsQuery();
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();

  const {
    currentData: currentGeneSearchResults,
    reset: resetGeneSearchResults,
    isFetching: isGeneSearchFetching
  } = geneSearchResults;
  const {
    currentData: currentTranscriptSearchResults,
    reset: resetTranscriptSearchResults,
    isFetching: isTranscriptSearchFetching
  } = transcriptSearchResults;
  const {
    currentData: currentVariantSearchResults,
    error: variantSearchError,
    reset: resetVariantSearchResults,
    isFetching: isVariantSearchFetching
  } = variantSearchResults;

  useEffect(() => {
    if (hasLoadedSpecies && !speciesList.length) {
      navigate(missingSpeciesRedirectPath, { replace: true });
    }
  }, [hasLoadedSpecies, missingSpeciesRedirectPath, navigate, speciesList]);

  useEffect(() => {
    if (!genomeIds.length) {
      return;
    }

    const searchRequest = {
      genome_ids: genomeIds,
      query,
      page: 1,
      per_page: 50
    };

    resetGeneSearchResults();
    resetTranscriptSearchResults();
    resetVariantSearchResults();

    triggerGeneSearch(searchRequest);
    triggerTranscriptSearch(searchRequest);
    triggerVariantSearch(searchRequest);
  }, [
    genomeIds,
    query,
    resetGeneSearchResults,
    resetTranscriptSearchResults,
    resetVariantSearchResults,
    triggerGeneSearch,
    triggerTranscriptSearch,
    triggerVariantSearch
  ]);

  if (!hasLoadedSpecies || !speciesList.length) {
    return null;
  }

  return (
    <div className={styles.main}>
      <div className={styles.searchFieldWrapper}>{searchField}</div>
      <div className={styles.resultsWrapper}>
        <SearchResultsSection
          title="Gene search results"
          featureSearchMode="gene"
          searchResults={currentGeneSearchResults}
          speciesList={speciesList}
          isFetching={isGeneSearchFetching}
          scrollable={false}
        />
        <SearchResultsSection
          title="Transcript search results"
          featureSearchMode="transcript"
          searchResults={currentTranscriptSearchResults}
          speciesList={speciesList}
          isFetching={isTranscriptSearchFetching}
          scrollable={false}
        />
        <VariantSearchResultsSection
          title="Variant search results"
          variantSearchError={variantSearchError}
          currentVariantSearchResults={currentVariantSearchResults}
          speciesList={speciesList}
          isFetching={isVariantSearchFetching}
        />
      </div>
    </div>
  );
};

const SearchResultsSection = (props: {
  title: string;
  featureSearchMode: FeatureSearchMode;
  searchResults: SearchResults | undefined;
  speciesList: CommittedItem[];
  scrollable?: boolean;
  isFetching: boolean;
}) => {
  const {
    title,
    featureSearchMode,
    searchResults,
    speciesList,
    scrollable,
    isFetching
  } = props;

  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {isFetching ? (
        <LoadingStatus title={title} />
      ) : (
        <FeatureSearchResults
          featureSearchMode={featureSearchMode}
          speciesList={speciesList}
          searchResults={searchResults}
          scrollable={scrollable}
          emptyResultsLabel={title}
          showFeatureActions={true}
        />
      )}
    </section>
  );
};

const VariantSearchResultsSection = (props: {
  title: string;
  variantSearchError: FetchBaseQueryError | SerializedError | undefined;
  currentVariantSearchResults: SearchResults | undefined;
  speciesList: CommittedItem[];
  isFetching: boolean;
}) => {
  const {
    title,
    variantSearchError,
    currentVariantSearchResults,
    speciesList,
    isFetching
  } = props;

  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {isFetching ? (
        <LoadingStatus title={title} />
      ) : isMissingResourceError(variantSearchError) ? (
        <p className={styles.warning}>{getErrorMessage(variantSearchError)}</p>
      ) : (
        <FeatureSearchResults
          featureSearchMode="variant"
          speciesList={speciesList}
          searchResults={currentVariantSearchResults}
          scrollable={false}
          emptyResultsLabel={title}
          showFeatureActions={true}
        />
      )}
    </section>
  );
};

const LoadingStatus = (props: { title: string }) => (
  <div
    className={styles.status}
    role="status"
    aria-label={`Searching ${props.title}`}
  >
    <CircleLoader size="small" />
  </div>
);

export default FeatureSearchResultsView;
