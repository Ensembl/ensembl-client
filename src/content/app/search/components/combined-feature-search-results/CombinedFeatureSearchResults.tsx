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

import { useEffect, useMemo } from 'react';

import {
  useLazySearchGenesQuery,
  useLazySearchTranscriptsQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';

import { CircleLoader } from 'src/shared/components/loader';
import { FeatureSearchResults } from 'src/content/app/search/components/feature-search-results/FeatureSearchResults';

import type { FeatureSearchMode } from 'src/shared/helpers/featureSearchHelpers';
import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

import styles from './CombinedFeatureSearchResults.module.css';

type Props = {
  query: string;
  speciesList: CommittedItem[];
};

const CombinedFeatureSearchResults = (props: Props) => {
  const { query, speciesList } = props;

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
    reset: resetVariantSearchResults,
    isFetching: isVariantSearchFetching
  } = variantSearchResults;
  const areSearchResultsLoading =
    isGeneSearchFetching ||
    isTranscriptSearchFetching ||
    isVariantSearchFetching;

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

  return (
    <div className={styles.resultsWrapper}>
      {areSearchResultsLoading ? (
        <Loading />
      ) : (
        <>
          <SearchResultsSection
            title="Gene search results"
            featureType="gene"
            searchResults={currentGeneSearchResults}
            speciesList={speciesList}
          />
          <SearchResultsSection
            title="Transcript search results"
            featureType="transcript"
            searchResults={currentTranscriptSearchResults}
            speciesList={speciesList}
          />
          <SearchResultsSection
            title="Variant search results"
            featureType="variant"
            searchResults={currentVariantSearchResults}
            speciesList={speciesList}
          />
        </>
      )}
    </div>
  );
};

const SearchResultsSection = (props: {
  title: string;
  featureType: FeatureSearchMode;
  searchResults: SearchResults | undefined;
  speciesList: CommittedItem[];
}) => {
  const { title, featureType, searchResults, speciesList } = props;

  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      <FeatureSearchResults
        featureType={featureType}
        speciesList={speciesList}
        searchResults={searchResults}
      />
    </section>
  );
};

const Loading = () => (
  <div className={styles.status} role="status" aria-label="Searching features">
    <CircleLoader size="small" />
  </div>
);

export default CombinedFeatureSearchResults;
