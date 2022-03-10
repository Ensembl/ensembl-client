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

import React, { type SelectHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './SimpleSelect.scss';

type HTMLSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

// This is just a simple wrapper for the native HTML select element.
// The purpose of this React component is to style the select button,
// since it's the only part of the native select element that can be styled.

// NOTE: when interacting with SimpleSelect component,
// pass your event handler to the onInput rather than the onChange property,
// because onInput fires immediately, while the onChange fires when the select gets unfocussed.

export type Option = {
  value: string;
  label: string;
};

export type OptionGroup = {
  title?: string;
  options: Option[];
};

type OptionsSpecificProps = {
  options: Option[];
  title?: string;
};

type OptionGroupsSpecificProps = {
  optionGroups: OptionGroup[];
};

type CommonProps = {
  placeholder?: string;
};

type OptionsSelectProps = CommonProps & OptionsSpecificProps;
type OptionGroupsSelectProps = CommonProps & OptionGroupsSpecificProps;

export type SimpleSelectProps = HTMLSelectProps &
  (OptionsSelectProps | OptionGroupsSelectProps) &
  CommonProps;

const SimpleSelect = (props: SimpleSelectProps) => {
  const { className, placeholder, ...rest } = props;

  const selectClassnames = classNames(styles.select, className);

  if ('optionGroups' in rest) {
    const { optionGroups, ...selectProps } = rest;
    return (
      <div className={selectClassnames}>
        <select className={styles.selectResetDefaults} {...selectProps}>
          {placeholder && (
            <option value="" hidden={true}>
              {placeholder}
            </option>
          )}
          {optionGroups.map((optionGroup, optionGroupKey) => {
            return (
              <optgroup label={optionGroup.title} key={optionGroupKey}>
                {optionGroup.options.map((option, optionKey) => (
                  <option key={optionKey} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </div>
    );
  }

  const { options, ...selectProps } = rest;
  return (
    <div className={selectClassnames}>
      <select className={styles.selectResetDefaults} {...selectProps}>
        {placeholder && (
          <option value="" hidden={true}>
            {placeholder}
          </option>
        )}
        {options.map((option, key) => (
          <option key={key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SimpleSelect;
