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

type State = {
  selectionCriteria: {
    [dimensionName: string]: string[];
  };
  combiningDimensions: string[]; // Dimensions used to combine epigenomes out of base epigenomes
};

/**
 
  // example
  [
    {
      dimension: 'term',
      value: 'small intestine'
    },
    {
      dimension: 'organ_slims',
      value: 'adrenal gland'
    },
  ]

 */

const initialState: State = {
  selectionCriteria: {},
  combiningDimensions: []
};

const epigenomeSelectionSlice = createSlice({
  name: 'regulatory-activity-viewer-epigenome-selection',
  initialState,
  reducers: {
    addSelectionCriterion(state, action: PayloadAction<SelectionCriterion>) {
      const { dimensionName, value } = action.payload;
      if (!state.selectionCriteria[dimensionName]) {
        state.selectionCriteria[dimensionName] = [];
      }
      state.selectionCriteria[dimensionName].push(value);
    },
    removeSelectionCriterion(state, action: PayloadAction<SelectionCriterion>) {
      const { dimensionName, value } = action.payload;
      state.selectionCriteria[dimensionName] = state.selectionCriteria[
        dimensionName
      ].filter((item) => item !== value);
    },
    addCombiningDimension(state, action: PayloadAction<string>) {
      state.combiningDimensions.push(action.payload);
    }
  }
});

export const {
  addSelectionCriterion,
  removeSelectionCriterion,
  addCombiningDimension
} = epigenomeSelectionSlice.actions;

export default epigenomeSelectionSlice.reducer;
