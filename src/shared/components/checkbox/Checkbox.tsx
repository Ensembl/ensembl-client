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

import React from 'react';
import classNames from 'classnames';

import styles from './Checkbox.scss';

type Theme = 'lighter' | 'light' | 'dark';

type WithoutLabelProps = {
  onChange: (status: boolean) => void;
  disabled?: boolean;
  checked: boolean;
  theme?: Theme;
  className?: string; // will only apply to the outermost element of the component
};

type WithLabelProps = WithoutLabelProps & {
  label: string;
};

export type CheckboxProps = WithLabelProps | WithoutLabelProps;

const hasLabel = (props: CheckboxProps): props is WithLabelProps => {
  return 'label' in props;
};

const getThemeClasses = (theme: Theme = 'light') => {
  if (theme === 'lighter') {
    return styles.themeLighter;
  }

  if (theme === 'dark') {
    return styles.themeDark;
  }
};

const Checkbox = (props: CheckboxProps) => {
  const onChange = () => {
    if (!props.disabled) {
      props.onChange(!props.checked);
    }
  };

  const themeClass = getThemeClasses(props.theme);

  const wrapperClasses = classNames(
    styles.wrapper,
    themeClass,
    props.className
  );

  const checkboxClasses = classNames(
    styles.checkboxDefault,
    props.checked ? styles.checkboxChecked : styles.checkboxUnchecked,
    props.disabled && styles.checkboxDisabled
  );

  const checkboxElement = (
    <>
      <input
        type="checkbox"
        className={styles.hiddenInput}
        checked={props.checked}
        disabled={props.disabled}
        onChange={onChange}
      />
      <span className={checkboxClasses} />
    </>
  );

  // NOTE: the attempt to wrap the input with a label and only listen to input's change event
  // was rejected, because such checkboxes failed to work inside a zmenu
  return hasLabel(props) ? (
    <div className={wrapperClasses}>
      <div
        className={styles.grid}
        data-test-id="checkbox-label-grid"
        onClick={onChange}
      >
        {checkboxElement}
        <label className={styles.label}>{props.label}</label>
      </div>
    </div>
  ) : (
    <div data-test-id="checkbox" className={wrapperClasses} onClick={onChange}>
      {checkboxElement}
    </div>
  );
};

export default Checkbox;
