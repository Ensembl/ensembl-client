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

type SelectionCriterion = {
  dimensionName: string;
  value: string;
};

type SelectionCriterionForGenome = SelectionCriterion & {
  genomeId: string;
};

export type StatePerGenome = {
  selectionCriteria: {
    [dimensionName: string]: string[];
  };
  combiningDimensions: string[]; // Dimensions used to combine epigenomes out of base epigenomes
  sortingDimensions: string[] | null;
};

type EpigenomeSelectionState = Record<string, StatePerGenome>;

const initialStateForGenome: StatePerGenome = {
  selectionCriteria: {},
  combiningDimensions: [],
  sortingDimensions: null
};

const ensureStateForGenome = (
  state: EpigenomeSelectionState,
  genomeId: string
) => {
  if (!(genomeId in state)) {
    state[genomeId] = structuredClone(initialStateForGenome);
  }
};

const epigenomeSelectionSlice = createSlice({
  name: 'regulatory-activity-viewer-epigenome-selection',
  initialState: {} as EpigenomeSelectionState,
  reducers: {
    addSelectionCriterion(
      state,
      action: PayloadAction<SelectionCriterionForGenome>
    ) {
      const { dimensionName, value, genomeId } = action.payload;
      ensureStateForGenome(state, genomeId);
      if (!state[genomeId].selectionCriteria[dimensionName]) {
        state[genomeId].selectionCriteria[dimensionName] = [];
      }
      state[genomeId].selectionCriteria[dimensionName].push(value);
    },
    removeSelectionCriterion(
      state,
      action: PayloadAction<SelectionCriterionForGenome>
    ) {
      const { dimensionName, value, genomeId } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].selectionCriteria[dimensionName] = state[
        genomeId
      ].selectionCriteria[dimensionName].filter((item) => item !== value);
    },
    addCombiningDimension(
      state,
      action: PayloadAction<{ genomeId: string; dimensionName: string }>
    ) {
      const { dimensionName, genomeId } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].combiningDimensions.push(dimensionName);
    },
    removeAllCombiningDimensions(
      state,
      action: PayloadAction<{ genomeId: string }>
    ) {
      const { genomeId } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].combiningDimensions = [];
    },
    setSortingDimensionsOrder(
      state,
      action: PayloadAction<{ genomeId: string; dimensionNames: string[] }>
    ) {
      const { genomeId, dimensionNames } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].sortingDimensions = dimensionNames;
    }
  }
});

export const {
  addSelectionCriterion,
  removeSelectionCriterion,
  addCombiningDimension,
  removeAllCombiningDimensions,
  setSortingDimensionsOrder
} = epigenomeSelectionSlice.actions;

export default epigenomeSelectionSlice.reducer;
