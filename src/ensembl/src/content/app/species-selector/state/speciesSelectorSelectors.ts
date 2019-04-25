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
