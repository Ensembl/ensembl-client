import React from 'react';

import SelectedSpeciesDisplayName from './SelectedSpeciesDisplayName';

import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './SimpleSelectedSpecies.scss';

type Props = {
  species: CommittedItem;
};

const SimpleSelectedSpecies = (props: Props) => {
  return (
    <div className={styles.simpleSelectedSpecies}>
      <SelectedSpeciesDisplayName species={props.species} />
    </div>
  );
};

export default SimpleSelectedSpecies;
