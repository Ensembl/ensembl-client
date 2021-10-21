/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  Action,
  createSlice,
  createAction,
  PayloadAction,
  ThunkAction
} from '@reduxjs/toolkit';
import pickBy from 'lodash/pickBy';

import apiService from 'src/services/api-service';
import speciesSelectorStorageService from 'src/content/app/species-selector/services/species-selector-storage-service';

import { deleteSpeciesInGenomeBrowser } from 'src/content/app/browser/browserActions';
import { deleteGenome as deleteSpeciesInEntityViewer } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSlice';

import { getGenomeInfoById } from 'src/shared/state/genome/genomeSelectors';
import {
  getCommittedSpecies,
  getCommittedSpeciesById,
  getSelectedItem,
  getSearchText
} from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import initialState, { CurrentItem } from './speciesSelectorState';
import {
  SearchMatch,
  SearchMatches,
  PopularSpecies,
  CommittedItem
} from 'src/content/app/species-selector/types/species-search';
import { RootState } from 'src/store';

import { MINIMUM_SEARCH_LENGTH } from 'src/content/app/species-selector/constants/speciesSelectorConstants';

const buildCommittedItem = (data: CurrentItem): CommittedItem => ({
  genome_id: data.genome_id,
  reference_genome_id: data.reference_genome_id,
  common_name: data.common_name,
  scientific_name: data.scientific_name,
  assembly_name: data.assembly_name as string,
  isEnabled: true
});

export const updateSearch =
  (text: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();
    const selectedItem = getSelectedItem(state);
    const previousText = getSearchText(state);
    if (selectedItem) {
      dispatch(speciesSelectorSlice.actions.clearSelectedSearchResult());
    }

    const trimmedText = text.trim();
    if (text.length < previousText.length) {
      // user is deleting their input; clear search results
      dispatch(speciesSelectorSlice.actions.clearSearchResults());
    }

    if (trimmedText.length >= MINIMUM_SEARCH_LENGTH) {
      dispatch(fetchSpeciesSearchResultsRequest(trimmedText));
    }

    dispatch(speciesSelectorSlice.actions.setSearchText({ searchText: text }));
  };

export const fetchSpeciesSearchResultsRequest = createAction<string>(
  'species_selector/species_search_request'
);

export const fetchSpeciesSearchResultsFailure = createAction<Error>(
  'species_selector/species_search_failure'
);

export const fetchPopularSpeciesRequest = createAction<undefined>(
  'species_selector/popular_species_request'
);

export const fetchPopularSpeciesFailure = createAction<Error>(
  'species_selector/popular_species_failure'
);

export const ensureSpeciesIsCommitted =
  (genomeId: string): ThunkAction<void, any, null, Action<string>> =>
  async (dispatch, getState: () => RootState) => {
    const state = getState();
    const committedSpecies = getCommittedSpecies(state);
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

    dispatch(
      speciesSelectorSlice.actions.updateCommittedSpecies({
        committedItems: newCommittedSpecies
      })
    );
    speciesSelectorStorageService.saveSelectedSpecies(newCommittedSpecies);
  };

export const ensureSpeciesIsEnabled =
  (genomeId: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();

    const currentSpecies = getCommittedSpeciesById(state, genomeId);
    if (!currentSpecies || currentSpecies.isEnabled) {
      return;
    }

    dispatch(toggleSpeciesUseAndSave(genomeId));
  };

export const loadStoredSpecies =
  (): ThunkAction<void, any, null, Action<string>> => (dispatch) => {
    const storedSpecies = speciesSelectorStorageService.getSelectedSpecies();
    dispatch(
      speciesSelectorSlice.actions.updateCommittedSpecies({
        committedItems: storedSpecies
      })
    );
  };

export const fetchPopularSpecies =
  (): ThunkAction<void, any, null, Action<string>> => async (dispatch) => {
    try {
      dispatch(fetchPopularSpeciesRequest());

      const url = '/api/genomesearch/popular_genomes';
      const response = await apiService.fetch(url);

      dispatch(
        fetchPopularSpeciesSuccess({
          popularSpecies: response.popular_species
        })
      );
    } catch (error) {
      dispatch(fetchPopularSpeciesFailure(error as Error));
    }
  };

