import React from 'react';
import classNames from 'classnames';

import { getDisplayName } from './selectedSpeciesHelpers';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './selected-species-common.scss';

type Props = {
  species: CommittedItem;
  classNames?: {
    name?: string;
    assembly?: string;
  };
};

const SelectedSpeciesDisplayName = (props: Props) => {
  const displayName = getDisplayName(props.species);

  const nameClasses = classNames(
    styles.name,
    props.classNames && props.classNames.name
  );

  const assemblyClasses = classNames(
    styles.assembly,
    props.classNames && props.classNames.assembly
  );

  return (
    <>
      <span className={nameClasses}>{displayName}</span>
      <span className={assemblyClasses}>{props.species.assembly_name}</span>
    </>
  );
};

export default SelectedSpeciesDisplayName;
