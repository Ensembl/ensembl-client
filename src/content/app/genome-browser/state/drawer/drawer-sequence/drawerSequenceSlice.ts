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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

export type SequenceType = 'genomic' | 'cdna' | 'cds' | 'protein';

type SequenceState = {
  sequenceType: SequenceType;
  isReverseComplement: boolean;
};

// a map keyed by feature ids
type SequenceStatePerFeature = Record<string, SequenceState>;

type SequenceStatePerGenome = {
  isVisible: boolean;
  features: SequenceStatePerFeature;
};

// a map keyed by genome ids
type DrawerSequenceState = Record<string, SequenceStatePerGenome>;

type CommonParams = {
  genomeId: string;
  featureId: string;
};

type SequenceTypeParams = CommonParams & {
  sequenceType: SequenceType;
};

type ReverseComplementParams = CommonParams & {
  isReverseComplement: boolean;
};

const ensureGenomePresence = (state: DrawerSequenceState, genomeId: string) => {
  if (!state[genomeId]) {
    state[genomeId] = { isVisible: false, features: {} };
  }
};

const ensureFeaturePresence = (
  state: DrawerSequenceState,
  genomeId: string,
  featureId: string
) => {
  ensureGenomePresence(state, genomeId);

  if (!state[genomeId].features[featureId]) {
    state[genomeId].features[featureId] = {
      sequenceType: 'genomic',
      isReverseComplement: false
    };
  }
};

const drawerSequenceSlice = createSlice({
  name: 'genome-browser-drawer-sequence',
  initialState: {} as DrawerSequenceState,
  reducers: {
    showSequence(state, action: PayloadAction<{ genomeId: string }>) {
      const { genomeId } = action.payload;
      ensureGenomePresence(state, genomeId);
      state[genomeId].isVisible = true;
    },
    hideSequence(state, action: PayloadAction<{ genomeId: string }>) {
      const { genomeId } = action.payload;
      ensureGenomePresence(state, genomeId);
      state[genomeId].isVisible = false;
    },
    changeSequenceType(state, action: PayloadAction<SequenceTypeParams>) {
      const { genomeId, featureId, sequenceType } = action.payload;
      ensureFeaturePresence(state, genomeId, featureId);
      state[genomeId].features[featureId].sequenceType = sequenceType;
    },
    changeReverseComplement(
      state,
      action: PayloadAction<ReverseComplementParams>
    ) {
      const { genomeId, featureId, isReverseComplement } = action.payload;
      ensureFeaturePresence(state, genomeId, featureId);
      state[genomeId].features[featureId].isReverseComplement =
        isReverseComplement;
    },
    clearGenome(state, action: PayloadAction<{ genomeId: string }>) {
      const { genomeId } = action.payload;
      delete state[genomeId];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(changeDrawerViewForGenome, (state, action) => {
      const { genomeId, drawerView } = action.payload;
      if (!drawerView) {
        // the drawer is closed; resetting the state for this genome
        delete state[genomeId];
      }
    });
  }
});

export const {
  showSequence,
  hideSequence,
  changeSequenceType,
  changeReverseComplement,
  clearGenome
} = drawerSequenceSlice.actions;

export default drawerSequenceSlice.reducer;
