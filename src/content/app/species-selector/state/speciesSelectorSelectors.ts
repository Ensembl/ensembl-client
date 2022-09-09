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

import { createSelector } from '@reduxjs/toolkit';

import get from 'lodash/get';
import find from 'lodash/find';

import type { RootState } from 'src/store';
import type { CommittedItem } from 'src/content/app/species-selector/types/species-search';

export const getSpeciesRemoveStatus = (state: RootState) =>
  state.speciesSelector.ui.isRemovingSpecies;

export const getSearchText = (state: RootState) =>
  state.speciesSelector.search.text;

export const getSearchResults = (state: RootState) =>
  state.speciesSelector.search.results;

export const getSelectedItem = (state: RootState) =>
  state.speciesSelector.currentItem;

export const getSelectedItemText = (state: RootState): string | null => {
  const commonName = get(
    state,
    'speciesSelector.currentItem.common_name',
    null
  );
  const scientificName = get(
    state,
    'speciesSelector.currentItem.scientific_name',
    null
  );
  return commonName || scientificName;
};

export const getCurrentSpeciesGenomeId = (state: RootState) => {
  return get(state, 'speciesSelector.currentItem.genome_id', null);
};

export const hasCurrentSpecies = (state: RootState) => {
  return Boolean(state.speciesSelector.currentItem);
};

export const canCommitSpecies = (state: RootState) => {
  return hasCurrentSpecies(state);
};

export const getCommittedSpecies = (state: RootState): CommittedItem[] => {
  return state.speciesSelector.committedItems;
};

export const getCommittedSpeciesById = (
  state: RootState,
  genomeId: string | null
): CommittedItem | null => {
  if (!genomeId) {
    return null;
  }
  const allCommittedSpecies = getCommittedSpecies(state);
  return (
    find(allCommittedSpecies, (species) => genomeId === species.genome_id) ||
    null
  );
};

export const getEnabledCommittedSpecies = createSelector(
  (state: RootState) => getCommittedSpecies(state),
  (committedSpecies) => committedSpecies.filter(({ isEnabled }) => isEnabled)
);

export const getPopularSpecies = (state: RootState) => {
  return state.speciesSelector.popularSpecies;
};
