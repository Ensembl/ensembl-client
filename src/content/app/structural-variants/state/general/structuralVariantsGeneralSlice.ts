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

import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

/**
 * Will probably also need:
 * - reference genome slice
 * - alternative genome slice
 */

export type State = {
  referenceGenome: BriefGenomeSummary | null;
  alternativeGenome: BriefGenomeSummary | null;
};

const initialState: State = {
  referenceGenome: null,
  alternativeGenome: null
};

const speciesGeneralSlice = createSlice({
  name: 'species-page-general',
  initialState,
  reducers: {
    setReferenceGenome(
      state,
      action: PayloadAction<{ genome: BriefGenomeSummary }>
    ) {
      const { genome } = action.payload;
      state.referenceGenome = genome;
      state.alternativeGenome = null;
    },
    setAlternativeGenome(
      state,
      action: PayloadAction<{ genome: BriefGenomeSummary }>
    ) {
      const { genome } = action.payload;
      state.alternativeGenome = genome;
    }
  }
});

export const { setReferenceGenome, setAlternativeGenome } =
  speciesGeneralSlice.actions;

export default speciesGeneralSlice.reducer;
