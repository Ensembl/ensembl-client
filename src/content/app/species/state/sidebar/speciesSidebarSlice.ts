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
  type Action,
  type PayloadAction,
  type ThunkAction
} from '@reduxjs/toolkit';
import get from 'lodash/get';
import merge from 'lodash/merge';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';

import type { RootState } from 'src/store';

import { sidebarData } from 'src/content/app/species/sample-data';

export enum SpeciesSidebarModalView {
  SEARCH = 'search',
  BOOKMARKS = 'previously viewed',
  SHARE = 'share',
  DOWNLOADS = 'downloads'
}

type Notes = {
  heading: string;
  body: string;
}[];

type Provider = {
  name: string;
  url: string;
};

type Strain = {
  type: string;
  value: string;
};

export type SpeciesSidebarPayload = {
  id: string;
  taxonomy_id: string;
  database_version: string;
  common_name: string | null;
  scientific_name: string | null;
  gencode_version: string | null;
  assembly_name: string;
  assembly_provider: Provider;
  annotation_provider: Provider;
  assembly_level: string;
  annotation_method: string;
  assembly_date: string;
  notes: Notes;
  strain: Strain | null;
};

type StateForGenome = {
  payload: SpeciesSidebarPayload | null;
  isSidebarOpen: boolean;
  sidebarModalView: SpeciesSidebarModalView | null;
};

const initialStateForGenome: StateForGenome = {
  payload: null,
  isSidebarOpen: true,
  sidebarModalView: null
};

type SpeciesPageSidebarState = {
  [genomeId: string]: StateForGenome;
};

const initialState: SpeciesPageSidebarState = {};

// TODO: remove (also, clean up the slice)
export const fetchSidebarPayload =
  (): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }

    const sidebarPayload = sidebarData[activeGenomeId];

    dispatch(
      speciesPageSidebarSlice.actions.setSidebarPayloadForGenomeId({
        genomeId: activeGenomeId,
        sidebarPayload
      })
    );
  };

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
        !state[action.payload.genomeId].isSidebarOpen ?? true;
      updateStateForGenome(state, action.payload.genomeId, { isSidebarOpen });
    },

    setSidebarPayloadForGenomeId(
      state,
      action: PayloadAction<{
        genomeId: string;
        sidebarPayload: SpeciesSidebarPayload;
      }>
    ) {
      updateStateForGenome(state, action.payload.genomeId, {
        payload: action.payload.sidebarPayload
      });
    },

    updateSpeciesSidebarModalForGenome(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
        fragment: Partial<StateForGenome>;
      }>
    ) {
      const { activeGenomeId, fragment } = action.payload;

      state[activeGenomeId] = {
        ...state[activeGenomeId],
        ...fragment
      };
    }
  }
});

export const { toggleSidebar, updateSpeciesSidebarModalForGenome } =
  speciesPageSidebarSlice.actions;

export default speciesPageSidebarSlice.reducer;
