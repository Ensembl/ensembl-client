import { RootState } from 'src/store';
import get from 'lodash/get';

export const getSearchResults = (state: RootState) =>
  state.speciesSelector.search.results;

export const getSelectedItemText = (state: RootState): string | null =>
  get(state, 'speciesSelector.currentItem.searchMatch.description', null);
