import { createStandardAction, createAsyncAction } from 'typesafe-actions';

// import apiService from 'src/services/api-service';

import {
  SearchMatch,
  SearchMatches,
  Strain,
  Assembly
} from 'src/content/app/species-selector/types/species-search';

import mouseStrainsResult from 'tests/data/species-selector/mouse-strains';
import mouseAssemblies from 'tests/data/species-selector/mouse-assemblies';

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

export const fetchAssembliesAsyncActions = createAsyncAction(
  'species_selector/assemblies_request',
  'species_selector/assemblies_success',
  'species_selector/assemblies_failure'
)<undefined, { assemblies: Assembly[] }, Error>();

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
    dispatch(fetchStrainsAsyncActions.failure(error));
  }
};

export const fetchAssemblies = (genomeId: string) => async (dispatch: any) => {
  try {
    dispatch(fetchAssembliesAsyncActions.request());

    // FIXME: using mock data here
    dispatch(
      fetchAssembliesAsyncActions.success({
        assemblies: mouseAssemblies.alternative_assemblies
      })
    );
  } catch (error) {
    // TODO
    dispatch(fetchAssembliesAsyncActions.failure(error));
  }
};

export const handleSelectedSearchResult = (match: SearchMatch) => (
  dispatch: any
) => {
  dispatch(setSelectedSearchResult(match));
  const { genome_id, common_name } = match;

  // FIXME: remove test for mock
  if (!common_name || !common_name.startsWith('Mou')) {
    return;
  } else {
    dispatch(fetchStrains(genome_id));
    dispatch(fetchAssemblies(genome_id));
  }
};
