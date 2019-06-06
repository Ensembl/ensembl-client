import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorActions';

import { getPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import PopularSpeciesButton from 'src/content/app/species-selector/components/popular-species-button/PopularSpeciesButton';

import styles from './PopularSpeciesPanel.scss';

import { RootState } from 'src/store';
import { PopularSpecies } from 'src/content/app/species-selector/types/species-search';

type Props = {
  fetchPopularSpecies: () => void;
  popularSpecies: PopularSpecies[];
};

const PopularSpeciesPanel = (props: Props) => {
  useEffect(() => {
    props.fetchPopularSpecies();
  }, []);

  const renderedPopularSpecies = props.popularSpecies.map((species) => (
    <PopularSpeciesButton key={species.genome_id} species={species} />
  ));
  return (
    <section className={styles.layout}>
      <div className={styles.popularSpeciesList}>{renderedPopularSpecies}</div>
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  popularSpecies: getPopularSpecies(state)
});

const mapDispatchToProps = {
  fetchPopularSpecies
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopularSpeciesPanel);
