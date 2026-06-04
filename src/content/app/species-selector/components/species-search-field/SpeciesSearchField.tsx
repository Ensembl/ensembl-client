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

import { type InputEvent, type SubmitEvent } from 'react';
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
  disabled?: boolean;
  label?: string | null;
  ariaLabel?: string;
  help?: string;
  placeholder?: string;
  onInput?: ((event: InputEvent<HTMLInputElement>) => void) | (() => void);
  onClose?: () => void;
};

export const SpeciesSearchField = (props: Props) => {
  const {
    query,
    onInput,
    canSubmit = true,
    disabled = false,
    label = 'Find a species',
    ariaLabel,
    help = defaultHelpText,
    placeholder = placeholderText,
    onClose
  } = props;

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSearchSubmit(query);
  };

  return (
    <form
      className={classNames(styles.grid, { [styles.gridWithoutLabel]: !label })}
      onSubmit={onSubmit}
    >
      {label && <label className={styles.label}>{label}</label>}
      <ShadedInput
        size="large"
        type="search"
        className={styles.input}
        value={query}
        onInput={onInput}
        disabled={disabled}
        placeholder={placeholder}
        help={help}
        minLength={3}
        aria-label={ariaLabel}
      />
      <PrimaryButton
        disabled={disabled || !canSubmit || query.length < 3}
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

const defaultHelpText = `
Search for a species using a common name, scientific name, assembly ID or GCA.
If no results are shown, please try a different spelling or attribute
`;

// Species search field, but wrapped in a component that reads a query parameter from the url.
// Can be used by default in Species Selector
const WrappedSpeciesSearchField = (props: Omit<Props, 'query'>) => {
  const [searchParams] = useSearchParams();
  const queryFromParams = searchParams.get('query') || '';

  return (
    <SpeciesSearchField
      {...props}
      onInput={props.onInput}
      query={queryFromParams}
      ariaLabel={props.label ?? undefined}
    />
  );
};

export default WrappedSpeciesSearchField;
