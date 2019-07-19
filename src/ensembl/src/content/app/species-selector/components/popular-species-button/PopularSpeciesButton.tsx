import React, { useState } from 'react';
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

import Tooltip from 'src/shared/tooltip/Tooltip';
import InlineSVG from 'src/shared/inline-svg/InlineSvg';

import {
  CommittedItem,
  PopularSpecies
} from 'src/content/app/species-selector/types/species-search';

import analyticsTracking from 'src/services/analytics-service';

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

// named export is for testing purposes
// use default export for development
export const PopularSpeciesButton = (props: Props) => {
  const { isSelected, isCommitted, species } = props;
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    const { genome_id, is_available } = species;
    const speciesName = species.common_name || species.scientific_name;

    if (!is_available) {
      return;
    } else if (isSelected) {
      props.clearSelectedSpecies();
      analyticsTracking.trackEvent({
        category: 'popular_species',
        action: 'unpreselect',
        label: speciesName
      });
    } else if (isCommitted) {
      props.deleteCommittedSpecies(genome_id);
    } else {
      // the species is available, not selected and not committed;
      // go ahead and select it
      props.handleSelectedSpecies(props.species);

      analyticsTracking.trackEvent({
        category: 'popular_species',
        action: 'preselect',
        label: speciesName
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const className = classNames(styles.popularSpeciesButton, {
    [styles.popularSpeciesButtonDisabled]: !species.is_available,
    [styles.popularSpeciesButtonSelected]: isSelected,
    [styles.popularSpeciesButtonCommitted]: isCommitted
  });

  const speciesDisplayName = species.common_name || species.scientific_name;

  return (
    <div className={styles.popularSpeciesButtonWrapper}>
      <div
        className={className}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <InlineSVG src={species.image} />
      </div>
      {isHovering && species.is_available && (
        <Tooltip autoAdjust={true}>{speciesDisplayName}</Tooltip>
      )}
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
