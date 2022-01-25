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
};

type WithLabelProps = WithoutLabelProps & {
  label: string;
};

export type CheckboxProps = WithLabelProps | WithoutLabelProps;

const isWithLabel = (props: CheckboxProps): props is WithLabelProps => {
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
  const handleOnChange = () => {
    if (!props.disabled) {
      props.onChange(!props.checked);
    }
  };

  const themeClass = getThemeClasses(props.theme);

  const wrapperClasses = classNames(styles.checkboxHolder, themeClass);

  const checkboxClasses = classNames(
    styles.checkboxDefault,
    props.checked ? styles.checkboxChecked : styles.checkboxUnchecked,
    props.disabled && styles.checkboxDisabled
  );

  return (
    <div className={wrapperClasses}>
      <input
        type="checkbox"
        className={styles.hiddenInput}
        onChange={handleOnChange}
        checked={props.checked}
      />
      <div onClick={handleOnChange} className={checkboxClasses} />
      {isWithLabel(props) && (
        <label onClick={handleOnChange} className={styles.label}>
          {props.label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
