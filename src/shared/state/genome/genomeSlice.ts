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
  Action,
  ThunkAction,
  createAsyncThunk
} from '@reduxjs/toolkit';

import apiService from 'src/services/api-service';

import {
  getGenomeInfoById,
  getGenomeTrackCategories,
  getGenomeKaryotype
} from 'src/shared/state/genome/genomeSelectors';

import { ensureSpeciesIsCommitted } from 'src/content/app/species-selector/state/speciesSelectorSlice';
import { fetchExampleFocusObjects } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';

import {
  GenomeInfoData,
  GenomeTrackCategories,
  GenomeKaryotypeItem
} from './genomeTypes';
import { RootState } from 'src/store';

export type GenomeInfoState = Readonly<{
  genomeInfoData: GenomeInfoData;
  genomeInfoFetchFailed: boolean;
  genomeInfoFetching: boolean;
}>;

export const defaultGenomeInfoState: GenomeInfoState = {
  genomeInfoData: {},
  genomeInfoFetchFailed: false,
  genomeInfoFetching: false
};

export type GenomeTrackCategoriesState = Readonly<{
  genomeTrackCategoriesData: GenomeTrackCategories;
  genomeTrackCategoriesFetchFailed: boolean;
  genomeTrackCategoriesFetching: boolean;
}>;

export const defaultGenomeTrackCategoriesState: GenomeTrackCategoriesState = {
  genomeTrackCategoriesData: {},
  genomeTrackCategoriesFetchFailed: false,
  genomeTrackCategoriesFetching: false
};

export type GenomeKaryotypeState = Readonly<{
  genomeKaryotypeData: {
    [genomeId: string]: GenomeKaryotypeItem[];
  };
  genomeKaryotypeFetchFailed: boolean;
  genomeKaryotypeFetching: boolean;
}>;

export const defaultGenomeKaryotypeState: GenomeKaryotypeState = {
  genomeKaryotypeData: {},
  genomeKaryotypeFetchFailed: false,
  genomeKaryotypeFetching: false
};

export const fetchGenomeData =
  (genomeId: string): ThunkAction<void, any, void, Action<string>> =>
  async (dispatch) => {
    await Promise.all([
      dispatch(fetchGenomeInfo(genomeId)),
      dispatch(fetchGenomeTrackCategories(genomeId)), // <--
      dispatch(fetchGenomeKaryotype(genomeId))
    ]);

    dispatch(ensureSpeciesIsCommitted(genomeId));

    dispatch(fetchExampleFocusObjects(genomeId));
  };

export const fetchGenomeInfo = createAsyncThunk(
  'genome/fetch_genome_info',
  async (genomeId: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const genomeInfo = getGenomeInfoById(state, genomeId);

    if (genomeInfo) {
      return; // nothing to do
    }
    try {
      const url = `/api/genomesearch/genome/info?genome_id=${genomeId}`;
      const response = await apiService.fetch(url);
      return {
        [genomeId]: response.genome_info[0] // FIXME: Why the response is an array instead of an object keyed by genomeId?
      };
    } catch (error) {
      thunkAPI.rejectWithValue(error as Error);
    }
  }
);

export const fetchGenomeTrackCategories = createAsyncThunk(
  'genome/fetch_genome_track_categories',
  async (genomeId: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    try {
      const currentGenomeTrackCategories: GenomeTrackCategories =
        getGenomeTrackCategories(state);

      if (currentGenomeTrackCategories[genomeId]) {
        return;
      }

      const url = `/api/tracks/track_categories/${genomeId}`;
      const response = await apiService.fetch(url);

      return {
        [genomeId]: response.track_categories
      };
    } catch (error) {
      thunkAPI.rejectWithValue(error as Error);
    }
  }
);

export const fetchGenomeKaryotype = createAsyncThunk(
  'genome/fetch_genome_karyotype',
  async (genomeId: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    try {
      const currentGenomeKaryotype: GenomeKaryotypeItem[] | null =
        getGenomeKaryotype(state);

      if (currentGenomeKaryotype) {
        return;
      }

      const url = `/api/genomesearch/genome/karyotype?genome_id=${genomeId}`;
      const response = await apiService.fetch(url);

      return {
        [genomeId]: response
      };
    } catch (error) {
      thunkAPI.rejectWithValue(error as Error);
    }
  }
);

const defaultGenomeState = {
  genomeInfo: defaultGenomeInfoState as GenomeInfoState,
  genomeTrackCategories:
    defaultGenomeTrackCategoriesState as GenomeTrackCategoriesState,
  genomeKaryotype: defaultGenomeKaryotypeState as GenomeKaryotypeState
};
const genomeSlice = createSlice({
  name: 'genomeInfo',
  initialState: defaultGenomeState,
  reducers: {},
  extraReducers: (builder) => {
    // GenomeInfo
    builder.addCase(fetchGenomeInfo.pending, (state) => {
      state.genomeInfo.genomeInfoFetchFailed = false;
      state.genomeInfo.genomeInfoFetching = true;
    });

    builder.addCase(fetchGenomeInfo.fulfilled, (state, action) => {
      state.genomeInfo.genomeInfoFetchFailed = false;
      state.genomeInfo.genomeInfoFetching = false;
      state.genomeInfo.genomeInfoData = {
        ...state.genomeInfo.genomeInfoData,
        ...action.payload
      };
    });

    builder.addCase(fetchGenomeInfo.rejected, (state) => {
      state.genomeTrackCategories.genomeTrackCategoriesFetchFailed = true;
      state.genomeTrackCategories.genomeTrackCategoriesFetching = false;
    });

    // TrackCategories
    builder.addCase(fetchGenomeTrackCategories.pending, (state) => {
      state.genomeTrackCategories.genomeTrackCategoriesFetchFailed = false;
      state.genomeTrackCategories.genomeTrackCategoriesFetching = true;
    });

    builder.addCase(fetchGenomeTrackCategories.fulfilled, (state, action) => {
      state.genomeTrackCategories.genomeTrackCategoriesFetchFailed = false;
      state.genomeTrackCategories.genomeTrackCategoriesFetching = false;
      state.genomeTrackCategories.genomeTrackCategoriesData = {
        ...state.genomeTrackCategories.genomeTrackCategoriesData,
        ...action.payload
      };
    });

    builder.addCase(fetchGenomeTrackCategories.rejected, (state) => {
      state.genomeTrackCategories.genomeTrackCategoriesFetchFailed = true;
      state.genomeTrackCategories.genomeTrackCategoriesFetching = false;
    });

    // GenomeKaryotype
    builder.addCase(fetchGenomeKaryotype.pending, (state) => {
      state.genomeKaryotype.genomeKaryotypeFetchFailed = false;
      state.genomeKaryotype.genomeKaryotypeFetching = true;
    });

    builder.addCase(fetchGenomeKaryotype.fulfilled, (state, action) => {
      state.genomeKaryotype.genomeKaryotypeFetchFailed = false;
      state.genomeKaryotype.genomeKaryotypeFetching = false;
      state.genomeKaryotype.genomeKaryotypeData = {
        ...state.genomeKaryotype.genomeKaryotypeData,
        ...action.payload
      };
    });

    builder.addCase(fetchGenomeKaryotype.rejected, (state) => {
      state.genomeKaryotype.genomeKaryotypeFetchFailed = true;
      state.genomeKaryotype.genomeKaryotypeFetching = false;
    });
  }
});

export default genomeSlice.reducer;
