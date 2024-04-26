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
  PayloadAction,
  ThunkAction,
  createSlice
} from '@reduxjs/toolkit';
import { RootState } from 'src/store';

import { getExpandedTranscriptConseqeuenceIds } from './transcriptConsequenceSelectors';

type TranscriptConsequenceState = {
  [genomeId: string]: {
    [variantId: string]: {
      [alleleId: string]: {
        expandedIds: string[] | null;
      };
    };
  };
};

const ensurePresenceOfTranscriptConsequenceState = (
  state: TranscriptConsequenceState,
  genomeId: string,
  variantId: string,
  alleleId: string
) => {
  if (!state[genomeId]) {
    state[genomeId] = {};
  }
  if (!state[genomeId][variantId]) {
    state[genomeId][variantId] = {};
  }
  if (!state[genomeId][variantId][alleleId]) {
    state[genomeId][variantId][alleleId] = {
      expandedIds: null
    };
  }
};

export const toggleTranscriptIds =
  (
    genomeId: string,
    variantId: string,
    alleleId: string,
    expandTranscriptIds: string[]
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    if (!genomeId || !variantId) {
      return;
    }
    const state = getState();
    const expandedIdsState = new Set<string>(
      getExpandedTranscriptConseqeuenceIds(state, genomeId, variantId, alleleId)
    );

    expandTranscriptIds.map((transcriptId) => {
      if (expandedIdsState.has(transcriptId)) {
        expandedIdsState.delete(transcriptId);
      } else {
        expandedIdsState.add(transcriptId);
      }
    });

    if (expandTranscriptIds.length) {
      dispatch(
        transcriptConsequenceSlice.actions.setExpandedTranscriptConsequenceIds({
          genomeId,
          variantId,
          alleleId,
          expandTranscriptIds: [...expandedIdsState.values()]
        })
      );
    }
  };

const transcriptConsequenceSlice = createSlice({
  name: 'transcript-consequence-slice',
  initialState: {} as TranscriptConsequenceState,
  reducers: {
    setExpandedTranscriptConsequenceIds(
      state,
      action: PayloadAction<{
        genomeId: string;
        variantId: string;
        alleleId: string;
        expandTranscriptIds: string[];
      }>
    ) {
      const { genomeId, variantId, alleleId, expandTranscriptIds } =
        action.payload;
      ensurePresenceOfTranscriptConsequenceState(
        state,
        genomeId,
        variantId,
        alleleId
      );
      state[genomeId][variantId][alleleId].expandedIds = expandTranscriptIds;
    }
  }
});

export const { setExpandedTranscriptConsequenceIds } =
  transcriptConsequenceSlice.actions;
export default transcriptConsequenceSlice.reducer;
