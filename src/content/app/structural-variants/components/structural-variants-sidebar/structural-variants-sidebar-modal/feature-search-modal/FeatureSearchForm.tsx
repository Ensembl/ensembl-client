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
  type InputEvent,
  type SubmitEvent,
  type ReactNode
} from 'react';

import { getFeatureSearchLabelsByMode } from 'src/shared/helpers/featureSearchHelpers';

import { PrimaryButton } from 'src/shared/components/button/Button';
import ShadedInput from 'src/shared/components/input/ShadedInput';

// Reusing styles of a shared component
import styles from 'src/shared/components/feature-search-form/FeatureSearchForm.module.css';

type Props = {
  onSearchSubmit: (query: string) => void;
  onClear: () => void;
  resultsInfo?: ReactNode;
};

const labels = getFeatureSearchLabelsByMode('gene');
const helpText = labels.help as string;
const placeholderText = labels.placeholder;

const FeatureSearchForm = (props: Props) => {
  const { onSearchSubmit, resultsInfo } = props;

  const [input, setInput] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const onFormSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    onSearchSubmit(input);
  };

  const onQueryChange = (event: InputEvent<HTMLInputElement>) => {
    const newQuery = event.currentTarget.value;
    setInput(newQuery);
    setHasSubmitted(false);

    if (newQuery.trim() === '') {
      props.onClear();
    }
  };

  const shouldDisableSubmit = input.trim() === '' || hasSubmitted;

  return (
    <form className={styles.searchFormSidebar} onSubmit={onFormSubmit}>
      <ShadedInput
        onInput={onQueryChange}
        help={helpText}
        placeholder={placeholderText}
        type="search"
        autoFocus={true}
        size="small"
      />
      <div className={styles.sidebarBottomRow}>
        {resultsInfo && <div className={styles.resultsInfo}>{resultsInfo}</div>}
        <PrimaryButton
          type="submit"
          className={styles.submitSidebar}
          disabled={shouldDisableSubmit}
        >
          Go
        </PrimaryButton>
      </div>
    </form>
  );
};

export default FeatureSearchForm;
