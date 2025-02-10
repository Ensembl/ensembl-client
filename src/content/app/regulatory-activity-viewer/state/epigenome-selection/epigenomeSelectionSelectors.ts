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

import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from 'src/store';
import type { StatePerGenome } from './epigenomeSelectionSlice';

const getEpigenomeSelectionState = (state: RootState) =>
  state.regionActivityViewer.epigenomeSelection;

export const getEpigenomeSelectionStatePerGenome = (
  state: RootState,
  genomeId: string
): StatePerGenome | null =>
  state.regionActivityViewer.epigenomeSelection[genomeId] ?? null;

// Transform arrays of selected values into sets: they will be accessed a lot
export const getEpigenomeSelectionCriteria = createSelector(
  [getEpigenomeSelectionState, (_, genomeId: string) => genomeId],
  (epigenomeSelectionSlice, genomeId) => {
    const result: Record<string, Set<string>> = {};
    const slicePerGenome = epigenomeSelectionSlice[genomeId];
    if (!slicePerGenome) {
      return result;
    }

    for (const [dimensionName, selectedValues] of Object.entries(
      slicePerGenome.selectionCriteria
    )) {
      if (selectedValues.length) {
        result[dimensionName] = new Set(selectedValues);
      }
    }
    return result;
  }
);

export const getEpigenomeCombiningDimensions = createSelector(
  [getEpigenomeSelectionState, (_, genomeId: string) => genomeId],
  (epigenomeSelectionSlice, genomeId) => {
    return epigenomeSelectionSlice[genomeId]?.combiningDimensions ?? [];
  }
);

export const getEpigenomeSortingDimensions = (
  state: RootState,
  genomeId: string
) => {
  const stateForGenome = getEpigenomeSelectionStatePerGenome(state, genomeId);
  return stateForGenome?.sortingDimensions ?? null;
};

export type EpigenomeSelectionCriteria = ReturnType<
  typeof getEpigenomeSelectionCriteria
>;
