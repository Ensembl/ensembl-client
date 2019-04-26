import { RootState } from 'src/store';
import get from 'lodash/get';

export const getSearchResults = (state: RootState) =>
  state.speciesSelector.search.results;

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
