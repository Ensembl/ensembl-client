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
import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getDisplayName } from 'src/shared/components/selected-species/selectedSpeciesHelpers';
import SearchIcon from 'static/icons/icon_search.svg';

import { isSpeciesSidebarOpen as getSidebarStatus } from 'src/content/app/species/state/sidebar/speciesSidebarSelectors';
import { getCommittedSpeciesById } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { getPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { fetchPopularSpecies } from 'src/content/app/species-selector/state/speciesSelectorSlice';

import SpeciesUsageToggle from './species-usage-toggle/SpeciesUsageToggle';
import SpeciesRemove from './species-remove/SpeciesRemove';

import { RootState } from 'src/store';

import styles from './SpeciesTitleArea.scss';
import {
  openSpeciesSidebarModal,
  SpeciesSidebarModalView
} from '../../state/sidebar/speciesSidebarSlice';

const useSpecies = () => {
  const activeGenomeId = useAppSelector(getActiveGenomeId) || '';
  const popularSpecies = useAppSelector(getPopularSpecies);
  const committedSpecies = useAppSelector((state: RootState) =>
    getCommittedSpeciesById(state, activeGenomeId)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!popularSpecies.length) {
      dispatch(fetchPopularSpecies());
    }
  }, []);

  const iconUrl = popularSpecies.find(
    (species) => species.genome_id === activeGenomeId
  )?.image;

  return committedSpecies && iconUrl
    ? {
        species: committedSpecies,
        iconUrl
      }
    : null;
};

const SpeciesTitleArea = () => {
  const isSidebarOpen = useAppSelector(getSidebarStatus);
  const dispatch = useAppDispatch();
  const { species, iconUrl } = useSpecies() || {};

  const blockClasses = classNames(styles.speciesTitleArea, {
    [styles.speciesTitleAreaNarrow]: isSidebarOpen
  });

  const openSearch = () => {
    dispatch(openSpeciesSidebarModal(SpeciesSidebarModalView.SEARCH));
  };

  return species && iconUrl ? (
    <div className={blockClasses}>
      <div className={styles.speciesIcon}>
        <img src={iconUrl} />
      </div>
      <div className={styles.speciesNameWrapper}>
        <h1 className={styles.speciesName}>{getDisplayName(species)}</h1>
        <span className={styles.assemblyName}>{species.assembly_name}</span>
      </div>
      <div className={styles.speciesToggle}>
        <SpeciesUsageToggle />
      </div>
      <div className={styles.findAGene} onClick={openSearch}>
        <span>Find a gene</span>
        <SearchIcon />
      </div>
      <div className={styles.speciesRemove}>
        <SpeciesRemove />
      </div>
    </div>
  ) : (
    <div className={blockClasses} />
  );
};

export default SpeciesTitleArea;
