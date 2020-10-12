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
  PayloadAction,
  ThunkAction
} from '@reduxjs/toolkit';
import { Source } from 'src/content/app/entity-viewer/types/source';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { RootState } from 'src/store';

import { sidebarData } from 'src/content/app/species/sample-data.ts';

export type SpeciesSidebarPayload = {
  species: {
    display_name: string;
    scientific_name: string;
  };
  assembly: {
    name: string;
    source: Source;
    level: string;
  };
  annotation: {
    provider?: string;
    method?: string;
    last_updated_date?: string;
    gencode_version?: string;
    database_version?: string;
    taxonomy_id?: string;
  };
  psuedoautosomal_regions: {
    description: string;
  };
};

type SpeciesPageSidebarState = {
  isOpen: boolean;
  species: {
    [genomeId: string]: {
      payload: SpeciesSidebarPayload | null;
    };
  };
};

const initialState: SpeciesPageSidebarState = {
  isOpen: true,
  species: {}
};

export const fetchSidebarPayload = (): ThunkAction<
  void,
  any,
  null,
  Action<string>
> => (dispatch, getState: () => RootState) => {
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

const speciesPageSidebarSlice = createSlice({
  name: 'species-page-sidebar',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isOpen = !state.isOpen;
    },

    setSidebarPayloadForGenomeId(
      state,
      action: PayloadAction<{
        genomeId: string;
        sidebarPayload: SpeciesSidebarPayload;
      }>
    ) {
      if (!state.species[action.payload.genomeId]) {
        state.species[action.payload.genomeId] = { payload: null };
      }
      state.species[action.payload.genomeId].payload =
        action.payload.sidebarPayload;
    }
  }
});

export const { toggleSidebar } = speciesPageSidebarSlice.actions;

export default speciesPageSidebarSlice.reducer;
