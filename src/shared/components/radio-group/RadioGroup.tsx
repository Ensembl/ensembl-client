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

import styles from './RadioGroup.scss';

export type OptionValue = string | number | boolean;
export type RadioOption = {
  value: OptionValue;
  label: string;
};

export type RadioOptions = RadioOption[];
export type Theme = 'light' | 'dark';

export type RadioGroupProps = {
  onChange: (selectedOption: OptionValue) => void;
  classNames?: {
    label?: string;
    wrapper?: string;
    radio?: string;
    radioChecked?: string;
  };
  theme?: Theme;
  options: RadioOptions;
  selectedOption: OptionValue;
  disabled?: boolean;
};

const getThemeClasses = (theme?: Theme) =>
  theme === 'dark' ? styles.themeDark : styles.themeLight;

const RadioGroup = (props: RadioGroupProps) => {
  const handleChange = (value: OptionValue) => {
    if (props.disabled || value === props.selectedOption) {
      return;
    }
    props.onChange(value);
  };

  const themeClass = getThemeClasses(props.theme);
  const wrapperClass = classNames(
    styles.wrapper,
    props.classNames?.wrapper,
    themeClass
  );
  const labelClass = classNames(styles.label, props.classNames?.label);

  const getRadioClass = (option: RadioOption) => {
    const radioCheckedClass = classNames(
      styles.radioChecked,
      props.classNames?.radioChecked
    );

    const radioClass = classNames(
      styles.radio,
      props.classNames?.radio,
      option.value === props.selectedOption ? radioCheckedClass : undefined
    );

    return radioClass;
  };

  return (
    <div>
      {props.options.map((option, index) => (
        <div key={index} className={wrapperClass}>
          <div
            onClick={() => handleChange(option.value)}
            className={getRadioClass(option)}
          />
          <label className={labelClass}>
            <input
              className={styles.input}
              type="radio"
              onChange={() => handleChange(option.value)}
              checked={option.value === props.selectedOption}
              disabled={props.disabled}
            />
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
