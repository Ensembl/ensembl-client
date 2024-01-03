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

import styles from './RadioGroup.module.css';

export type OptionValue = string | number | boolean;
export type RadioOption = {
  value: OptionValue;
  label: string;
};

export type RadioOptions = RadioOption[];
export type Theme = 'light' | 'dark';
type Direction = 'row' | 'column';

export type RadioGroupProps = {
  onChange: (selectedOption: OptionValue) => void;
  options: RadioOptions;
  selectedOption: OptionValue;
  theme?: Theme;
  direction?: Direction;
  className?: string; // optional class name for the whole radio group element
};

const RadioGroup = (props: RadioGroupProps) => {
  const direction = props.direction ?? 'column';
  const theme = props.theme ?? 'light';

  const handleChange = (value: OptionValue) => {
    if (value === props.selectedOption) {
      return;
    }
    props.onChange(value);
  };

  const radioGroupClasses = classNames(
    styles.radioGroup,
    {
      [styles.radioGroupColumn]: direction === 'column',
      [styles.radioGroupRow]: direction === 'row',
      [styles.themeDark]: theme === 'dark',
      [styles.themeLight]: theme === 'light'
    },
    props.className
  );
  const getRadioClass = (option: RadioOption) =>
    classNames(
      styles.radio,
      option.value === props.selectedOption ? styles.radioChecked : undefined
    );

  return (
    <div className={radioGroupClasses}>
      {props.options.map((option, index) => (
        <label key={index} className={styles.radioGroupItem}>
          <span className={getRadioClass(option)} />
          <span className={styles.label}>{option.label}</span>
          <input
            className={styles.input}
            type="radio"
            onChange={() => handleChange(option.value)}
            checked={option.value === props.selectedOption}
          />
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
