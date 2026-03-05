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

import { useState, type InputEvent, type SubmitEvent } from 'react';

import {
  getFeatureSearchLabelsByMode,
  type FeatureSearchMode
} from 'src/shared/helpers/featureSearchHelpers';

import { PrimaryButton } from '../button/Button';
import ShadedInput from '../input/ShadedInput';

import styles from './FeatureSearchForm.module.css';

type Props = {
  query: string;
  activeFeatureSearchMode: FeatureSearchMode;
  onSearchSubmit: (query: string) => void;
  onClear: () => void;
};

const FeatureSearchForm = (props: Props) => {
  const { query, activeFeatureSearchMode, onSearchSubmit, onClear } = props;
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

  const activeFeatureSearchModeLabels = getFeatureSearchLabelsByMode(
    activeFeatureSearchMode
  );

  return (
    <form className={styles.searchForm} onSubmit={onFormSubmit}>
      <ShadedInput
        className={styles.searchField}
        onInput={onQueryChange}
        value={searchInput || ''}
        help={activeFeatureSearchModeLabels.help}
        placeholder={activeFeatureSearchModeLabels.placeholder}
        type="search"
        autoFocus={true}
        size={'large'}
      />
      <PrimaryButton
        type="submit"
        className={styles.submit}
        disabled={disableSubmit}
      >
        Go
      </PrimaryButton>
    </form>
  );
};

export default FeatureSearchForm;
