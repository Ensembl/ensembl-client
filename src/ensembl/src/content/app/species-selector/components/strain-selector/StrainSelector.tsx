import React, { useState, useRef } from 'react';
import classNames from 'classnames';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import styles from './StrainSelector.scss';

export type Strain = {
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
  const [isTooltipVisible, setTooltipVisibility] = useState(false);
  const elementRef: React.RefObject<HTMLDivElement> = useRef(null);

  const numberOfSelectedStrains = props.strains.reduce(
    (sum, { isSelected }) => {
      return isSelected ? sum + 1 : sum;
    },
    0
  );
  const totalNumberOfStrains = props.strains.length;

  const toggleTooltipVisibility = () => {
    setTooltipVisibility(!isTooltipVisible);
  };
  const hideTooltip = () => setTooltipVisibility(false);

  return (
    <div
      className={styles.strainSelector}
      onClick={toggleTooltipVisibility}
      ref={elementRef}
    >
      {numberOfSelectedStrains} / {totalNumberOfStrains}
      {isTooltipVisible && (
        <Tooltip onClose={hideTooltip}>
          <StrainsList {...props} />
        </Tooltip>
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
