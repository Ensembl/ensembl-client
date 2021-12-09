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
  createSlice,
  createAction,
  createAsyncThunk,
  PayloadAction,
  ThunkAction,
  Action
} from '@reduxjs/toolkit';
import pickBy from 'lodash/pickBy';

import apiService from 'src/services/api-service';
import speciesSelectorStorageService from 'src/content/app/species-selector/services/species-selector-storage-service';

import { deleteSpeciesInGenomeBrowser } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { deleteGenome as deleteSpeciesInEntityViewer } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSlice';

import {
  getCommittedSpecies,
  getCommittedSpeciesById,
  getSelectedItem,
  getSearchText
} from './speciesSelectorSelectors';
import { getGenomeInfoById } from 'src/shared/state/genome/genomeSelectors';

import { MINIMUM_SEARCH_LENGTH } from 'src/content/app/species-selector/constants/speciesSelectorConstants';

import { LoadingState } from 'src/shared/types/loading-state';
import {
  SearchMatch,
  SearchMatches,
  CommittedItem,
  PopularSpecies
} from 'src/content/app/species-selector/types/species-search';
import { RootState } from 'src/store';

export type CurrentItem = {
  genome_id: string; // changes every time we update strain or assembly
  reference_genome_id: string | null;
  common_name: string | null;
  scientific_name: string;
  assembly_name: string | null; // name of the selected assembly
};

export type SpeciesSelectorState = {
  loadingStates: {
    search: LoadingState;
  };
  ui: {
    isSelectingStrain: boolean;
  };
  search: {
    text: string;
    results: SearchMatches[] | null;
  };
  currentItem: CurrentItem | null;
  committedItems: CommittedItem[];
  popularSpecies: PopularSpecies[];
};

export const fetchSpeciesSearchResults = createAction<string>(
  'species-selector/fetchSpeciesSearchResults'
);

export const updateSearch =
  (text: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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
      dispatch(fetchSpeciesSearchResults(trimmedText));
    }

    dispatch(setSearchText(text));
  };

export const fetchPopularSpecies = createAsyncThunk(
  'species-selector/fetchPopularSpecies',
  async () => {
    const url = '/api/genomesearch/popular_genomes';
    const response = await apiService.fetch(url);
    return response.popular_species as PopularSpecies[];
  }
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

    dispatch(updateCommittedSpecies(newCommittedSpecies));
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
    dispatch(updateCommittedSpecies(storedSpecies));
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

    dispatch(updateCommittedSpecies(newCommittedSpecies));
    dispatch(clearSelectedSearchResult());

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

    dispatch(updateCommittedSpecies(updatedCommittedSpecies));
    speciesSelectorStorageService.saveSelectedSpecies(updatedCommittedSpecies);
  };

export const deleteSpeciesAndSave =
  (genomeId: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState) => {
    const committedSpecies = getCommittedSpecies(getState());
    const updatedCommittedSpecies = committedSpecies.filter(
      ({ genome_id }) => genome_id !== genomeId
    );

    dispatch(updateCommittedSpecies(updatedCommittedSpecies));
    dispatch(deleteSpeciesInGenomeBrowser(genomeId));
    dispatch(deleteSpeciesInEntityViewer(genomeId));
    speciesSelectorStorageService.saveSelectedSpecies(updatedCommittedSpecies);
  };

const initialState: SpeciesSelectorState = {
  loadingStates: {
    search: LoadingState.NOT_REQUESTED
  },
  ui: {
    isSelectingStrain: false
  },
  search: {
    text: '',
    results: null
  },
  currentItem: null,
  committedItems: [],
  popularSpecies: []
};

const speciesSelectorSlice = createSlice({
  name: 'species-selector',
  initialState,
  reducers: {
    setSearchText(state, action: PayloadAction<string>) {
      state.search.text = action.payload;
    },
    updateCommittedSpecies(state, action: PayloadAction<CommittedItem[]>) {
      state.committedItems = action.payload;
    },
    setSelectedSpecies(
      state,
      action: PayloadAction<SearchMatch | PopularSpecies>
    ) {
      state.currentItem = buildCurrentItem(action.payload);
      state.search = { ...initialState.search };
    },
    setSearchResults(state, action: PayloadAction<SearchMatches[]>) {
      state.search.results = action.payload;
    },
    clearSearch(state) {
      state.search = { ...initialState.search };
    },
    clearSearchResults(state) {
      state.search.results = null;
    },
    clearSelectedSearchResult(state) {
      state.currentItem = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPopularSpecies.fulfilled, (state, action) => {
      state.popularSpecies = action.payload;
    });
  }
});

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

const buildCommittedItem = (data: CurrentItem): CommittedItem => ({
  genome_id: data.genome_id,
  reference_genome_id: data.reference_genome_id,
  common_name: data.common_name,
  scientific_name: data.scientific_name,
  assembly_name: data.assembly_name as string,
  isEnabled: true
});

export const {
  setSearchText,
  updateCommittedSpecies,
  setSelectedSpecies,
  setSearchResults,
  clearSearch,
  clearSearchResults,
  clearSelectedSearchResult
} = speciesSelectorSlice.actions;

export default speciesSelectorSlice.reducer;
