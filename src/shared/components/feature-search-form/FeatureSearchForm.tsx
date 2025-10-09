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

import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react';
import { PrimaryButton } from '../button/Button';
import ShadedInput from '../input/ShadedInput';
import TextButton from '../text-button/TextButton';

import {
  FeatureSearchMode,
  FEATURE_SEARCH_MODES as featureSearchModes
} from 'src/shared/types/search-api/search-modes';

import styles from './FeatureSearchForm.module.css';
import classNames from 'classnames';

type Props = {
  query: string;
  activeFeatureSearchMode: FeatureSearchMode;
  searchLocation?: string; // Ex: 'sidebar', 'interstitial'
  onSearchSubmit: (query: string) => void;
  updateActiveFeatureSearchMode: (mode: FeatureSearchMode) => void;
  resultsInfo?: ReactNode;
};

const FeatureSearchForm = (props: Props) => {
  const {
    query,
    activeFeatureSearchMode,
    searchLocation,
    updateActiveFeatureSearchMode,
    onSearchSubmit,
    resultsInfo
  } = props;

  const [searchInput, setSearchInput] = useState(query);
  const [shouldDisableSubmit, setShouldDisableSubmit] = useState(true);

  useEffect(() => {
    if (query !== searchInput) {
      setSearchInput(query);
      setShouldDisableSubmit(true);
    }
  }, [query]);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShouldDisableSubmit(true);
    onSearchSubmit(searchInput);
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setSearchInput(newQuery);
    setShouldDisableSubmit(false);

    if (newQuery.trim() === '') {
      setShouldDisableSubmit(true);
    }
  };

  // NOTE: future versions of React will stop passing null to ref callbacks; so update function signature when this happens
  const focusInput = (input: HTMLInputElement | null) => {
    input?.focus();
  };

  return (
    <>
      <div className={styles.tab}>
        {featureSearchModes.map((searchMode) =>
          searchMode.mode === activeFeatureSearchMode.mode ? (
            <TextButton key={searchMode.mode} className={styles.activeTab}>
              {searchMode.label}
            </TextButton>
          ) : (
            <TextButton
              key={searchMode.mode}
              onClick={() => updateActiveFeatureSearchMode(searchMode)}
            >
              {searchMode.label}
            </TextButton>
          )
        )}
      </div>
      <form
        className={classNames({
          [styles.searchForm]: searchLocation !== 'sidebar',
          [styles.searchFormSidebar]: searchLocation === 'sidebar'
        })}
        onSubmit={onFormSubmit}
      >
        <ShadedInput
          className={classNames({
            [styles.searchField]: searchLocation !== 'sidebar',
            [styles.searchFieldSidebar]: searchLocation === 'sidebar'
          })}
          onInput={onQueryChange}
          value={searchInput || ''}
          help={activeFeatureSearchMode.help}
          placeholder={activeFeatureSearchMode.placeholder}
          type="search"
          ref={focusInput}
          size={searchLocation === 'sidebar' ? 'small' : 'large'}
        />
        {searchLocation === 'sidebar' ? (
          <div className={styles.sidebarBottomRow}>
            {resultsInfo && (
              <div className={styles.resultsInfo}>{resultsInfo}</div>
            )}
            <PrimaryButton
              type="submit"
              className={styles.submitSidebar}
              disabled={shouldDisableSubmit}
            >
              Go
            </PrimaryButton>
          </div>
        ) : (
          <PrimaryButton
            type="submit"
            className={styles.submit}
            disabled={shouldDisableSubmit}
          >
            Go
          </PrimaryButton>
        )}
      </form>
    </>
  );
};

export default FeatureSearchForm;
