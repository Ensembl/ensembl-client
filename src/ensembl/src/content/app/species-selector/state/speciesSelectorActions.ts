import { action, createAction, createAsyncAction } from 'typesafe-actions';

import {
  SearchMatch,
  SearchMatches
} from 'src/content/app/species-selector/types/species-search';

export const fetchSpeciesSearchResults = createAsyncAction(
  'species_selector/species_search_request',
  'species_selector/species_search_success',
  'species_selector/species_search_failure'
)<string, { text: string; results: SearchMatches[] }, Error>();

export const setSelectedSearchResult = createAction(
  'species_selector/species_selected',
  (action) => (result: SearchMatch) => action(result)
);

export const clearSelectedSearchResult = createAction(
  'species_selector/clear_search_result'
);
