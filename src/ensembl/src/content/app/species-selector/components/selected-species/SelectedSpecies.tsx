import React, { FunctionComponent, useState } from 'react';
import classNames from 'classnames';

import styles from './SelectedSpecies.scss';

type Props = {
  name: string;
  assembly: string;
  isEnabled: boolean;
  onEnable: Function;
  onDisable: Function;
  onRemove: Function;
};

const SelectedSpecies: FunctionComponent<Props> = (props) => {
  const [hovered, setHovered] = useState(false);

  const className = classNames(styles.selectedSpecies, {
    [styles.selectedSpeciesDisabled]: !props.isEnabled
  });

  return (
    <div
      className={className}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={styles.name}>{props.name}</span>
      <span className={styles.assembly}>{props.assembly}</span>
      {hovered && <SelectedSpeciesOverlay {...props} />}
    </div>
  );
};

const SelectedSpeciesOverlay: FunctionComponent<Props> = (props) => {
  const text = props.isEnabled ? 'Do not use' : 'Use';

  const handleClick = () => {
    if (props.isEnabled) {
      props.onDisable();
    } else {
      props.onEnable();
    }
  };
  const removeSpecies = () => props.onRemove();

  return (
    <div className={styles.selectedSpeciesOverlay} onClick={handleClick}>
      <span className={styles.overlayText}>{text}</span>
    </div>
  );
};

export default SelectedSpecies;
