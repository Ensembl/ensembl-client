import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import find from 'lodash/find';

import {
  handleSelectedSpecies,
  clearSelectedSearchResult,
  deleteSpeciesAndSave
} from 'src/content/app/species-selector/state/speciesSelectorActions';
import {
  getCurrentSpeciesGenomeId,
  getCommittedSpecies
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import InlineSVG from 'src/shared/inline-svg/InlineSvg';

import {
  CommittedItem,
  PopularSpecies
} from 'src/content/app/species-selector/types/species-search';

import styles from './PopularSpeciesButton.scss';

import { RootState } from 'src/store';

type OwnProps = {
  species: PopularSpecies;
};

type Props = {
  species: PopularSpecies;
  isSelected: boolean;
  isCommitted: boolean;
  handleSelectedSpecies: (species: PopularSpecies) => void;
  clearSelectedSpecies: () => void;
  deleteCommittedSpecies: (genome_id: string) => void;
};

// FIXME: this should be moved to a file with general functions
const ensureHost = (url: string) => {
  return /^https?/.test(url)
    ? url
    : `${location.protocol}//${location.host}${url}`;
};

// named export is for testing purposes
// use default export for development
export const PopularSpeciesButton = (props: Props) => {
  const { isSelected, isCommitted, species } = props;

  const handleClick = () => {
    const { genome_id, isAvailable } = species;
    if (!isAvailable) {
      return;
    } else if (isSelected) {
      props.clearSelectedSpecies();
    } else if (isCommitted) {
      props.deleteCommittedSpecies(genome_id);
    } else {
      // the species is available, not selected and not committed;
      // go ahead and select it
      props.handleSelectedSpecies(props.species);
    }
  };

  const className = classNames(styles.popularSpeciesButton, {
    [styles.popularSpeciesButtonDisabled]: !species.isAvailable,
    [styles.popularSpeciesButtonSelected]: isSelected,
    [styles.popularSpeciesButtonCommitted]: isCommitted
  });

  return (
    <div className={className} onClick={handleClick}>
      <InlineSVG src={ensureHost(species.image)} />
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  isSelected: getCurrentSpeciesGenomeId(state) === ownProps.species.genome_id,
  isCommitted: Boolean(
    find(
      getCommittedSpecies(state),
      (committedItem: CommittedItem) =>
        committedItem.genome_id === ownProps.species.genome_id
    )
  )
});

const mapDispatchToProps = {
  handleSelectedSpecies,
  clearSelectedSpecies: clearSelectedSearchResult,
  deleteCommittedSpecies: deleteSpeciesAndSave
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopularSpeciesButton);
