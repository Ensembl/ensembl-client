import React, { FunctionComponent, useState } from 'react';
import classNames from 'classnames';

import CloseButton from 'src/shared/close-button/CloseButton';

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
  const removeSpecies = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    props.onRemove();
  };

  return (
    <div className={styles.selectedSpeciesOverlay}>
      <span className={styles.overlayText} onClick={handleClick}>
        {text}
      </span>
      <div className={styles.closeButton} onClick={removeSpecies}>
        <CloseButton inverted onClick={removeSpecies} />
      </div>
    </div>
  );
};

export default SelectedSpecies;
