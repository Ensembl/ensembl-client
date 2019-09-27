import React, { useState } from 'react';
import classNames from 'classnames';

import SelectedSpeciesDisplayName from './SelectedSpeciesDisplayName';

import styles from './FocusableSelectedSpecies.scss';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

type Props = {
  species: CommittedItem;
  isActive: boolean;
  onClick: (genomeId: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
};

const SpeciesTab = (props: Props) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    props.onMouseEnter();
  };

  const handleMouseLeave = () => {
    props.onMouseLeave();
  };

  const handleClick = () => {
    if (!props.isActive) {
      props.onClick(props.species.genome_id);
    }
  };

  // const isFullSize = props.isActive || isHovering;

  const className = classNames(styles.species, props.className, {
    [styles.speciesActive]: props.isActive
    // [styles.speciesTabFullSize]: isFullSize
  });
  const nameClass = props.isActive ? styles.nameActive : styles.name;
  const assemblyClass = props.isActive
    ? styles.assemblyActive
    : styles.assembly;

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <SelectedSpeciesDisplayName
        species={props.species}
        nameClassName={nameClass}
        assemblyClassName={assemblyClass}
      />
    </div>
  );
};

export default SpeciesTab;
