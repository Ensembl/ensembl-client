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

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'src/store';
import useSpeciesSelectorAnalytics from 'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { setPopularSpecies } from 'src/content/app/species-selector/state/species-selector-search-slice/speciesSelectorSearchSlice';
import { useGetPopularSpeciesQuery } from 'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice';

import PopularSpeciesButton from 'src/content/app/species-selector/components/popular-species-button/PopularSpeciesButton';

import type { PopularSpecies } from 'src/content/app/species-selector/types/popularSpecies';

import styles from './PopularSpeciesList.module.css';

const PopularSpeciesList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const committedItems = useAppSelector(getCommittedSpecies);
  const { currentData } = useGetPopularSpeciesQuery();
  const { trackPopularSpeciesClick } = useSpeciesSelectorAnalytics();

  const committedItemsSet = useMemo(() => {
    return new Set(committedItems.map((item) => item.species_taxonomy_id));
  }, [committedItems]);

  const onPopularSpeciesButtonClick = (species: PopularSpecies) => {
    dispatch(setPopularSpecies(species));
    trackPopularSpeciesClick(species);
    navigate(
      `/species-selector/search?species_taxonomy_id=${species.species_taxonomy_id}`
    );
  };

  return (
    <>
      <h1 className={styles.sectionHeading}>Popular</h1>
      <div className={styles.container}>
        {currentData?.popular_species.map((species) => (
          <PopularSpeciesButton
            key={species.species_taxonomy_id}
            species={species}
            isSelected={committedItemsSet.has(`${species.species_taxonomy_id}`)}
            onClick={() => onPopularSpeciesButtonClick(species)}
          />
        ))}
      </div>
    </>
  );
};

export default PopularSpeciesList;
