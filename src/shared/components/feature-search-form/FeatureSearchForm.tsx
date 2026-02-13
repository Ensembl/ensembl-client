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

import {
  useState,
  useCallback,
  type InputEvent,
  type SubmitEvent,
  type ReactNode,
} from 'react';
import classNames from 'classnames';

import {
  getFeatureSearchLabelsByMode,
  getFeatureSearchModes,
  type FeatureSearchMode
} from 'src/shared/helpers/featureSearchHelpers';

import { PrimaryButton } from '../button/Button';
import ShadedInput from '../input/ShadedInput';
import TextButton from '../text-button/TextButton';

import type { InAppSearchMode } from '../in-app-search/InAppSearch';

import styles from './FeatureSearchForm.module.css';

type Props = {
  query: string;
  activeFeatureSearchMode: FeatureSearchMode;
  searchPosition?: InAppSearchMode; // Ex: 'sidebar', 'interstitial'
  onSearchSubmit: (query: string) => void;
  onClear: () => void;
  onSearchModeChange: (mode: FeatureSearchMode) => void;
  resultsInfo?: ReactNode;
};

const FeatureSearchForm = (props: Props) => {
  const {
    query,
    activeFeatureSearchMode,
    searchPosition,
    onSearchModeChange,
    onSearchSubmit,
    onClear,
    resultsInfo
  } = props;

  const [searchInput, setSearchInput] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);
  const [disableSubmit, setDisableSubmit] = useState(true);

  if (query !== prevQuery) {
    setSearchInput(query);
    setPrevQuery(query);
    setDisableSubmit(true);
  }

  const onFormSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisableSubmit(true);
    onSearchSubmit(searchInput);
  };

  const onQueryChange = (event: InputEvent<HTMLInputElement>) => {
    const newQuery = event.currentTarget.value;
    setSearchInput(newQuery);
    setDisableSubmit(false);

    if (newQuery.trim() === '') {
      onClear();
      setDisableSubmit(true);
    }
  };

  // NOTE: future versions of React will stop passing null to ref callbacks; so update function signature when this happens
  const focusInput = useCallback((input: HTMLInputElement | null) => {
    input?.focus();
  }, []);

  const activeFeatureSearchModeLabels = getFeatureSearchLabelsByMode(
    activeFeatureSearchMode
  );

  return (
    <>
      <div className={styles.tab}>
        {getFeatureSearchModes().map((searchMode) => {
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
      <form
        className={classNames({
          [styles.searchForm]: searchPosition !== 'sidebar',
          [styles.searchFormSidebar]: searchPosition === 'sidebar'
        })}
        onSubmit={onFormSubmit}
      >
        <ShadedInput
          className={classNames({
            [styles.searchField]: searchPosition !== 'sidebar'
          })}
          onInput={onQueryChange}
          value={searchInput || ''}
          help={activeFeatureSearchModeLabels.help}
          placeholder={activeFeatureSearchModeLabels.placeholder}
          type="search"
          ref={focusInput}
          size={searchPosition === 'sidebar' ? 'small' : 'large'}
        />
        {searchPosition === 'sidebar' ? (
          <div className={styles.sidebarBottomRow}>
            {resultsInfo && (
              <div className={styles.resultsInfo}>{resultsInfo}</div>
            )}
            <PrimaryButton
              type="submit"
              className={styles.submitSidebar}
              disabled={disableSubmit}
            >
              Go
            </PrimaryButton>
          </div>
        ) : (
          <PrimaryButton
            type="submit"
            className={styles.submit}
            disabled={disableSubmit}
          >
            Go
          </PrimaryButton>
        )}
      </form>
      {searchPosition === 'interstitial' && resultsInfo && (
        <div className={styles.resultsInfoInterstitial}>{resultsInfo}</div>
      )}
    </>
  );
};

export default FeatureSearchForm;
