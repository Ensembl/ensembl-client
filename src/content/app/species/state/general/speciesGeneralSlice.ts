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
import set from 'lodash/fp/set';

import { getActiveGenomeId } from './speciesGeneralSelectors';
import speciesStorageService from '../../services/species-storage-service';

import { SpeciesStatsSection } from 'src/content/app/species/state/general/speciesGeneralHelper';

import type { RootState } from 'src/store';

export type GenomeUIState = {
  expandedSections: SpeciesStatsSection[];
};

export type UIState = {
  [genomeId: string]: GenomeUIState;
};

type SpeciesGeneralState = {
  activeGenomeId: string | null;
  uiState: UIState;
};

const initialState: SpeciesGeneralState = {
  activeGenomeId: null,
  uiState: {}
};

export const setActiveGenomeExpandedSections =
  (
    expandedSections: SpeciesStatsSection[]
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }

    speciesStorageService.updateUIState(
      set(
        `${activeGenomeId}.expandedSections`,
        expandedSections,
        state.speciesPage.general.uiState
      )
    );

    dispatch(
      speciesGeneralSlice.actions.setExpandedSections({
        genomeId: activeGenomeId,
        expandedSections
      })
    );
  };

const speciesGeneralSlice = createSlice({
  name: 'species-page-general',
  initialState,
  reducers: {
    setActiveGenomeId(state, action: PayloadAction<string>) {
      state.activeGenomeId = action.payload;
    },

    setExpandedSections(
      state,
      action: PayloadAction<{
        genomeId: string;
        expandedSections: SpeciesStatsSection[];
      }>
    ) {
      const stateToUpdate = state.uiState[action.payload.genomeId]
        ? state
        : set(action.payload.genomeId, { expandedSections: [] }, state);

      return set(
        `uiState.${action.payload.genomeId}.expandedSections`,
        action.payload.expandedSections,
        stateToUpdate
      );
    },

    restoreUI(state) {
      state.uiState = speciesStorageService.getUIState();
    }
  }
});

export const { setActiveGenomeId, setExpandedSections, restoreUI } =
  speciesGeneralSlice.actions;

export default speciesGeneralSlice.reducer;
