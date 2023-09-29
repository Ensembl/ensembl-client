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

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import type { SearchResults } from 'src/shared/types/search-api/search-results';

export type AppName = 'speciesHome' | 'genomeBrowser' | 'entityViewer';

type StateForGenome = {
  query: string;
  result: SearchResults | null;
};

// object with keys being genome ids and values being SearchResults
type StateForApp = Record<string, StateForGenome>;

type State = Record<AppName, StateForApp>;

type SearchParams = {
  app: AppName;
  genome_id: string;
  query: string;
  page: number;
  per_page: number;
};

export const search = createAsyncThunk(
  'in-app-search/search',
  async (params: SearchParams) => {
    const queryParams = {
      genome_ids: [params.genome_id], // backend expects genome ids as an array
      query: params.query,
      page: params.page,
      per_page: params.per_page
    };

    const url = '/api/search/genes';
    const response: SearchResults = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(queryParams)
    }).then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    });

    return {
      app: params.app,
      genome_id: params.genome_id,
      result: response
    };
  }
);

const initialState: State = {
  speciesHome: {},
  genomeBrowser: {},
  entityViewer: {}
};

const getDefaultStateForGenome = () => ({
  query: '',
  result: null
});

type UpdateQueryPayload = {
  app: AppName;
  genomeId: string;
  query: string;
};

type ClearSearchPayload = {
  app: AppName;
  genomeId: string;
};

const inAppSearchSlice = createSlice({
  name: 'in-app-search',
  initialState,
  reducers: {
    updateQuery(state, action: PayloadAction<UpdateQueryPayload>) {
      const {
        payload: { app, genomeId, query }
      } = action;
      if (!state[app][genomeId]) {
        state[app][genomeId] = getDefaultStateForGenome();
      }
      state[app][genomeId].query = query;
    },
    clearSearch(state, action: PayloadAction<ClearSearchPayload>) {
      const { payload } = action;
      delete state[payload.app][payload.genomeId];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(search.fulfilled, (state, action) => {
      const {
        payload: { app, genome_id, result }
      } = action;
      if (!state[app][genome_id]) {
        state[app][genome_id] = getDefaultStateForGenome();
      }
      state[app][genome_id].result = result;
    });
  }
});

export const { updateQuery, clearSearch } = inAppSearchSlice.actions;

export default inAppSearchSlice.reducer;
