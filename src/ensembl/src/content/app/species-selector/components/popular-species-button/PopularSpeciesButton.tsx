import React from 'react';
import classNames from 'classnames';

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
  // strains: Strain[];
  onClick: () => void;
  // onStrainSelect: () => void;
};

const PopularSpeciesButton = (props: Props) => {
  const { isSelected, species, onClick } = props;

  const speciesName = species.common_name || species.scientific_name;

  const className = classNames(styles.popularSpeciesButton, {
    [styles.popularSpeciesButtonDisabled]: !species.isAvailable,
    [styles.popularSpeciesButtonActive]: isSelected
  });

  // {isSelected && Boolean(strains.length) && (
  //   <StrainSelector strains={strains} onSelect={onStrainSelect} />
  // )}

  return (
    <div className={className} onClick={onClick}>
      <img src={species.image} alt={speciesName} />
    </div>
  );
};

PopularSpeciesButton.defaultProps = {
  strains: []
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  isSelected: getCurrentSpeciesGenomeId(state) === ownProps.species.genome_id
});

const mapDispatchToProps = {};

export default PopularSpeciesButton;
