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

import { useEffect, useMemo, useState, type InputEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  useLazySearchGenesQuery,
  useLazySearchTranscriptsQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';

import { useAppSelector } from 'src/store';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { SpeciesSearchField } from 'src/content/app/species-selector/components/species-search-field/SpeciesSearchField';

import {
  getCommittedSpecies,
  getHasLoadedStoredSpecies
} from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

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

import styles from './SearchResultsView.module.css';

const SearchResultsView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get('query') ?? '';

  useEffect(() => {
    if (!query) {
      navigate(urlFor.search(), { replace: true });
    }
  }, [navigate, query]);

  if (!query) {
    return null;
  }

  return <Content query={query} />;
};

const ResultsSearchField = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromParams = searchParams.get('query') ?? '';
  const [searchInput, setSearchInput] = useState(queryFromParams);

  useEffect(() => {
    setSearchInput(queryFromParams);
  }, [queryFromParams]);

  const onInput = (event: InputEvent<HTMLInputElement>) => {
    setSearchInput(event.currentTarget.value);
  };

  const onSearchSubmit = (input: string) => {
    setSearchParams(
      {
        query: input.trim()
      },
      { replace: true }
    );
  };

  const onClose = () => {
    navigate(urlFor.search());
  };

  return (
    <SpeciesSearchField
      query={searchInput}
      label={null}
      help={featureSearchHelpText}
      placeholder={featureSearchPlaceholder}
      onInput={onInput}
      onSearchSubmit={onSearchSubmit}
      onClose={onClose}
    />
  );
};

const featureSearchHelpText = `
Search for a gene, transcript or variant using a stable identifier, symbol or rsID.
`;

const featureSearchPlaceholder = 'Gene, transcript or variant ID...';

const Content = (props: { query: string }) => {
  const { query } = props;
  const navigate = useNavigate();
  const committedSpecies = useAppSelector(getCommittedSpecies);
  const hasLoadedStoredSpecies = useAppSelector(getHasLoadedStoredSpecies);

  const genomeIds = useMemo(
    () => committedSpecies.map(({ genome_id }) => genome_id),
    [committedSpecies]
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
    if (hasLoadedStoredSpecies && !committedSpecies.length) {
      navigate(urlFor.search(), { replace: true });
    }
  }, [committedSpecies.length, hasLoadedStoredSpecies, navigate]);

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

  const isSearching =
    isGeneSearchFetching ||
    isTranscriptSearchFetching ||
    isVariantSearchFetching;

  const resultsSections = [
    {
      key: 'gene',
      title: 'Gene search results',
      featureSearchMode: 'gene' as const,
      searchResults: currentGeneSearchResults
    },
    {
      key: 'transcript',
      title: 'Transcript search results',
      featureSearchMode: 'transcript' as const,
      searchResults: currentTranscriptSearchResults
    },
    {
      key: 'variant',
      title: 'Variant search results',
      featureSearchMode: 'variant' as const,
      searchResults: currentVariantSearchResults,
      variantSearchError
    }
  ];

  if (!hasLoadedStoredSpecies || !committedSpecies.length) {
    return null;
  }

  return (
    <div className={styles.main}>
      <div className={styles.searchFieldWrapper}>
        <ResultsSearchField />
      </div>
      {isSearching && <p className={styles.status}>Searching...</p>}
      <div className={styles.resultsWrapper}>
        {resultsSections.map((section) =>
          section.key === 'variant' ? (
            <VariantSearchResultsSection
              key={section.key}
              title={section.title}
              variantSearchError={section.variantSearchError}
              currentVariantSearchResults={section.searchResults}
              speciesList={committedSpecies}
            />
          ) : (
            <SearchResultsSection
              key={section.key}
              title={section.title}
              featureSearchMode={section.featureSearchMode}
              searchResults={section.searchResults}
              speciesList={committedSpecies}
              scrollable={false}
            />
          )
        )}
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
}) => {
  const { title, featureSearchMode, searchResults, speciesList, scrollable } =
    props;

  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      <FeatureSearchResults
        featureSearchMode={featureSearchMode}
        speciesList={speciesList}
        searchResults={searchResults}
        scrollable={scrollable}
        emptyResultsLabel={title}
        showFeatureActions={true}
      />
    </section>
  );
};

const VariantSearchResultsSection = (props: {
  title: string;
  variantSearchError: FetchBaseQueryError | SerializedError | undefined;
  currentVariantSearchResults: SearchResults | undefined;
  speciesList: CommittedItem[];
}) => {
  const {
    title,
    variantSearchError,
    currentVariantSearchResults,
    speciesList
  } = props;

  return (
    <section className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {isMissingResourceError(variantSearchError) ? (
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

export default SearchResultsView;
