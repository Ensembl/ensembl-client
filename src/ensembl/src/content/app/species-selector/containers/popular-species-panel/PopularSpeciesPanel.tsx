import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorActions';

import { getPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

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
  console.log('popularSpecies', props.popularSpecies);
  return <span>Hello</span>;
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
