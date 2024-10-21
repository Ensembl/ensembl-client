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

type StatePerGenome = {
  selectedLocation: {
    start: number;
    end: number;
  } | null;
};

// states for different genomes are keyed by their genome id
type State = Record<string, StatePerGenome>;

const initialStatePerGenome: StatePerGenome = {
  selectedLocation: null
};

const ensureStatePerGenome = (state: State, genomeId: string) => {
  if (!state[genomeId]) {
    state[genomeId] = structuredClone(initialStatePerGenome);
  }
};

const regionDetailSlice = createSlice({
  name: 'regulatory-activity-viewer-region-in-detail',
  initialState: {} as State,
  reducers: {
    setRegionDetailLocation(
      state,
      action: PayloadAction<{
        genomeId: string;
        location: StatePerGenome['selectedLocation'];
      }>
    ) {
      const { genomeId, location } = action.payload;
      ensureStatePerGenome(state, genomeId);
      state[genomeId].selectedLocation = location;
    }
  }
});

export const { setRegionDetailLocation } = regionDetailSlice.actions;

export default regionDetailSlice.reducer;
