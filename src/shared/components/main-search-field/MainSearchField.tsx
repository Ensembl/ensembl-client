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
  useId,
  type InputEvent,
  type SubmitEvent,
  type ReactNode
} from 'react';
import classNames from 'classnames';

import ShadedInput from 'src/shared/components/input/ShadedInput';
import { PrimaryButton } from 'src/shared/components/button/Button';
import { CloseButtonWithLabel } from 'src/shared/components/close-button/CloseButton';

import styles from './MainSearchField.module.css';

/**
 * The name of this component may not be good.
 * Its purpose though is to encapsulate, in a single component,
 * a search field, its label, the "Find" button, and the "Close" button.
 *
 * This is the arrangement that is used, e.g. on the species selector page,
 * the search pagee, and when selecting species on BLAST and VEP pages.
 */

export type Props = {
  query: string;
  onSearchSubmit: (query: string) => void | (() => void);
  canSubmit?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  ariaLabel?: string;
  help?: string;
  placeholder?: string;
  minQueryLength?: number;
  onInput?: ((event: InputEvent<HTMLInputElement>) => void) | (() => void);
  onClose?: () => void;
  className?: string;
};

export const MainSearchField = (props: Props) => {
  const {
    query,
    onInput,
    canSubmit = true,
    disabled = false,
    label,
    ariaLabel,
    minQueryLength = 1,
    help,
    placeholder,
    onClose
  } = props;
  const id = useId();

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSearchSubmit(query);
  };

  const componentClasses = classNames(
    styles.grid,
    { [styles.gridWithoutLabel]: !label },
    props.className
  );

  return (
    <form className={componentClasses} onSubmit={onSubmit}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <ShadedInput
        id={id}
        size="large"
        type="search"
        className={styles.input}
        value={query}
        onInput={onInput}
        disabled={disabled}
        placeholder={placeholder}
        help={help}
        minLength={minQueryLength}
        aria-label={ariaLabel}
        autoComplete="off"
      />
      <PrimaryButton
        disabled={disabled || !canSubmit || query.length < minQueryLength}
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

export default MainSearchField;
