import { createStandardAction, createAsyncAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

// import apiService from 'src/services/api-service';

import speciesSelectorStorageService from 'src/content/app/species-selector/services/species-selector-storage-service';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import {
  SearchMatch,
  SearchMatches,
  Strain,
  Assembly,
  PopularSpecies
} from 'src/content/app/species-selector/types/species-search';

// MOCK DATA; delete when we get working backend endpoints
import mouseStrainsResult from 'tests/data/species-selector/mouse-strains';
import mouseAssemblies from 'tests/data/species-selector/mouse-assemblies';
import popularSpecies from 'tests/data/species-selector/popular-species';

export const fetchSpeciesSearchResults = createAsyncAction(
  'species_selector/species_search_request',
  'species_selector/species_search_success',
  'species_selector/species_search_failure'
)<string, { results: SearchMatches[] }, Error>();

export const fetchStrainsAsyncActions = createAsyncAction(
  'species_selector/strains_request',
  'species_selector/strains_success',
  'species_selector/strains_failure'
)<undefined, { strains: Strain[] }, Error>();

export const fetchPopularSpeciesAsyncActions = createAsyncAction(
  'species_selector/popular_species_request',
  'species_selector/popular_species_success',
  'species_selector/popular_species_failure'
)<undefined, { popularSpecies: PopularSpecies[] }, Error>();

export const fetchAssembliesAsyncActions = createAsyncAction(
  'species_selector/assemblies_request',
  'species_selector/assemblies_success',
  'species_selector/assemblies_failure'
)<undefined, { assemblies: Assembly[] }, Error>();

export const setSelectedSpecies = createStandardAction(
  'species_selector/species_selected'
)<SearchMatch | PopularSpecies>();

export const clearSelectedSearchResult = createStandardAction(
  'species_selector/clear_search_result'
)();

export const fetchStrains: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch) => {
  try {
    dispatch(fetchStrainsAsyncActions.request());

    // FIXME: using mock data here
    dispatch(
      fetchStrainsAsyncActions.success({ strains: mouseStrainsResult.strains })
    );
  } catch (error) {
    dispatch(fetchStrainsAsyncActions.failure(error));
  }
};

export const fetchAssemblies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch) => {
  try {
    dispatch(fetchAssembliesAsyncActions.request());

    // FIXME: using mock data here
    dispatch(
      fetchAssembliesAsyncActions.success({
        assemblies: mouseAssemblies.alternative_assemblies
      })
    );
  } catch (error) {
    dispatch(fetchAssembliesAsyncActions.failure(error));
  }
};

export const fetchPopularSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => async (dispatch) => {
  try {
    dispatch(fetchPopularSpeciesAsyncActions.request());

    // FIXME: using mock data here
    dispatch(
      fetchPopularSpeciesAsyncActions.success({
        popularSpecies: popularSpecies
      })
    );
  } catch (error) {
    dispatch(fetchPopularSpeciesAsyncActions.failure(error));
  }
};

export const handleSelectedSpecies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (item: SearchMatch | PopularSpecies) => (dispatch) => {
  dispatch(setSelectedSpecies(item));
  const { genome_id, common_name } = item;

  // FIXME: remove test for mock
  if (!common_name || !common_name.startsWith('Mou')) {
    return;
  } else {
    dispatch(fetchStrains(genome_id));
    dispatch(fetchAssemblies(genome_id));
  }
};

export const commitSelectedSpecies = createStandardAction(
  'species_selector/commit_selected_species'
)();

export const commitSelectedSpeciesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState) => {
  dispatch(commitSelectedSpecies());
  const committedSpecies = getCommittedSpecies(getState());
  speciesSelectorStorageService.saveSelectedSpecies(committedSpecies);
};

export const toggleSpeciesUse = createStandardAction(
  'species_selector/toggle_species_use'
)<string>();

export const deleteSpecies = createStandardAction(
  'species_selector/delete_species'
)<string>();

export const deleteSpeciesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => (dispatch, getState) => {
  dispatch(deleteSpecies(genomeId));
  const committedSpecies = getCommittedSpecies(getState());
  speciesSelectorStorageService.saveSelectedSpecies(committedSpecies);
};

export const changeAssembly = createStandardAction(
  'species_selector/change_assembly'
)<Assembly>();
