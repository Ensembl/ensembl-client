import React, { useState, useEffect } from 'react';

import {
  findSelectedIndexForOptions,
  findSelectedIndexForOptionGroups,
  splitFromSelected
} from './helpers/select-helpers';

import SelectOptionsPanel from './SelectOptionsPanel';

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

const arrowHead = (
  <svg className={styles.selectArrowhead} focusable="false" viewBox="0 0 8 8">
    <polygon points="0,0 8,0 4,8" />
  </svg>
);

const ClosedSelect = (props: ClosedSelectProps) => {
  const className = props.isOpen
    ? styles.selectClosedInvisible
    : styles.selectClosed;
  return (
    <span className={className} onClick={props.onClick}>
      {props.selectedOption ? props.selectedOption.label : props.placeholder}
      {arrowHead}
    </span>
  );
};

const Select = (props: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, optionGroups] = splitFromSelected(props.optionGroups);

  const openPanel = () => {
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  const handleSelect = (optionIndex: GroupedOptionIndex) => {
    const [groupdIndex, itemIndex] = optionIndex;
    const selectedOption = optionGroups[groupdIndex].options[itemIndex];
    props.onSelect(selectedOption.value);
    setIsOpen(false);
  };

  const headerText = selectedOption ? selectedOption.label : props.placeholder;

  return (
    <div className={styles.select}>
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
