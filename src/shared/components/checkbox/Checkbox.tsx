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
import type { ComponentProps } from 'react';

import styles from './Checkbox.module.css';

type Theme = 'lighter' | 'light' | 'dark';

type InputPropsWithoutType = Omit<ComponentProps<'input'>, 'type'>; // the type of the input used in this comoponent is always 'checkbox'

export type CheckboxProps = InputPropsWithoutType & {
  theme?: Theme;
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
  const { children, ...inputProps } = props;

  const themeClass = getThemeClasses(props.theme);

  const wrapperClasses = classNames(
    styles.wrapper,
    themeClass,
    props.className
  );

  const checkboxClasses = classNames(styles.checkbox, styles.checkboxDefault);

  const checkboxElement = (
    <input {...inputProps} type="checkbox" className={checkboxClasses} />
  );

  return children ? (
    <div className={wrapperClasses}>
      <label className={styles.grid} data-test-id="checkbox-label-grid">
        {checkboxElement}
        <span className={styles.label}>{children}</span>
      </label>
    </div>
  ) : (
    <label data-test-id="checkbox" className={wrapperClasses}>
      {checkboxElement}
    </label>
  );
};

export default Checkbox;
