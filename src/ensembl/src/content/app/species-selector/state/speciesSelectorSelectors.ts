import get from 'lodash/get';
import find from 'lodash/find';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

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

export const getCurrentSpeciesStrains = (state: RootState) => {
  return get(state, 'speciesSelector.currentItem.strains', []);
};

export const getCurrentSpeciesAssemblies = (state: RootState) => {
  return get(state, 'speciesSelector.currentItem.assemblies', []);
};

export const isSelectingStrain = (state: RootState) => {
  return state.speciesSelector.ui.isSelectingStrain;
};

export const isSelectingAssembly = (state: RootState) => {
  return state.speciesSelector.ui.isSelectingAssembly;
};

export const hasCurrentSpecies = (state: RootState) => {
  return Boolean(state.speciesSelector.currentItem);
};

export const canCommitSpecies = (state: RootState) => {
  return (
    hasCurrentSpecies(state) &&
    !isSelectingStrain(state) &&
    !isSelectingAssembly(state)
  );
};

export const getCommittedSpecies = (state: RootState): CommittedItem[] => {
  return state.speciesSelector.committedItems;
};

export const getCommittedSpeciesById = (
  state: RootState,
  genomeId: string
): CommittedItem | null => {
  const allCommittedSpecies = getCommittedSpecies(state);
  return (
    find(allCommittedSpecies, (species) => genomeId === species.genome_id) ||
    null
  );
};

export const getEnabledCommittedSpecies = (state: RootState) => {
  return getCommittedSpecies(state).filter(({ isEnabled }) => isEnabled);
};

export const getPopularSpecies = (state: RootState) => {
  return state.speciesSelector.popularSpecies;
};
