import { createAsyncAction } from 'typesafe-actions';

import { SearchMatch } from 'src/content/app/species-selector/types/species-search';

export const fetchSpeciesSearchResults = createAsyncAction(
  'species_selector/species_search_request',
  'species_selector/species_search_success',
  'species_selector/species_search_failure'
)<string, { text: string; results: SearchMatch[] }, Error>();
