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

import { useState } from 'react';

import analyticsTracking from 'src/services/analytics-service';

import { CircleLoader } from 'src/shared/components/loader';
import InAppSearchMatches from './InAppSearchMatches';

import type { AppName } from 'src/shared/state/in-app-search/inAppSearchSlice';

import FeatureSearchForm from '../feature-search-form/FeatureSearchForm';
import {
  FEATURE_SEARCH_MODES as featureSearchModes,
  FeatureSearchMode,
  FeatureSearchModeType
} from 'src/shared/types/search-api/search-modes';
import {
  useLazySearchGenesQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';

import styles from './InAppSearch.module.css';
import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { SearchResults } from 'src/shared/types/search-api/search-results';

export type InAppSearchMode = 'interstitial' | 'sidebar';

export type Props = {
  app: AppName;
  genomeId: string;
  genomeIdForUrl: string; // this should be a temporary measure; it should be returned by search api
  mode: InAppSearchMode;
  onSearchSubmit?: (query: string) => void;
  onMatchNavigation?: () => void; // currently, there are no requirements for this callback to receive any data
};

const InAppSearch = (props: Props) => {
  const { app, genomeId, genomeIdForUrl, mode } = props;
  const initialMode = featureSearchModes.find(
    (m) => m.mode === FeatureSearchModeType.GENE_SEARCH_MODE
  )!;
  const [activeSearchMode, setActiveSearchMode] =
    useState<FeatureSearchMode>(initialMode);
  const [queries, setQueries] = useState<Record<string, string>>({
    gene: '',
    variant: ''
  });
  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();
  const { currentData: currentVariantSearchResults } = variantSearchResults;
  const [isLoading, setIsLoading] = useState(false);
  const query = queries[activeSearchMode.mode];

  const onFeatureSearchSubmit = (input: string) => {
    setIsLoading(true);
    setQueries((prev) => ({
      ...prev,
      [activeSearchMode.mode]: input
    }));

    if (activeSearchMode.mode === FeatureSearchModeType.GENE_SEARCH_MODE) {
      triggerGeneSearch({
        genome_ids: [genomeId],
        query: input,
        page: 1,
        per_page: 50
      });
    }

    if (activeSearchMode.mode === FeatureSearchModeType.VARIANT_SEARCH_MODE) {
      triggerVariantSearch({
        genome_ids: [genomeId],
        query: input,
        page: 1,
        per_page: 50
      });
    }
    try {
      if (app === 'entityViewer') {
        analyticsTracking.trackEvent({
          category: `${app}_${mode}_search`,
          action: 'submit_search',
          label: query
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateActiveFeatureSearchMode = (
    featureSearchMode: FeatureSearchMode
  ) => {
    setActiveSearchMode(featureSearchMode);
  };

  const totalSearchHitsComponent =
    activeSearchMode.mode === FeatureSearchModeType.GENE_SEARCH_MODE &&
    currentGeneSearchResults ? (
      <TotalSearchHits
        results={currentGeneSearchResults}
        featureSearchMode={activeSearchMode.mode}
      />
    ) : activeSearchMode.mode === FeatureSearchModeType.VARIANT_SEARCH_MODE &&
      currentVariantSearchResults ? (
      <TotalSearchHits
        results={currentVariantSearchResults}
        featureSearchMode={activeSearchMode.mode}
      />
    ) : undefined;

  return (
    <div className={styles.inAppSearch}>
      <div className={styles.inAppSearchFormContainer}>
        <FeatureSearchForm
          activeFeatureSearchMode={activeSearchMode}
          query={query}
          searchLocation={mode}
          onSearchSubmit={onFeatureSearchSubmit}
          updateActiveFeatureSearchMode={updateActiveFeatureSearchMode}
          resultsInfo={totalSearchHitsComponent}
        />
      </div>

      {isLoading && <CircleLoader className={styles.spinner} size="small" />}
      {!isLoading &&
        activeSearchMode.mode === FeatureSearchModeType.GENE_SEARCH_MODE &&
        currentGeneSearchResults && (
          <div className={styles.resultsContainer}>
            <InAppSearchMatches
              results={currentGeneSearchResults}
              featureSearchMode={activeSearchMode.mode}
              app={app}
              mode={mode}
              genomeIdForUrl={genomeIdForUrl}
              onMatchNavigation={props.onMatchNavigation}
            />
          </div>
        )}
      {!isLoading &&
        activeSearchMode.mode === FeatureSearchModeType.VARIANT_SEARCH_MODE &&
        currentVariantSearchResults && (
          <div className={styles.resultsContainer}>
            <InAppSearchMatches
              results={currentVariantSearchResults}
              featureSearchMode={activeSearchMode.mode}
              app={app}
              mode={mode}
              genomeIdForUrl={genomeIdForUrl}
              onMatchNavigation={props.onMatchNavigation}
            />
          </div>
        )}
    </div>
  );
};

const TotalSearchHits = (props: {
  results: SearchResults;
  featureSearchMode: string;
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

export default InAppSearch;
