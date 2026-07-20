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

import { useState, type InputEvent } from 'react';
import { useSearchParams } from 'react-router';

import MainSearchField from 'src/shared/components/main-search-field/MainSearchField';

import SpeciesSelectorIcon from 'static/icons/icon_launchbar_species_selector.svg';

import styles from './SpeciesSearchField.module.css';

export type Props = {
  query: string;
  onSearchSubmit: (query: string) => void | (() => void);
  canSubmit?: boolean;
  onInput?: ((event: InputEvent<HTMLInputElement>) => void) | (() => void);
  onClose?: () => void;
  labelStyle?: 'plain' | 'with-icon';
};

export const SpeciesSearchField = (props: Props) => {
  const { labelStyle = 'plain', ...otherProps } = props;
  const label =
    labelStyle === 'plain' ? (
      'Find a species'
    ) : (
      <span className={styles.label}>
        <SpeciesSelectorIcon className={styles.icon} />
        <span>Find a species</span>
      </span>
    );

  return (
    <MainSearchField
      {...otherProps}
      label={label}
      placeholder={placeholderText}
      help={helpText}
      className={styles.grid}
    />
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
