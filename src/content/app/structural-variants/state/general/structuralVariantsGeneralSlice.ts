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
import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

/**
 * Will probably also need:
 * - reference genome slice
 * - alternative genome slice
 */

export type State = {
  referenceGenome: BriefGenomeSummary | null;
  alternativeGenome: BriefGenomeSummary | null;
  referenceGenomeLocation: GenomicLocation | null;
  alternativeGenomeLocation: GenomicLocation | null;
};

const initialState: State = {
  referenceGenome: null,
  alternativeGenome: null,
  referenceGenomeLocation: null,
  alternativeGenomeLocation: null
};

// Contains reference and alternative genomes,
// as well as location within the reference genome, and, possibly, location within alternative genome
// Contains data from user's selection, or data restored from url paramaters
type GenomesAndLocationsPayload = {
  referenceGenome: BriefGenomeSummary | null;
  alternativeGenome: BriefGenomeSummary | null;
  referenceGenomeLocation: GenomicLocation | null;
  alternativeGenomeLocation: GenomicLocation | null;
};

const structuralVariantsGeneralSlice = createSlice({
  name: 'structural-variants-general',
  initialState,
  reducers: {
    setGenomesAndLocations(
      state,
      action: PayloadAction<GenomesAndLocationsPayload>
    ) {
      const {
        referenceGenome,
        alternativeGenome,
        referenceGenomeLocation,
        alternativeGenomeLocation
      } = action.payload;
      state.referenceGenome = referenceGenome;
      state.alternativeGenome = alternativeGenome;
      state.referenceGenomeLocation = referenceGenomeLocation;
      state.alternativeGenomeLocation = alternativeGenomeLocation;
    },
    setReferenceGenome(
      state,
      action: PayloadAction<{ genome: BriefGenomeSummary }>
    ) {
      const { genome } = action.payload;
      state.referenceGenome = genome;
      state.alternativeGenome = null;
    },
    setReferenceGenomeLocation(state, action: PayloadAction<GenomicLocation>) {
      state.referenceGenomeLocation = action.payload;
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

export const {
  setGenomesAndLocations,
  setReferenceGenome,
  setReferenceGenomeLocation,
  setAlternativeGenome
} = structuralVariantsGeneralSlice.actions;

export default structuralVariantsGeneralSlice.reducer;
