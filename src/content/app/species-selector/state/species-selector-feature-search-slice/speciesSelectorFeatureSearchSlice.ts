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

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SpeciesSelectorFeatureSearchState = {
  queries: {
    gene: string;
    variant: string;
  };
};

const initialState: SpeciesSelectorFeatureSearchState = {
  queries: {
    gene: '',
    variant: ''
  }
};

const speciesSelectorFeatureSearchSlice = createSlice({
  name: 'species-selector-feature-search',
  initialState,
  reducers: {
    setGeneQuery: (state, action: PayloadAction<string>) => {
      state.queries.gene = action.payload;
    },
    setVariantQuery: (state, action: PayloadAction<string>) => {
      state.queries.variant = action.payload;
    },
    clearQueries: (state) => {
      state.queries.gene = '';
      state.queries.variant = '';
    }
  },
  selectors: {
    getQueries: (state) => state.queries,
    getGeneQuery: (state) => state.queries.gene,
    getVariantQuery: (state) => state.queries.variant
  }
});

export const { setGeneQuery, setVariantQuery, clearQueries } =
  speciesSelectorFeatureSearchSlice.actions;

export default speciesSelectorFeatureSearchSlice.reducer;
