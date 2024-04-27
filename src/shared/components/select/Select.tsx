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

import { useState, useRef, useEffect, type ReactNode } from 'react';
import classNames from 'classnames';

import { splitFromSelected } from './helpers/select-helpers';

import SelectOptionsPanel from './SelectOptionsPanel';
import SelectArrowhead from './SelectArrowhead';

import styles from './Select.module.css';

export type Option = {
  value: any;
  label: ReactNode;
  isSelected: boolean;
  isDisabled?: boolean;
};

export type OptionGroup = {
  title?: string;
  options: Option[];
};

export type GroupedOptionIndex = [
  number, // index of option group
  number // index of the option within a group
];

type SelectControlProps = {
  isOpen: boolean;
  selectedOption: Option | null;
  placeholder: string;
  onClick: () => void;
};

type OptionsSpecificProps = {
  options: Option[];
  title?: string;
};

type OptionGroupsSpecificProps = {
  optionGroups: OptionGroup[];
};

type CommonProps = {
  onSelect: (value: any) => void;
  placeholder?: string;
};

type OptionsSelectProps = CommonProps & OptionsSpecificProps;
type OptionGroupsSelectProps = CommonProps & OptionGroupsSpecificProps;

type SelectAdapterProps = OptionsSelectProps | OptionGroupsSelectProps;

type SelectProps = OptionGroupsSelectProps & { placeholder?: string };

const SelectControl = (props: SelectControlProps) => {
  const className = props.isOpen
    ? styles.selectControlInvisible
    : styles.selectControl;
  return (
    <span className={className} onClick={props.onClick}>
      {props.selectedOption ? props.selectedOption.label : props.placeholder}
      <SelectArrowhead />
    </span>
  );
};

const Select = (props: SelectProps) => {
  const { placeholder = defaultPlaceholderText } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, optionGroups] = splitFromSelected(props.optionGroups);

  // use ref to keep track of whether the element is focused
  // (using ref makes this value available to the callback called from useEffect)
  const focusRef = useRef(false);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const openPanel = () => {
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  const handleFocus = () => {
    focusRef.current = true;
  };

  const handleBlur = () => {
    focusRef.current = false;
    if (isOpen) {
      closePanel();
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!focusRef.current) {
      return;
    }

    if (event.key === 'Enter') {
      openPanel();
    } else if (event.key === 'Escape') {
      closePanel();
    }
  };

  const handleSelect = (optionIndex: GroupedOptionIndex) => {
    const [groupIndex, itemIndex] = optionIndex;
    const selectedOption = optionGroups[groupIndex].options[itemIndex];
    props.onSelect(selectedOption.value);
    closePanel();
  };

  const headerText = selectedOption ? selectedOption.label : placeholder;
  const className = classNames(styles.select, { [styles.selectOpen]: isOpen });

  return (
    <div
      className={className}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <SelectControl
        isOpen={isOpen}
        selectedOption={selectedOption}
        onClick={openPanel}
        placeholder={placeholder}
      />
      {isOpen && (
        <SelectOptionsPanel
          optionGroups={optionGroups}
          header={headerText}
          onSelect={handleSelect}
          onClose={closePanel}
        />
      )}
    </div>
  );
};

const defaultPlaceholderText = 'Select';

// the purpose of the adapter is to unify props
// to be consumed by the Select component
const SelectAdapter = (props: SelectAdapterProps) => {
  if ((props as OptionGroupsSelectProps).optionGroups) {
    return <Select {...(props as OptionGroupsSelectProps)} />;
  }
  const { options, title, ...otherProps } = props as OptionsSelectProps;
  const optionGroups = [
    {
      title,
      options
    }
  ];
  return <Select optionGroups={optionGroups} {...otherProps} />;
};

export default SelectAdapter;
