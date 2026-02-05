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

type GenomePairId = string; // `${reference_genome_id}-${alt_genome_id}`

export type TrackIds = {
  referenceGenomeTrackIds: string[];
  altGenomeTrackIds: string[];
};

// type OutputTrackSummaries = // ??? does this need to be part of redux?

export type StatePerGenomePair = {
  trackIds: TrackIds;
};

export const initialStatePerGenomePair: StatePerGenomePair = {
  trackIds: {
    referenceGenomeTrackIds: [],
    altGenomeTrackIds: []
  }
};

type State = Record<GenomePairId, StatePerGenomePair>;

export const createGenomePairId = (params: {
  referenceGenomeId: string;
  altGenomeId: string;
}): GenomePairId => {
  const { referenceGenomeId, altGenomeId } = params;
  return `${referenceGenomeId}-${altGenomeId}`;
};

const ensureStateForGenomePair = (params: {
  state: State;
  referenceGenomeId: string;
  altGenomeId: string;
}) => {
  const genomeIdPair = createGenomePairId(params);
  const { state } = params;
  if (!state[genomeIdPair]) {
    state[genomeIdPair] = structuredClone(initialStatePerGenomePair);
  }
};

const tracksSlice = createSlice({
  name: 'structural-variants-tracks',
  initialState: {} as State,
  reducers: {
    setTracks(
      state,
      action: PayloadAction<{
        referenceGenomeId: string;
        altGenomeId: string;
        referenceGenomeTrackIds: string[];
        altGenomeTrackIds: string[];
      }>
    ) {
      ensureStateForGenomePair({ state, ...action.payload });
      const { payload } = action;
      const genomePairId = createGenomePairId(payload);
      const genomePairState = state[genomePairId];
      genomePairState.trackIds = {
        referenceGenomeTrackIds: payload.referenceGenomeTrackIds,
        altGenomeTrackIds: payload.altGenomeTrackIds
      };
    },
    hideTracks(
      state,
      action: PayloadAction<{
        referenceGenomeId: string;
        altGenomeId: string;
        referenceGenomeTrackIds: string[];
      }>
    ) {
      ensureStateForGenomePair({ state, ...action.payload });
      const genomePairId = createGenomePairId(action.payload);
      const genomePairState = state[genomePairId];
      // [...new Set([...genomePairState.hiddenTrackIds, ...action.payload.trackIds])]
      genomePairState.trackIds.referenceGenomeTrackIds =
        genomePairState.trackIds.referenceGenomeTrackIds.filter(
          (trackId) => !action.payload.referenceGenomeTrackIds.includes(trackId)
        );
    },
    showTracks(
      state,
      action: PayloadAction<{
        referenceGenomeId: string;
        altGenomeId: string;
        referenceGenomeTrackIds: string[];
      }>
    ) {
      ensureStateForGenomePair({ state, ...action.payload });
      const genomePairId = createGenomePairId(action.payload);
      const genomePairState = state[genomePairId];
      genomePairState.trackIds.referenceGenomeTrackIds = [
        ...new Set([
          ...genomePairState.trackIds.referenceGenomeTrackIds,
          ...action.payload.referenceGenomeTrackIds
        ])
      ];
    }
  }
});

export const { setTracks, hideTracks, showTracks } = tracksSlice.actions;

export default tracksSlice.reducer;
