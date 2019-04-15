import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';

import { splitFromSelected } from './helpers/select-helpers';
import * as keyCodes from 'src/shared/constants/keyCodes';

import SelectOptionsPanel from './SelectOptionsPanel';
import SelectArrowhead from './SelectArrowhead';

import styles from './Select.scss';

export type Option = {
  value: any;
  label: React.ReactNode;
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

type ClosedSelectProps = {
  // <-- TODO: think of a better name
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
  placeholder: string;
};

type OptionsSelectProps = CommonProps & OptionsSpecificProps;
type OptionGroupssSelectProps = CommonProps & OptionGroupsSpecificProps;

type SelectAdapterProps = OptionsSelectProps | OptionGroupssSelectProps;

type SelectProps = OptionGroupssSelectProps;

const ClosedSelect = (props: ClosedSelectProps) => {
  const className = props.isOpen
    ? styles.selectClosedInvisible
    : styles.selectClosed;
  return (
    <span className={className} onClick={props.onClick}>
      {props.selectedOption ? props.selectedOption.label : props.placeholder}
      <SelectArrowhead />
    </span>
  );
};

const Select = (props: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, optionGroups] = splitFromSelected(props.optionGroups);

  // use ref to keep track of whether the element is focused
  // (using ref makes this value available to the callback called from useEffect)
  const focusRef = useRef(false);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keyup', handleKeyPress);
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
      setIsOpen(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (
      !(
        focusRef.current &&
        [keyCodes.ENTER, keyCodes.ESC].includes(event.keyCode)
      )
    ) {
      return;
    }

    if (event.keyCode === keyCodes.ENTER) {
      setIsOpen(true);
    } else if (event.keyCode === keyCodes.ESC) {
      setIsOpen(false);
    }
  };

  const handleSelect = (optionIndex: GroupedOptionIndex) => {
    const [groupdIndex, itemIndex] = optionIndex;
    const selectedOption = optionGroups[groupdIndex].options[itemIndex];
    props.onSelect(selectedOption.value);
    setIsOpen(false);
  };

  const headerText = selectedOption ? selectedOption.label : props.placeholder;
  const className = classNames(styles.select, { [styles.selectOpen]: isOpen });

  return (
    <div
      className={className}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <ClosedSelect
        isOpen={isOpen}
        selectedOption={selectedOption}
        onClick={openPanel}
        placeholder={props.placeholder}
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

Select.defaultProps = {
  placeholder: 'Select'
};

// the purpose of the adapter is to unify props
// to be consumed by the Select component
const SelectAdapter = (props: SelectAdapterProps) => {
  if ((props as OptionGroupssSelectProps).optionGroups) {
    return <Select {...props as OptionGroupssSelectProps} />;
  } else {
    const { options, title, ...otherProps } = props as OptionsSelectProps;
    const optionGroups = [
      {
        title,
        options
      }
    ];
    return <Select optionGroups={optionGroups} {...otherProps} />;
  }
};

export default SelectAdapter;
