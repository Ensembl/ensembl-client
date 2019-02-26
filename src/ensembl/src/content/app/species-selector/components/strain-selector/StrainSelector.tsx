import React, { useState, useRef } from 'react';
import classNames from 'classnames';

import Dropdown from 'src/shared/dropdown/Dropdown';

import styles from './StrainSelector.scss';

type Strain = {
  name: string;
  isSelected: boolean;
};

type OnSelect = (strainName: string) => void;

type StrainSelectorProps = {
  strains: Strain[];
  onSelect: OnSelect;
};

type StrainProps = Strain & {
  onSelect: OnSelect;
};

const StrainSelector = (props: StrainSelectorProps) => {
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const elementRef: React.RefObject<HTMLDivElement> = useRef(null);

  const numberOfSelectedStrains = props.strains.reduce(
    (sum, { isSelected }) => {
      return isSelected ? sum + 1 : sum;
    },
    0
  );
  const totalNumberOfStrains = props.strains.length;

  const toggleDropdownVisibility = () => {
    setDropdownVisibility(!isDropdownVisible);
  };
  const hideDropdown = () => setDropdownVisibility(false);

  return (
    <div
      className={styles.strainSelector}
      onClick={toggleDropdownVisibility}
      ref={elementRef}
    >
      {numberOfSelectedStrains} / {totalNumberOfStrains}
      {isDropdownVisible && (
        <Dropdown onClose={hideDropdown} verticalOffset={-5}>
          <StrainsList {...props} />
        </Dropdown>
      )}
    </div>
  );
};

const StrainsList = (props: StrainSelectorProps) => {
  const strains = props.strains.map((strain) => (
    <Strain key={strain.name} {...strain} onSelect={props.onSelect} />
  ));

  return <div className={styles.strainsList}>{strains}</div>;
};

const Strain = (props: StrainProps) => {
  const className = classNames(styles.strain, {
    [styles.strainSelected]: props.isSelected
  });
  const onClick = () => {
    if (!props.isSelected) {
      props.onSelect(props.name);
    }
  };

  return (
    <div className={className} onClick={onClick}>
      {props.name}
    </div>
  );
};

export default StrainSelector;
