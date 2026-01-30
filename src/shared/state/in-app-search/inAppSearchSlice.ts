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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppName = 'speciesHome' | 'genomeBrowser' | 'entityViewer';

type StateForGenome = {
  queries: {
    gene: string;
    variant: string;
  };
};

// object with keys being genome ids and values being SearchResults
type StateForApp = Record<string, StateForGenome>;

type State = Record<AppName, StateForApp>;

const initialState: State = {
  speciesHome: {},
  genomeBrowser: {},
  entityViewer: {}
};

const getDefaultStateForGenome = () => ({
  queries: {
    gene: '',
    variant: ''
  }
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
    updateGeneQuery(state, action: PayloadAction<UpdateQueryPayload>) {
      const {
        payload: { app, genomeId, query }
      } = action;
      if (!state[app][genomeId]) {
        state[app][genomeId] = getDefaultStateForGenome();
      }
      state[app][genomeId].queries.gene = query;
    },
    updateVariantQuery(state, action: PayloadAction<UpdateQueryPayload>) {
      const {
        payload: { app, genomeId, query }
      } = action;
      if (!state[app][genomeId]) {
        state[app][genomeId] = getDefaultStateForGenome();
      }
      state[app][genomeId].queries.variant = query;
    },
    clearSearch(state, action: PayloadAction<ClearSearchPayload>) {
      const { payload } = action;
      delete state[payload.app][payload.genomeId];
    }
  }
});

export const { updateGeneQuery, updateVariantQuery, clearSearch } =
  inAppSearchSlice.actions;

export default inAppSearchSlice.reducer;
