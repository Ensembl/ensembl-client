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

import { useAppDispatch, useAppSelector } from 'src/store';

import { getSpeciesSearchQuery } from 'src/content/app/new-species-selector/state/species-selector-search-slice/speciesSelectorSearchSelectors';
import { setQuery } from 'src/content/app/new-species-selector/state/species-selector-search-slice/speciesSelectorSearchSlice';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './SpeciesSearchField.scss';

type Props = {
  onSearchSubmit: () => void;
};

const SpeciesSearchField = (props: Props) => {
  const dispatch = useAppDispatch();
  const query = useAppSelector(getSpeciesSearchQuery);

  const onInput = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    dispatch(setQuery(value));
  };

  const onSubmit = () => {
    props.onSearchSubmit();
  };

  return (
    <form className={styles.speciesSearchField} onSubmit={onSubmit}>
      <label>Find a species</label>
      <ShadedInput
        size="large"
        type="search"
        className={styles.input}
        value={query}
        onInput={onInput}
      />
      <PrimaryButton disabled={query.length < 3} className={styles.submit}>
        Find
      </PrimaryButton>
    </form>
  );
};

export default SpeciesSearchField;
