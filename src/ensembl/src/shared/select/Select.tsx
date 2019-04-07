import React, { useState, useEffect } from 'react';

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

export type OptionIndex = [
  number, // index of option group
  number // index of the option within a group
];

type ClosedSelectProps = {
  label: React.ReactNode;
  onClick: () => void;
};

type Props = {
  optionGroups: OptionGroup[];
  onSelect: (value: any) => void;
};

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

const Select = (props: Props) => {
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

export default Select;
