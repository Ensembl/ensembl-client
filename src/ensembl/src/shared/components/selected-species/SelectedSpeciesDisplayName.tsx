import React from 'react';
import classNames from 'classnames';

import { getDisplayName } from './selectedSpeciesHelpers';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './selected-species-common.scss';

type Props = {
  species: CommittedItem;
  nameClassName?: string;
  assemblyClassName?: string;
};

const SelectedSpeciesDisplayName = (props: Props) => {
  const displayName = getDisplayName(props.species);

  const nameClasses = classNames(styles.name, props.nameClassName);

  const assemblyClasses = classNames(styles.assembly, props.assemblyClassName);

  return (
    <>
      <span className={nameClasses}>{displayName}</span>
      <span className={assemblyClasses}>{props.species.assembly_name}</span>
    </>
  );
};

export default SelectedSpeciesDisplayName;
