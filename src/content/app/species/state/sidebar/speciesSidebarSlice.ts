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
import get from 'lodash/get';
import merge from 'lodash/merge';

export enum SpeciesSidebarModalView {
  SEARCH = 'search',
  BOOKMARKS = 'previously viewed',
  SHARE = 'share',
  DOWNLOADS = 'downloads'
}

type StateForGenome = {
  isSidebarOpen: boolean;
  sidebarModalView: SpeciesSidebarModalView | null;
};

const initialStateForGenome: StateForGenome = {
  isSidebarOpen: true,
  sidebarModalView: null
};

type SpeciesPageSidebarState = {
  [genomeId: string]: StateForGenome;
};

const initialState: SpeciesPageSidebarState = {};

const updateStateForGenome = (
  state: SpeciesPageSidebarState,
  genomeId: string,
  fragment: Partial<StateForGenome>
) => {
  const stateForGenome = get(state, genomeId, initialStateForGenome);
  const updatedStateForGenome = merge({}, stateForGenome, fragment);
  state[genomeId] = updatedStateForGenome;
};

export const buildInitialStateForGenome = (
  genomeId: string
): SpeciesPageSidebarState => ({
  [genomeId]: initialStateForGenome
});

const speciesPageSidebarSlice = createSlice({
  name: 'species-page-sidebar',
  initialState,
  reducers: {
    toggleSidebar(
      state,
      action: PayloadAction<{
        genomeId: string;
      }>
    ) {
      const isSidebarOpen =
        !state[action.payload.genomeId]?.isSidebarOpen ?? true;
      updateStateForGenome(state, action.payload.genomeId, { isSidebarOpen });
    },

    updateSpeciesSidebarModalForGenome(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
        fragment: Partial<StateForGenome>;
      }>
    ) {
      const { activeGenomeId, fragment } = action.payload;
      updateStateForGenome(state, activeGenomeId, fragment);
    }
  }
});

export const { toggleSidebar, updateSpeciesSidebarModalForGenome } =
  speciesPageSidebarSlice.actions;

export default speciesPageSidebarSlice.reducer;
