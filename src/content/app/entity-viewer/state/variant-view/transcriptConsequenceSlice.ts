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

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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

const transcriptConsequenceSlice = createSlice({
  name: 'transcript-consequence-slice',
  initialState: {} as TranscriptConsequenceState,
  reducers: {
    expandTranscript(
      state,
      action: PayloadAction<{
        genomeId: string;
        variantId: string;
        alleleId: string;
        transcriptId: string;
      }>
    ) {
      const { genomeId, variantId, alleleId, transcriptId } = action.payload;
      ensurePresenceOfTranscriptConsequenceState(
        state,
        genomeId,
        variantId,
        alleleId
      );

      const expandedIds = state[genomeId][variantId][alleleId].expandedIds;
      if (expandedIds) {
        expandedIds.push(transcriptId);
      } else {
        state[genomeId][variantId][alleleId].expandedIds = [transcriptId];
      }
    },
    collapseTranscript(
      state,
      action: PayloadAction<{
        genomeId: string;
        variantId: string;
        alleleId: string;
        transcriptId: string;
      }>
    ) {
      const { genomeId, variantId, alleleId, transcriptId } = action.payload;
      ensurePresenceOfTranscriptConsequenceState(
        state,
        genomeId,
        variantId,
        alleleId
      );

      let expandedIds = state[genomeId][variantId][alleleId].expandedIds;
      if (expandedIds) {
        // this should always be the case in this reducer
        expandedIds = expandedIds.filter((id) => id !== transcriptId);
        state[genomeId][variantId][alleleId].expandedIds = expandedIds;
      }
    }
  }
});

export const { expandTranscript, collapseTranscript } =
  transcriptConsequenceSlice.actions;
export default transcriptConsequenceSlice.reducer;
