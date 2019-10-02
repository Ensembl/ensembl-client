import React from 'react';
import classNames from 'classnames';

import SelectedSpeciesDisplayName from './SelectedSpeciesDisplayName';

import styles from './FocusableSelectedSpecies.scss';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

export type Props = {
  species: CommittedItem;
  isActive: boolean;
  onClick: (genomeId: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
};

const SpeciesTab = (props: Props) => {
  const handleMouseEnter = () => {
    props.onMouseEnter && props.onMouseEnter();
  };

  const handleMouseLeave = () => {
    props.onMouseLeave && props.onMouseLeave();
  };

  const handleClick = () => {
    if (!props.isActive) {
      props.onClick(props.species.genome_id);
    }
  };

  const className = classNames(styles.species, props.className, {
    [styles.speciesActive]: props.isActive
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
