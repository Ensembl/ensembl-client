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
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';

import styles from './SpeciesSearchField.module.css';

export type Props = {
  query: string;
  onSearchSubmit: (query: string) => void | (() => void);
  canSubmit?: boolean;
  onInput?: ((event: InputEvent<HTMLInputElement>) => void) | (() => void);
  onClose?: () => void;
};

export const SpeciesSearchField = (props: Props) => {
  const { query, onInput, canSubmit = true, onClose } = props;

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSearchSubmit(query);
  };

  return (
    <form className={styles.grid} onSubmit={onSubmit}>
      <label className={styles.label}>Find a species</label>
      <ShadedInput
        size="large"
        type="search"
        className={styles.input}
        value={query}
        onInput={onInput}
        placeholder={placeholderText}
        help={helpText}
        minLength={3}
      />
      <PrimaryButton
        disabled={!canSubmit || query.length < 3}
        className={classNames(styles.controls, styles.submit)}
      >
        Find
      </PrimaryButton>
      {onClose && (
        <CloseButtonWithLabel className={styles.close} onClick={onClose} />
      )}
    </form>
  );
};

const placeholderText = 'Common or scientific name...';

const helpText = `
Search for a species using a common name, scientific name, assembly ID or GCA.
If no results are shown, please try a different spelling or attribute
`;

// Species search field, but wrapped in a component that reads a query parameter from the url.
// Can be used by default in Species Selector
const WrappedSpeciesSearchField = (props: Omit<Props, 'query'>) => {
  const [searchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get('query') || ''
  );

  const onInput = (event: InputEvent<HTMLInputElement>) => {
    setSearchInput(event.currentTarget.value);
    props.onInput?.(event);
  };

  return (
    <SpeciesSearchField {...props} onInput={onInput} query={searchInput} />
  );
};

export default WrappedSpeciesSearchField;
