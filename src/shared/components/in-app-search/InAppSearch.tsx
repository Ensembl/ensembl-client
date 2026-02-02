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

import classNames from 'classnames';

import analyticsTracking from 'src/services/analytics-service';
import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';
import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';

import { useAppDispatch, useAppSelector } from 'src/store';
import { getInAppFeatureQueries } from 'src/shared/state/in-app-search/inAppSearchSelectors';
import {
  useLazySearchGenesQuery,
  useLazySearchVariantsQuery
} from 'src/shared/state/api-slices/searchApiSlice';
import {
  updateGeneQuery,
  updateVariantQuery,
  type AppName
} from 'src/shared/state/in-app-search/inAppSearchSlice';

import { CircleLoader } from 'src/shared/components/loader';
import InAppSearchMatches from './InAppSearchMatches';

import FeatureSearchForm from '../feature-search-form/FeatureSearchForm';

import type { SearchResults } from 'src/shared/types/search-api/search-results';
import type { FeatureSearchMode } from 'src/shared/helpers/featureSearchHelpers';

import styles from './InAppSearch.module.css';

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
  const dispatch = useAppDispatch();

  const initialMode = 'gene';
  const [activeSearchMode, setActiveSearchMode] = useState<FeatureSearchMode>(initialMode);

  const inAppFeatureQueries = useAppSelector((state) =>
    getInAppFeatureQueries(state, app, genomeId)
  );

  const [triggerGeneSearch, geneSearchResults] = useLazySearchGenesQuery();
  const { currentData: currentGeneSearchResults } = geneSearchResults;
  const [triggerVariantSearch, variantSearchResults] =
    useLazySearchVariantsQuery();
  const { currentData: currentVariantSearchResults, error: variantSearchError } = variantSearchResults;

  const query = inAppFeatureQueries[activeSearchMode as keyof typeof inAppFeatureQueries];
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

    if (app === 'entityViewer') {
      analyticsTracking.trackEvent({
        category: `${app}_${mode}_search`,
        action: 'submit_search',
        label: query
      });
    }
  };

  const onSearchModeChange = (
    featureSearchMode: FeatureSearchMode
  ) => {
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

  const resultsContainerClass = classNames({
    [styles.resultsContainer]: mode !== 'sidebar',
    [styles.resultsContainerSidebar]: mode === 'sidebar'
  });

  const isNotFound = (error: any) => error && 'status' in error && error.status === 404;

  return (
    <div className={styles.inAppSearch}>
      <div className={styles.inAppSearchFormContainer}>
        <FeatureSearchForm
          activeFeatureSearchMode={activeSearchMode}
          query={query}
          searchPosition={mode}
          onSearchSubmit={onFeatureSearchSubmit}
          onClear={() => onFeatureSearchSubmit('')}
          onSearchModeChange={onSearchModeChange}
          resultsInfo={totalSearchHitsComponent}
        />
      </div>

      {isLoading && <CircleLoader className={styles.spinner} size="small" />}
      {!isLoading && isGeneSearchResultsDefined && (
        <div className={resultsContainerClass}>
          <InAppSearchMatches
            results={currentGeneSearchResults}
            featureSearchMode={activeSearchMode}
            app={app}
            mode={mode}
            genomeIdForUrl={genomeIdForUrl}
            onMatchNavigation={props.onMatchNavigation}
          />
        </div>
      )}
      {!isLoading && isVariantSearchMode && (
        <div className={resultsContainerClass}>
          {isNotFound(variantSearchError) ? (
            <span className={styles.warning}>Variation data is not currently available for this genome</span>
            ) : isVariantSearchResultsDefined ? (
              <InAppSearchMatches
                results={currentVariantSearchResults}
                featureSearchMode={activeSearchMode}
                app={app}
                mode={mode}
                genomeIdForUrl={genomeIdForUrl}
                onMatchNavigation={props.onMatchNavigation}
              />
            ) : null
          }
        </div>
      )}
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

export default InAppSearch;
