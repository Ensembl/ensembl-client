import React, { FunctionComponent, useState } from 'react';
import classNames from 'classnames';

import CloseButton from 'src/shared/close-button/CloseButton';

import styles from './SelectedSpecies.scss';

type Props = {
  name: string;
  assembly: string;
  isEnabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onRemove: () => void;
};

const SelectedSpecies: FunctionComponent<Props> = (props) => {
  const [hovered, setHovered] = useState(false);
  const setHoveredState = () => setHovered(true);
  const setUnhoveredState = () => setHovered(false);

  const className = classNames(styles.selectedSpecies, {
    [styles.selectedSpeciesDisabled]: !props.isEnabled
  });

  return (
    <div
      className={className}
      onMouseOver={setHoveredState}
      onMouseLeave={setUnhoveredState}
    >
      <span className={styles.name}>{props.name}</span>
      <span className={styles.assembly}>{props.assembly}</span>
      {!hovered && <SelectedSpeciesOverlay {...props} />}
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
  const removeSpecies = (e: React.MouseEvent) => {
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
        <CloseButton inverted={true} onClick={removeSpecies} />
      </div>
    </div>
  );
};

export default SelectedSpecies;
