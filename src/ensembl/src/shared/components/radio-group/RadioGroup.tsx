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

import defaultStyles from './RadioGroup.scss';

type OptionValue = string | number | boolean;
export type RadioOption = {
  value: OptionValue;
  label: string;
};

export type RadioOptions = RadioOption[];

type Props = {
  onChange: (selectedOption: OptionValue) => void;
  classNames?: {
    label?: string;
    wrapper?: string;
    radio?: string;
    radioChecked?: string;
  };
  options: RadioOptions;
  selectedOption: OptionValue;
  disabled?: boolean;
};

const RadioGroup = (props: Props) => {
  const styles = props.classNames
    ? { ...defaultStyles, ...props.classNames }
    : defaultStyles;

  const handleOnChange = (value: OptionValue) => {
    if (props.disabled || value === props.selectedOption) {
      return;
    }

    props.onChange(value);
  };

  return (
    <div>
      {props.options.map((option, index) => {
        const radioClass = classNames(
          styles.radio,
          option.value === props.selectedOption
            ? styles.radioChecked
            : undefined
        );
        const { value } = option;

        return (
          <div key={index} className={styles.wrapper}>
            <div onClick={() => handleOnChange(value)} className={radioClass} />
            <label className={styles.label}>
              <input
                className={defaultStyles.input}
                type="radio"
                onChange={() => handleOnChange(value)}
                checked={option.value === props.selectedOption}
                disabled={props.disabled}
              />
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioGroup;
