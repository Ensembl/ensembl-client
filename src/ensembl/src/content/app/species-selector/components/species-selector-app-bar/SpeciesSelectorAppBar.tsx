import React from 'react';
import { connect } from 'react-redux';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './SpeciesSelectorAppBar.scss';

type Props = {
  selectedSpecies: CommittedItem[];
  toggleSpeciesUse: (species: CommittedItem) => void;
  onSpeciesDelete: (species: CommittedItem) => void;
};

export const PlaceholderMessage = () => (
  <div className={styles.placeholderMessage}>
    Search for a species, select from popular species or browse species by data
    to manage your favourites
  </div>
);

export const SpeciesSelectorAppBar = (props: Props) => {
  return (
    <div>
      Species Selector
      {props.selectedSpecies.length ? 'foo' : <PlaceholderMessage />}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedSpecies: getCommittedSpecies(state)
});

export default SpeciesSelectorAppBar;
