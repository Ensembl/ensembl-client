import { createAsyncAction, createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import find from 'lodash/find';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import apiService from 'src/services/api-service';

import speciesSelectorStorageService from 'src/content/app/species-selector/services/species-selector-storage-service';
import analyticsTracking from 'src/services/analytics-service';
import buildAnalyticsObject from 'src/analyticsHelper';

import {
  getCommittedSpecies,
  getCommittedSpeciesById,
  getEnabledCommittedSpecies,
  getSelectedItem,
  getSearchText
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { getSpeciesAnalyticsName } from 'src/content/app/species-selector/speciesSelectorHelper';
import {
  SearchMatch,
  SearchMatches,
  // Strain,
  Assembly,
  PopularSpecies,
  CommittedItem
} from 'src/content/app/species-selector/types/species-search';

import { getGenomeInfoById } from 'src/genome/genomeSelectors';

import { CurrentItem } from './speciesSelectorState';

const buildCommittedItem = (data: CurrentItem): CommittedItem => ({
  genome_id: data.genome_id,
  reference_genome_id: data.reference_genome_id,
  common_name: data.common_name,
  scientific_name: data.scientific_name,
  assembly_name: get(
    find(data.assemblies, ({ genome_id }) => genome_id === data.genome_id),
    'assembly_name'
  ) as string,
  isEnabled: true
});

enum categories {
  POPULAR_SPECIES = 'popular_species',
  ADD_SPECIES = 'add_species',
  SELECTED_SPECIES = 'selected_Species',
  ASSEMBLY_SELECTOR = 'assembly_selector'
}

import { MINIMUM_SEARCH_LENGTH } from 'src/content/app/species-selector/constants/speciesSelectorConstants';

import { RootState } from 'src/store';

export const setSearchText = createAction('species_selector/set_search_text')<
  string
>();

export const updateSearch: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (text: string) => (dispatch, getState: () => RootState) => {
  const state = getState();
  const selectedItem = getSelectedItem(state);
  const previousText = getSearchText(state);
  if (selectedItem) {
    dispatch(clearSelectedSearchResult());
  }

  const trimmedText = text.trim();
  if (text.length < previousText.length) {
    // user is deleting their input; clear search results
    dispatch(clearSearchResults());
  }

  if (trimmedText.length >= MINIMUM_SEARCH_LENGTH) {
    dispatch(fetchSpeciesSearchResults.request(trimmedText));
  }

  dispatch(setSearchText(text));
};

export const fetchSpeciesSearchResults = createAsyncAction(
  'species_selector/species_search_request',
  'species_selector/species_search_success',
  'species_selector/species_search_failure'
)<string, { results: SearchMatches[] }, Error>();

// TODO: wait for strains
// export const fetchStrainsAsyncActions = createAsyncAction(
//   'species_selector/strains_request',
//   'species_selector/strains_success',
//   'species_selector/strains_failure'
// )<undefined, { strains: Strain[] }, Error>();

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

export const setSelectedSpecies = createAction(
  'species_selector/species_selected'
)<SearchMatch | PopularSpecies>();

export const clearSearchResults = createAction(
  'species_selector/clear_search_results'
)();

export const clearSearch = createAction('species_selector/clear_search')();

export const clearSelectedSearchResult = createAction(
  'species_selector/clear_selected_search_result'
)();

// TODO: wait for strains
// export const fetchStrains: ActionCreator<
//   ThunkAction<void, any, null, Action<string>>
// > = (genomeId: string) => async (dispatch) => {
//   try {
//     dispatch(fetchStrainsAsyncActions.request());

//     // FIXME: using mock data here
//     dispatch(
//       fetchStrainsAsyncActions.success({ strains: mouseStrainsResult.strains })
//     );
//   } catch (error) {
//     dispatch(fetchStrainsAsyncActions.failure(error));
//   }
// };

export const ensureSpeciesIsCommitted: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch, getState: () => RootState) => {
  const state = getState();
  const committedSpecies = getEnabledCommittedSpecies(state);
  const genomeInfo = getGenomeInfoById(state, genomeId);
  if (getCommittedSpeciesById(state, genomeId) || !genomeInfo) {
    return;
  }

  const newCommittedSpecies = [
    ...committedSpecies,
    {
      ...pickBy(genomeInfo, (value, key) => {
        return key !== 'example_objects';
      }),
      isEnabled: true
    }
  ] as CommittedItem[];

  dispatch(updateCommittedSpecies(newCommittedSpecies));
  speciesSelectorStorageService.saveSelectedSpecies(newCommittedSpecies);
};

export const fetchAssemblies: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch) => {
  try {
    dispatch(fetchAssembliesAsyncActions.request());

    const url = `/api/alternative_assemblies?genome_id=${genomeId}`;
    const response = await apiService.fetch(url, { preserveEndpoint: true });

    dispatch(
      fetchAssembliesAsyncActions.success({
        assemblies: response.alternative_assemblies
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

    const url = '/api/popular_genomes';
    const response = await apiService.fetch(url);

    dispatch(
      fetchPopularSpeciesAsyncActions.success({
        popularSpecies: response.popular_species
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
  const { genome_id } = item;

  // TODO: fetch strains when they are ready
  // dispatch(fetchStrains(genome_id));
  dispatch(fetchAssemblies(genome_id));
};

export const updateCommittedSpecies = createAction(
  'species_selector/toggle_species_use'
)<CommittedItem[]>();

export const commitSelectedSpeciesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState) => {
  const committedSpecies = getCommittedSpecies(getState());
  const selectedItem = getSelectedItem(getState());

  if (!selectedItem) {
    return;
  }

  const newCommittedSpecies = [
    ...committedSpecies,
    buildCommittedItem(selectedItem)
  ];

  const speciesName = getSpeciesAnalyticsName(selectedItem);

  analyticsTracking.setSpeciesDimension(selectedItem.genome_id);

  analyticsTracking.trackEvent({
    category: categories.ADD_SPECIES,
    label: speciesName,
    action: 'select'
  });

  dispatch(updateCommittedSpecies(newCommittedSpecies));
  dispatch(clearSelectedSearchResult());

  speciesSelectorStorageService.saveSelectedSpecies(newCommittedSpecies);
};

export const toggleSpeciesUseAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => (dispatch, getState) => {
  const state = getState();
  const committedSpecies = getCommittedSpecies(state);
  const currentSpecies = getCommittedSpeciesById(state, genomeId);
  if (!currentSpecies) {
    return; // should never happen
  }
  const speciesNameForAnalytics = getSpeciesAnalyticsName(currentSpecies);
  const updatedStatus = currentSpecies.isEnabled ? 'do_not_use' : 'use';

  const updatedCommittedSpecies = committedSpecies.map((item) => {
    return item.genome_id === genomeId
      ? {
          ...item,
          isEnabled: !item.isEnabled
        }
      : item;
  });

  analyticsTracking.trackEvent({
    category: categories.SELECTED_SPECIES,
    label: speciesNameForAnalytics,
    action: updatedStatus
  });

  dispatch(updateCommittedSpecies(updatedCommittedSpecies));
  speciesSelectorStorageService.saveSelectedSpecies(updatedCommittedSpecies);
};

export const deleteSpeciesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => (dispatch, getState) => {
  const committedSpecies = getCommittedSpecies(getState());
  const deletedSpecies = find(
    committedSpecies,
    ({ genome_id }) => genome_id === genomeId
  );

  if (deletedSpecies) {
    const deletedSpeciesName = getSpeciesAnalyticsName(deletedSpecies);

    analyticsTracking.setSpeciesDimension(deletedSpecies.genome_id);

    analyticsTracking.trackEvent({
      category: categories.SELECTED_SPECIES,
      label: deletedSpeciesName,
      action: 'unselect'
    });
  }
  const updatedCommittedSpecies = committedSpecies.filter(
    ({ genome_id }) => genome_id !== genomeId
  );

  dispatch(updateCommittedSpecies(updatedCommittedSpecies));
  speciesSelectorStorageService.saveSelectedSpecies(updatedCommittedSpecies);
};

export const changeAssembly = createAction(
  'species_selector/change_assembly',
  (assembly: Assembly) => assembly,
  (assembly: Assembly) =>
    buildAnalyticsObject({
      category: categories.ASSEMBLY_SELECTOR,
      label: assembly.assembly_name,
      action: 'select'
    })
)();
