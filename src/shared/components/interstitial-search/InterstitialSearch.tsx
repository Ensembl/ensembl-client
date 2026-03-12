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

import { useEffect, useState } from 'react';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import {
  getFeatureSearchLabelsByMode,
  getFeatureSearchModes,
  type FeatureSearchAppName,
  type FeatureSearchMode,
  type FeatureSearchModesType
} from 'src/shared/helpers/featureSearchHelpers';

import { useAppDispatch, useAppSelector } from 'src/store';
import { getFeatureSearchQueries } from 'src/shared/state/feature-search/featureSearchSelectors';
import {
  useLazySearchGenesQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';
import {
  updateGeneQuery,
  updateVariantQuery
} from 'src/shared/state/feature-search/featureSearchSlice';
import {
  isMissingResourceError,
  getErrorMessage
} from 'src/shared/state/api-slices/restSlice';

import { CircleLoader } from 'src/shared/components/loader';

import FeatureSearchForm from 'src/shared/components/feature-search-form/FeatureSearchForm';
import GeneSearchMatches from 'src/shared/components/search-match/GeneSearchMatches';
import VariantSearchMatches from 'src/shared/components/search-match/VariantSearchMatches';
import TextButton from '../text-button/TextButton';

import type { SearchResults } from 'src/shared/types/search-api/search-results';

import styles from './InterstitialSearch.module.css';

export type Props = {
  app: FeatureSearchAppName;
  genomeId: string;
  genomeIdForUrl: string; // this should be a temporary measure; it should be returned by search api
  onSearchSubmit?: (query: string) => void;
  onMatchNavigation?: () => void; // currently, there are no requirements for this callback to receive any data
};

const InterstitialSearch = (props: Props) => {
  const { app, genomeId, genomeIdForUrl, onSearchSubmit } = props;
  const dispatch = useAppDispatch();

  const initialMode = 'gene';
  const [activeSearchMode, setActiveSearchMode] =
    useState<FeatureSearchMode>(initialMode);

  const featureSearchQueries = useAppSelector((state) =>
    getFeatureSearchQueries(state, app, genomeId)
  );

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();
  const {
    currentData: currentVariantSearchResults,
    error: variantSearchError
  } = variantSearchResults;
  const searchModes = getFeatureSearchModes();

  const query =
    featureSearchQueries[activeSearchMode as keyof typeof featureSearchQueries];
  const isGeneSearchMode = activeSearchMode === 'gene';
  const isVariantSearchMode = activeSearchMode === 'variant';

  useEffect(() => {
    if (!query) {
      return;
    }

    const searchParams = {
      genome_ids: [genomeId],
      query: query,
      page: 1,
      per_page: 50
    };

    if (isGeneSearchMode) {
      triggerGeneSearch(searchParams);
    }

    if (isVariantSearchMode) {
      triggerVariantSearch(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const onFeatureSearchSubmit = (input: string) => {
    const isEmpty = input.trim() === '';

    if (isGeneSearchMode) {
      dispatch(updateGeneQuery({ app, genomeId, query: input }));

      if (isEmpty) {
        geneSearchResults.reset();
      }
    } else if (isVariantSearchMode) {
      dispatch(updateVariantQuery({ app, genomeId, query: input }));

      if (isEmpty) {
        variantSearchResults.reset();
      }
    }

    if (onSearchSubmit) {
      onSearchSubmit(input);
    }
  };

  const onSearchModeChange = (featureSearchMode: FeatureSearchMode) => {
    setActiveSearchMode(featureSearchMode);
  };

  const isGeneSearchResultsDefined =
    isGeneSearchMode && currentGeneSearchResults;
  const isVariantSearchResultsDefined =
    isVariantSearchMode && currentVariantSearchResults;
  const isLoading =
    (isGeneSearchMode && geneSearchResults.isFetching) ||
    (isVariantSearchMode && variantSearchResults.isFetching);

  const totalSearchHitsComponent = isGeneSearchResultsDefined ? (
    <TotalSearchHits
      results={currentGeneSearchResults}
      featureSearchMode={activeSearchMode}
    />
  ) : isVariantSearchResultsDefined ? (
    <TotalSearchHits
      results={currentVariantSearchResults}
      featureSearchMode={activeSearchMode}
    />
  ) : undefined;

  const matchesResultContent = isGeneSearchResultsDefined ? (
    <GeneSearchMatches
      results={currentGeneSearchResults}
      app={app}
      mode="interstitial"
      genomeIdForUrl={genomeIdForUrl}
      onMatchNavigation={props.onMatchNavigation}
    />
  ) : isVariantSearchMode ? (
    isMissingResourceError(variantSearchError) ? (
      <span className={styles.warning}>
        {getErrorMessage(variantSearchError)}
      </span>
    ) : isVariantSearchResultsDefined ? (
      <VariantSearchMatches
        results={currentVariantSearchResults}
        app={app}
        mode="interstitial"
        genomeIdForUrl={genomeIdForUrl}
        onMatchNavigation={props.onMatchNavigation}
      />
    ) : null
  ) : null;

  return (
    <div className={styles.interstitialSearch}>
      <SearchTabs
        activeFeatureSearchMode={activeSearchMode}
        onSearchModeChange={onSearchModeChange}
        featureSearchModes={searchModes}
      />
      {searchModes.includes(activeSearchMode) && (
        <FeatureSearchForm
          activeFeatureSearchMode={activeSearchMode}
          query={query}
          onSearchSubmit={onFeatureSearchSubmit}
          onClear={() => onFeatureSearchSubmit('')}
        />
      )}
      {totalSearchHitsComponent && (
        <div className={styles.totalSearchHits}>{totalSearchHitsComponent}</div>
      )}
      {isLoading ? (
        <CircleLoader className={styles.spinner} size="small" />
      ) : (
        <div className={styles.resultsContainer}>{matchesResultContent}</div>
      )}
    </div>
  );
};

const SearchTabs = (props: {
  activeFeatureSearchMode: FeatureSearchMode;
  onSearchModeChange: (mode: FeatureSearchMode) => void;
  featureSearchModes: FeatureSearchModesType;
}) => {
  const { activeFeatureSearchMode, onSearchModeChange, featureSearchModes } =
    props;

  return (
    <div className={styles.tabs}>
      {featureSearchModes.map((searchMode) => {
        const searchModeLabels = getFeatureSearchLabelsByMode(searchMode);
        return searchMode === activeFeatureSearchMode ? (
          <TextButton key={searchMode} className={styles.activeTab} disabled>
            {searchModeLabels.label}
          </TextButton>
        ) : (
          <TextButton
            key={searchMode}
            onClick={() => onSearchModeChange(searchMode)}
          >
            {searchModeLabels.label}
          </TextButton>
        );
      })}
    </div>
  );
};

const TotalSearchHits = (props: {
  results: SearchResults;
  featureSearchMode: FeatureSearchMode;
}) => {
  const { results, featureSearchMode } = props;
  return (
    <div>
      <span className={styles.hitsNumber}>
        {formatNumber(results.meta.total_hits)}
      </span>{' '}
      {pluralise(featureSearchMode, results.meta.total_hits)}
    </div>
  );
};

export default InterstitialSearch;
