import { RootState } from 'src/store';

export const getSearchResults = (state: RootState) =>
  state.speciesSelector.search.results;
