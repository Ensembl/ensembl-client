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
import set from 'lodash/fp/set';

import { getActiveGenomeId } from './speciesGeneralSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import speciesStorageService from '../../services/species-storage-service';

import {
  getStatsForSection,
  StatsSection,
  SpeciesStatsSection
} from 'src/content/app/species/state/general/speciesGeneralHelper';

import { RootState } from 'src/store';

export type GenomeStats = StatsSection[];

export type GenomeUIState = {
  expandedSections: SpeciesStatsSection[];
};

export type UIState = {
  [genomeId: string]: GenomeUIState;
};

type SpeciesGeneralState = {
  activeGenomeId: string | null;
  stats: {
    [genomeId: string]: GenomeStats | undefined;
  };
  uiState: UIState;
};

const initialState: SpeciesGeneralState = {
  activeGenomeId: null,
  stats: {},
  uiState: {}
};

export const fetchStatsForActiveGenome =
  (): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }

    const exampleFocusObjects = getGenomeExampleFocusObjects(
      state,
      activeGenomeId
    );

    const speciesStats = Object.values(SpeciesStatsSection)
      .map((section) =>
        getStatsForSection({
          genome_id: activeGenomeId,
          section,
          exampleFocusObjects
        })
      )
      .filter(Boolean) as GenomeStats;

    dispatch(
      speciesGeneralSlice.actions.setStatsForGenomeId({
        genomeId: activeGenomeId,
        stats: speciesStats
      })
    );
  };

export const setActiveGenomeExpandedSections =
  (
    expandedSections: SpeciesStatsSection[]
  ): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

    setStatsForGenomeId(
      state,
      action: PayloadAction<{ genomeId: string; stats: GenomeStats }>
    ) {
      state.stats[action.payload.genomeId] = action.payload.stats;
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

export const {
  setActiveGenomeId,
  setStatsForGenomeId,
  setExpandedSections,
  restoreUI
} = speciesGeneralSlice.actions;

export default speciesGeneralSlice.reducer;
