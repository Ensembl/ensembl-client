/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
