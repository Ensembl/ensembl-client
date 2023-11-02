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

import React from 'react';

import { useAppDispatch } from 'src/store';

import { setModalView } from 'src/content/app/species-selector/state/species-selector-ui-slice/speciesSelectorUISlice';
import { setPopularSpecies } from 'src/content/app/species-selector/state/species-selector-search-slice/speciesSelectorSearchSlice';
import { useGetPopularSpeciesQuery } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import PopularSpeciesButton from 'src/content/app/species-selector/components/popular-species-button/PopularSpeciesButton';

import type { PopularSpecies } from 'src/content/app/species-selector/types/popularSpecies';

import styles from './PopularSpeciesList.scss';

const PopularSpeciesList = () => {
  const dispatch = useAppDispatch();
  const { currentData } = useGetPopularSpeciesQuery();

  const onPopularSpeciesButtonClick = (species: PopularSpecies) => {
    dispatch(setPopularSpecies(species));
    dispatch(setModalView('popular-species-genomes'));
  };

  // TODO: after we include species taxonomy id in the committed species payload,
  // we will use real data for the isSelected property
  return (
    <>
      <h1 className={styles.sectionHeading}>Popular</h1>
      <div className={styles.container}>
        {currentData?.popular_species.map((species) => (
          <PopularSpeciesButton
            key={species.species_taxonomy_id}
            species={species}
            isSelected={false}
            onClick={() => onPopularSpeciesButtonClick(species)}
          />
        ))}
      </div>
    </>
  );
};

export default PopularSpeciesList;
