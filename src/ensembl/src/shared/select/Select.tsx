import React, { useState, useEffect } from 'react';

import {
  findSelectedIndexForOptions,
  findSelectedIndexForOptionGroups
} from './select-helpers';

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
  label: React.ReactNode;
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
  return (
    <span className={styles.selectClosed} onClick={props.onClick}>
      {props.label}
      {arrowHead}
    </span>
  );
};

const Select = (props: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPanel = () => {
    setIsOpen(true);
  };

  return (
    <div className={styles.select}>
      <ClosedSelect label="hello?" onClick={openPanel} />
      {isOpen && <SelectOptionsPanel optionGroups={props.optionGroups} />}
    </div>
  );
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
