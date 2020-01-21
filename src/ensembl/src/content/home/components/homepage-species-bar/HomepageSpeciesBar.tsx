import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import AppBar from 'src/shared/components/app-bar/AppBar';
import SpeciesTabsWrapper from 'src/shared/components/species-tabs-wrapper/SpeciesTabsWrapper';
import { SimpleSelectedSpecies } from 'src/shared/components/selected-species';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

import styles from './HomepageSpeciesBar.scss';

type Props = {
  species: CommittedItem[];
};

const HomepageSpeciesBar = (props: Props) => {
  let barContent;
  if (!props.species.length) {
    barContent = (
      <div className={styles.emptySpeciesBar}>
        <span className={styles.speciesSelectorBannerText}>
          7 species now available
        </span>
        <Link
          className={styles.speciesSelectorBannerLink}
          to={urlFor.speciesSelector()}
        >
          Select a species to begin
        </Link>
      </div>
    );
  } else {
    const speciesItems = props.species.map((species, index) => (
      <SimpleSelectedSpecies key={index} species={species} />
    ));
    barContent = <SpeciesTabsWrapper speciesTabs={speciesItems} />;
  }

  return <AppBar mainContent={barContent} />;
};

const mapStateToProps = (state: RootState) => ({
  species: getEnabledCommittedSpecies(state)
});

export default connect(mapStateToProps)(HomepageSpeciesBar);
