import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { handleSelectedSpecies } from 'src/content/app/species-selector/state/speciesSelectorActions';
import { getCurrentSpeciesGenomeId } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { PopularSpecies } from 'src/content/app/species-selector/types/species-search';

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
  handleSelectedSpecies: (species: PopularSpecies) => void;
  // strains: Strain[];
  // onStrainSelect: () => void;
};

// named export is for testing purposes
// use default export for development
export const PopularSpeciesButton = (props: Props) => {
  const { isSelected, species } = props;

  const handleClick = () => {
    const {
      isSelected,
      species: { isAvailable }
    } = props;
    if (isAvailable && !isSelected) {
      props.handleSelectedSpecies(props.species);
    }
  };

  const speciesName = species.common_name || species.scientific_name;

  const className = classNames(styles.popularSpeciesButton, {
    [styles.popularSpeciesButtonDisabled]: !species.isAvailable,
    [styles.popularSpeciesButtonActive]: isSelected
  });

  // {isSelected && Boolean(strains.length) && (
  //   <StrainSelector strains={strains} onSelect={onStrainSelect} />
  // )}

  return (
    <div className={className} onClick={handleClick}>
      <img src={species.image} alt={speciesName} />
    </div>
  );
};

// PopularSpeciesButton.defaultProps = {
//   strains: []
// };

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  isSelected: getCurrentSpeciesGenomeId(state) === ownProps.species.genome_id
});

const mapDispatchToProps = {
  handleSelectedSpecies
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopularSpeciesButton);
