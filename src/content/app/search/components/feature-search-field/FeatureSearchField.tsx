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
import classNames from 'classnames';

import MainSearchField from 'src/shared/components/main-search-field/MainSearchField';

import SearchIcon from 'static/icons/icon_search.svg';

import styles from './FeatureSearchField.module.css';

export type Props = {
  onSearchSubmit: (query: string) => void | (() => void);
  canSubmit?: boolean;
  onInput?: ((event: InputEvent<HTMLInputElement>) => void) | (() => void);
  onClose?: () => void;
  labelStyle?: 'plain' | 'with-icon';
  disabled?: boolean;
};

const FeatureSearchField = (props: Props) => {
  const {
    labelStyle = 'plain',
    onInput: inputHandlerFromProps,
    ...otherProps
  } = props;
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  const onInput = (event: InputEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    inputHandlerFromProps?.(event);
  };

  const label =
    labelStyle === 'plain' ? (
      'Find a feature'
    ) : (
      <span
        className={classNames(styles.label, {
          [styles.labelDisabled]: props.disabled
        })}
      >
        <SearchIcon className={styles.searchIcon} />
        <span>Find a feature</span>
      </span>
    );

  return (
    <MainSearchField
      {...otherProps}
      query={query}
      label={label}
      onInput={onInput}
      placeholder={placeholderText}
      help={helpText}
      className={styles.grid}
    />
  );
};

const placeholderText = 'Gene, transcript or variant ID...';

const helpText = `
Search for a gene, transcript or variant using a stable identifier, symbol or rsID.
`;

export default FeatureSearchField;
