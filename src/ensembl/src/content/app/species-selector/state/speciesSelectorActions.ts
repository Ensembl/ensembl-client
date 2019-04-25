import { createStandardAction, createAsyncAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

// import apiService from 'src/services/api-service';

import {
  SearchMatch,
  SearchMatches,
  Strain
} from 'src/content/app/species-selector/types/species-search';

import mouseStrainsResult from 'tests/data/species-selector/mouse-strains';

export const fetchSpeciesSearchResults = createAsyncAction(
  'species_selector/species_search_request',
  'species_selector/species_search_success',
  'species_selector/species_search_failure'
)<string, { text: string; results: SearchMatches[] }, Error>();

export const fetchStrainsAsyncActions = createAsyncAction(
  'species_selector/strains_request',
  'species_selector/strains_success',
  'species_selector/strains_failure'
)<undefined, { strains: Strain[] }, Error>();

export const setSelectedSearchResult = createStandardAction(
  'species_selector/species_selected'
)<SearchMatch>();

export const clearSelectedSearchResult = createStandardAction(
  'species_selector/clear_search_result'
)();

export const fetchStrains = (genomeId: string) => async (dispatch: any) => {
  try {
    dispatch(fetchStrainsAsyncActions.request());

    // FIXME: using mock data here
    dispatch(
      fetchStrainsAsyncActions.success({ strains: mouseStrainsResult.strains })
    );
  } catch (error) {
    // TODO
    dispatch(fetchStrainsAsyncActions.failure(new Error()));
  }
};

export const handleSelectedSearchResult = (match: SearchMatch) => (
  dispatch: any
) => {
  setSelectedSearchResult(match);
  const { genome_id, common_name } = match;

  // FIXME: remove test for mock
  if (!common_name || !common_name.startsWith('mou')) {
    return;
  } else {
    dispatch(fetchStrains(genome_id));
  }
};

/*

export const fetchExampleEnsObjectsData = () => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchExampleEnsObjects.request(null));

    const url = '/browser/example_objects';
    const response = await apiService.fetch(url);
    dispatch(fetchExampleEnsObjects.success(response));
  } catch (error) {
    dispatch(fetchExampleEnsObjects.failure(error));
  }
};

*/