export const handleSelectedSpecies =
  (
    item: SearchMatch | PopularSpecies
  ): ThunkAction<void, any, null, Action<string>> =>
  (dispatch) => {
    dispatch(
      speciesSelectorSlice.actions.setSelectedSpecies({ species: item })
    );

    // TODO: fetch strains when they are ready
    // dispatch(fetchStrains(genome_id));
  };

export const commitSelectedSpeciesAndSave =
  (): ThunkAction<void, any, null, Action<string>> => (dispatch, getState) => {
    const committedSpecies = getCommittedSpecies(getState());
    const selectedItem = getSelectedItem(getState());

    if (!selectedItem) {
      return;
    }

    const newCommittedSpecies = [
      ...committedSpecies,
      buildCommittedItem(selectedItem)
    ];

    dispatch(
      speciesSelectorSlice.actions.updateCommittedSpecies({
        committedItems: newCommittedSpecies
      })
    );
    dispatch(speciesSelectorSlice.actions.clearSelectedSearchResult());

    speciesSelectorStorageService.saveSelectedSpecies(newCommittedSpecies);
  };

export const toggleSpeciesUseAndSave =
  (genomeId: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const committedSpecies = getCommittedSpecies(state);
    const currentSpecies = getCommittedSpeciesById(state, genomeId);
    if (!currentSpecies) {
      return; // should never happen
    }
    const updatedCommittedSpecies = committedSpecies.map((item) => {
      return item.genome_id === genomeId
        ? {
            ...item,
            isEnabled: !item.isEnabled
          }
        : item;
    });

    dispatch(
      speciesSelectorSlice.actions.updateCommittedSpecies({
        committedItems: updatedCommittedSpecies
      })
    );
    speciesSelectorStorageService.saveSelectedSpecies(updatedCommittedSpecies);
  };

export const deleteSpeciesAndSave =
  (genomeId: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState) => {
    const committedSpecies = getCommittedSpecies(getState());
    const updatedCommittedSpecies = committedSpecies.filter(
      ({ genome_id }) => genome_id !== genomeId
    );

    dispatch(
      speciesSelectorSlice.actions.updateCommittedSpecies({
        committedItems: updatedCommittedSpecies
      })
    );
    dispatch(deleteSpeciesInGenomeBrowser(genomeId));
    dispatch(deleteSpeciesInEntityViewer(genomeId));
    speciesSelectorStorageService.saveSelectedSpecies(updatedCommittedSpecies);
  };

// NOTE: CurrentItem can be built from a search match or from a popular species
const buildCurrentItem = (data: SearchMatch | PopularSpecies): CurrentItem => {
  return {
    genome_id: data.genome_id,
    reference_genome_id: data.reference_genome_id,
    common_name: data.common_name,
    scientific_name: data.scientific_name,
    assembly_name: data.assembly_name
  };
};

const speciesSelectorSlice = createSlice({
  name: 'species-selector',
  initialState,
  reducers: {
    clearSelectedSearchResult(state) {
      state.currentItem = null;
    },

    clearSearchResults(state) {
      state.search = { ...state.search, results: initialState.search.results };
    },

    clearSearch(state) {
      state.search = initialState.search;
    },

    setSelectedSpecies(
      state,
      action: PayloadAction<{
        species: SearchMatch | PopularSpecies;
      }>
    ) {
      state.currentItem = buildCurrentItem(action.payload.species);
      state.search = initialState.search;
    },

    setSearchText(
      state,
      action: PayloadAction<{
        searchText: string;
      }>
    ) {
      state.search.text = action.payload.searchText;
    },

    updateCommittedSpecies(
      state,
      action: PayloadAction<{
        committedItems: CommittedItem[];
      }>
    ) {
      state.committedItems = action.payload.committedItems;
    },

    fetchPopularSpeciesSuccess(
      state,
      action: PayloadAction<{
        popularSpecies: PopularSpecies[];
      }>
    ) {
      state.popularSpecies = action.payload.popularSpecies;
    },

    fetchSpeciesSearchResultsSuccess(
      state,
      action: PayloadAction<{
        results: SearchMatches[];
      }>
    ) {
      state.search.results = action.payload.results;
    }
  }
});

export const {
  fetchSpeciesSearchResultsSuccess,
  fetchPopularSpeciesSuccess,
  clearSelectedSearchResult,
  clearSearchResults,
  clearSearch,
  setSelectedSpecies,
  setSearchText,
  updateCommittedSpecies
} = speciesSelectorSlice.actions;

export default speciesSelectorSlice.reducer;
