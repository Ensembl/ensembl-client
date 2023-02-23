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

import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  type SelectHTMLAttributes,
  type ForwardedRef,
  type ReactNode
} from 'react';
import classNames from 'classnames';
import pickBy from 'lodash/pickBy';

import styles from './SimpleSelect.scss';
import { noop } from 'lodash';

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
  isSelected?: boolean;
};

export type OptionGroup = {
  title?: string;
  options: Option[];
};

type OptionsSpecificProps = {
  options: Option[];
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

export type SimpleSelectMethods = {
  clear: () => void;
};

const SimpleSelect = (
  props: SimpleSelectProps,
  ref: ForwardedRef<{ clear: () => void }>
) => {
  const { className, placeholder, value, ...otherProps } = props;
  const selectRef = useRef<HTMLSelectElement | null>(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (selectRef.current) {
        // Find the index of either the placeholder option or the default option
        // If none exist, pick the index of the first option (i.e., zero)
        const selectedIndex =
          [...selectRef.current.querySelectorAll('option')].findIndex(
            (el) =>
              el.hasAttribute('data-placeholder') || el.hasAttribute('selected')
          ) || 0;
        selectRef.current.selectedIndex = selectedIndex; // this doesn't seem to produce a change event in the select element
      }
    }
  }));

  const selectClassnames = classNames(styles.select, className);
  const selectProps = pickBy(
    otherProps,
    (_, key) => !['options', 'optionGroups'].includes(key)
  );

  let selectChildren: ReactNode;

  const getSelectValue = () => {
    // no point going through all these options if value is already available
    if (value) {
      return value;
    }

    let selectValue = placeholder ? '' : undefined;

    if ('optionGroups' in otherProps) {
      otherProps.optionGroups.forEach((optionGroup) => {
        optionGroup.options.forEach((option) => {
          if (option.isSelected) {
            selectValue = option.value;
          }
        });
      });
    } else {
      otherProps.options.forEach((option) => {
        if (option.isSelected) {
          selectValue = option.value;
        }
      });
    }

    return selectValue;
  };

  if ('optionGroups' in otherProps) {
    selectChildren = otherProps.optionGroups.map(
      (optionGroup, optionGroupKey) => (
        <optgroup label={optionGroup.title} key={optionGroupKey}>
          {optionGroup.options.map((option, optionKey) => (
            <option key={optionKey} value={option.value}>
              {option.label}
            </option>
          ))}
        </optgroup>
      )
    );
  } else {
    selectChildren = otherProps.options.map((option, key) => (
      <option key={key} value={option.value}>
        {option.label}
      </option>
    ));
  }

  return (
    <div className={selectClassnames}>
      <select
        ref={selectRef}
        className={styles.selectResetDefaults}
        value={getSelectValue()}
        onChange={selectProps.onChange ?? noop}
        {...selectProps}
      >
        {placeholder && renderPlaceholder(placeholder)}
        {selectChildren}
      </select>
    </div>
  );
};

const renderPlaceholder = (text: string) => (
  <option data-placeholder={true} value="" disabled={true}>
    {text}
  </option>
);

export default forwardRef(SimpleSelect);
