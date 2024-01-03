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

import React, { type FormEvent } from 'react';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from 'src/store';

import { getSpeciesSearchQuery } from 'src/content/app/species-selector/state/species-selector-search-slice/speciesSelectorSearchSelectors';
import { setQuery } from 'src/content/app/species-selector/state/species-selector-search-slice/speciesSelectorSearchSlice';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './SpeciesSearchField.module.css';

export type Props = {
  query: string;
  onSearchSubmit: () => void;
  canSubmit?: boolean;
  onInput?: ((event: FormEvent<HTMLInputElement>) => void) | (() => void);
};

export const SpeciesSearchField = (props: Props) => {
  const { query, onInput, canSubmit = true } = props;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSearchSubmit();
  };

  return (
    <form className={styles.grid} onSubmit={onSubmit}>
      <label>Find a species</label>
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
    </form>
  );
};

const placeholderText = 'Common or scientific name...';

const helpText = `
Search for a species using a common name, scientific name, assembly ID or GCA.
If no results are shown, please try a different spelling or attribute
`;

// Species search field, but wrapped in redux.
// Can be used by default in Species Selector
const WrappedSpeciesSearchField = (props: Omit<Props, 'query'>) => {
  const dispatch = useAppDispatch();
  const query = useAppSelector(getSpeciesSearchQuery);

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    dispatch(setQuery(value));
    props.onInput?.(event);
  };

  return <SpeciesSearchField {...props} onInput={onInput} query={query} />;
};

export default WrappedSpeciesSearchField;
