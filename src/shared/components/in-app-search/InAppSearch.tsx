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

import { FormEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';

import { useAppDispatch } from 'src/store';

import {
  search,
  clearSearch,
  updateQuery
} from 'src/shared/state/in-app-search/inAppSearchSlice';
import {
  getSearchQuery,
  getSearchResults
} from 'src/shared/state/in-app-search/inAppSearchSelectors';

import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import analyticsTracking from 'src/services/analytics-service';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { CircleLoader } from 'src/shared/components/loader';
import InAppSearchMatches from './InAppSearchMatches';

import type { RootState } from 'src/store';
import type { AppName } from 'src/shared/state/in-app-search/inAppSearchSlice';

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
  const [isLoading, setIsLoading] = useState(false);
  const query = useSelector((state: RootState) =>
    getSearchQuery(state, app, genomeId)
  );
  const searchResult = useSelector((state: RootState) =>
    getSearchResults(state, app, genomeId)
  );
  const dispatch = useAppDispatch();

  const onQueryChange = (event: FormEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value;
    if (!query) {
      clear();
    }
    dispatch(updateQuery({ app, genomeId, query }));
  };

  const onSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    props.onSearchSubmit?.(query);

    const searchParams = {
      app,
      genome_id: genomeId,
      query,
      page: 1,
      per_page: 50
    };

    try {
      await dispatch(search(searchParams));

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

  const clear = () => {
    dispatch(clearSearch({ app, genomeId }));
  };

  const helpText =
    'Find a gene using a stable ID (versioned or un-versioned), symbol or synonym; wildcards are also supported';

  return (
    <div
      className={classNames(styles.inAppSearch, {
        [styles.inAppSearchInInterstitial]: mode === 'interstitial'
      })}
    >
      <form
        className={getInAppSearchTopStyles(mode)}
        onSubmit={onSearchSubmit}
        data-test-id="in-app search top"
      >
        <div className={styles.label}>Find a gene in this species</div>
        <ShadedInput
          placeholder="Gene ID or name..."
          type="search"
          value={query}
          onInput={onQueryChange}
          className={styles.searchField}
          help={helpText}
          size={mode === 'interstitial' ? 'large' : 'small'}
        />
        <PrimaryButton
          className={styles.searchButton}
          disabled={!query || isLoading}
        >
          Go
        </PrimaryButton>
        {!isLoading && searchResult && (
          <div className={styles.hitsCount}>
            <span className={styles.hitsNumber}>
              {formatNumber(searchResult.meta.total_hits)}
            </span>{' '}
            {pluralise('gene', searchResult.meta.total_hits)}
          </div>
        )}
      </form>
      {isLoading ? (
        <CircleLoader className={styles.spinner} size="small" />
      ) : (
        searchResult && (
          <InAppSearchMatches
            {...searchResult}
            app={app}
            mode={mode}
            genomeIdForUrl={genomeIdForUrl}
            onMatchNavigation={props.onMatchNavigation}
          />
        )
      )}
    </div>
  );
};

const getInAppSearchTopStyles = (mode: InAppSearchMode) => {
  return styles[`inAppSearchTop${upperFirst(mode)}`];
};

export default InAppSearch;
