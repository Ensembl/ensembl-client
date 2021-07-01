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

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import upperFirst from 'lodash/upperFirst';

import { search } from 'src/shared/state/in-app-search/inAppSearchSlice';
import { getSearchResults } from 'src/shared/state/in-app-search/inAppSearchSelectors';

import { pluralise } from 'src/shared/helpers/formatters/pluralisationFormatter';
import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import SearchField from 'src/shared/components/search-field/SearchField';
import { PrimaryButton } from 'src/shared/components/button/Button';
import QuestionButton, {
  QuestionButtonOption
} from 'src/shared/components/question-button/QuestionButton';
import InAppSearchMatches from './InAppSearchMatches';

import type { RootState } from 'src/store';
import type { AppName } from 'src/shared/state/in-app-search/inAppSearchSlice';

import styles from './InAppSearch.scss';

export type InAppSearchMode = 'interstitial' | 'sidebar';

export type Props = {
  app: AppName;
  genomeId: string;
  mode: InAppSearchMode;
  className?: string; // <== will remove
};

const InAppSearch = (props: Props) => {
  const { app, genomeId, mode } = props;
  const [query, setQuery] = useState('');
  const searchResult = useSelector((state: RootState) =>
    getSearchResults(state, props.app, props.genomeId)
  );
  const dispatch = useDispatch();

  const onSearchSubmit = () => {
    const searchParams = {
      app,
      genome_id: genomeId,
      query,
      page: 1,
      per_page: 50
    };
    dispatch(search(searchParams));
  };

  return (
    <div>
      <div
        className={getInAppSearchTopStyles(mode)}
        data-test-id="in-app search top"
      >
        <div className={styles.label}>Find a gene in this species</div>
        <div className={getSearchFieldWrapperClasses(mode)}>
          <SearchField
            placeholder="Gene ID or name..."
            search={query}
            onChange={setQuery}
            onSubmit={onSearchSubmit}
            className={styles.searchField}
            rightCorner={
              <QuestionButton
                helpText="This is a hint"
                styleOption={QuestionButtonOption.INPUT}
              />
            }
          />
        </div>
        <PrimaryButton
          onClick={onSearchSubmit}
          className={styles.searchButton}
          isDisabled={!query}
        >
          Go
        </PrimaryButton>
        {searchResult && (
          <div className={styles.hitsCount}>
            <span className={styles.hitsNumber}>
              {getCommaSeparatedNumber(searchResult.meta.total_hits)}
            </span>{' '}
            {pluralise('gene', searchResult.meta.total_hits)}
          </div>
        )}
      </div>
      {searchResult && (
        <InAppSearchMatches {...searchResult} mode={props.mode} />
      )}
    </div>
  );
};

const getInAppSearchTopStyles = (mode: InAppSearchMode) => {
  return styles[`inAppSearchTop${upperFirst(mode)}`];
};

const getSearchFieldWrapperClasses = (mode: InAppSearchMode) => {
  return classNames(
    styles.searchFieldWrapper,
    styles[`searchFieldWrapper${upperFirst(mode)}`]
  );
};

export default InAppSearch;
