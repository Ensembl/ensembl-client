import React, { useState, useEffect } from 'react';

import { Option, OptionGroup, GroupedOptionIndex } from './Select';

import styles from './Select.scss';

type Props = {
  optionGroups: OptionGroup[];
  selectedOption: Option | null;
  onSelect: (index: GroupedOptionIndex) => void;
};

const SelectOption = (props: Option) => {
  return <li>{props.label}</li>;
};

const SelectOptionGroup = (props: OptionGroup) => {
  return (
    <ul>
      {props.title && <div>{props.title}</div>}
      {props.options.map((option, index) => (
        <SelectOption {...option} key={index} />
      ))}
    </ul>
  );
};

const SelectOptionsPanel = (props: Props) => {
  return (
    <div className={styles.optionsPanel}>
      {props.optionGroups.map((optionGroup, index) => (
        <SelectOptionGroup {...optionGroup} key={index} />
      ))}
    </div>
  );
};

export default SelectOptionsPanel;
