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

import classNames from 'classnames';
import type { ReactNode } from 'react';

import Checkbox from '../checkbox/Checkbox';

import styles from './CheckboxWithLabel.module.css';

type Theme = 'lighter' | 'light' | 'dark';

type Props = {
  onChange: (status: boolean) => void;
  disabled?: boolean;
  checked: boolean;
  theme?: Theme;
  className?: string; // will only apply to the outermost element of the component
  label: ReactNode;
};

const CheckboxWithLabel = (props: Props) => {
  const onChange = () => {
    if (!props.disabled) {
      props.onChange(!props.checked);
    }
  };

  const componentClasses = classNames(
    styles.grid,
    {
      // light theme is the default, and does not need a special class
      [styles.themeLighter]: props.theme === 'lighter',
      [styles.themeDark]: props.theme === 'dark'
    },
    props.className
  );

  // const checkboxClasses = classNames(
  //   styles.checkboxDefault,
  //   props.checked ? styles.checkboxChecked : styles.checkboxUnchecked,
  //   props.disabled && styles.checkboxDisabled
  // );

  return (
    <label className={componentClasses} data-test-id="checkbox-label-grid">
      <Checkbox
        checked={props.checked}
        disabled={props.disabled}
        onChange={onChange}
      />
      <span className={styles.label}>{props.label}</span>
    </label>
  );
};

export default CheckboxWithLabel;
