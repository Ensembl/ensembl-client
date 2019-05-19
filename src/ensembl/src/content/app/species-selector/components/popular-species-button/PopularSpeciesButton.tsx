import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import find from 'lodash/find';

import { handleSelectedSpecies } from 'src/content/app/species-selector/state/speciesSelectorActions';
import {
  getCurrentSpeciesGenomeId,
  getCommittedSpecies
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import InlineSVG from 'src/shared/inline-svg/InlineSvg';

import {
  CommittedItem,
  PopularSpecies
} from 'src/content/app/species-selector/types/species-search';

// import StrainSelector, {
//   Strain
// } from 'src/content/app/species-selector/components/strain-selector/StrainSelector';

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
  // strains: Strain[];
  // onStrainSelect: () => void;
};

// named export is for testing purposes
// use default export for development
export const PopularSpeciesButton = (props: Props) => {
  const { isSelected, isCommitted, species } = props;

  const handleClick = () => {
    const { isAvailable } = species;
    if (isAvailable && !isSelected && !isCommitted) {
      props.handleSelectedSpecies(props.species);
    }
  };

  const speciesName = species.common_name || species.scientific_name;

  const className = classNames(styles.popularSpeciesButton, {
    [styles.popularSpeciesButtonDisabled]: !species.isAvailable,
    [styles.popularSpeciesButtonActive]: isSelected || isCommitted
  });

  // {isSelected && Boolean(strains.length) && (
  //   <StrainSelector strains={strains} onSelect={onStrainSelect} />
  // )}

  return (
    <div className={className} onClick={handleClick}>
      <InlineSVG src={species.image} />
    </div>
  );
};

// PopularSpeciesButton.defaultProps = {
//   strains: []
// };

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
  handleSelectedSpecies
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopularSpeciesButton);
