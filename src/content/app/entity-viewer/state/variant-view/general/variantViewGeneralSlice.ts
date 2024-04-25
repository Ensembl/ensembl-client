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

export const views = [
  'default',
  'transcript-consequences',
  'regulatory-consequences',
  'allele-frequencies',
  'genes',
  'variant-phenotypes',
  'gene-phenotypes',
  'publications'
] as const;

export type ViewName = (typeof views)[number];

export type StateForVariant = {
  view: ViewName;
  alleleId: string | null;
  expandedTranscriptConseqeuenceIds: string[];
};

type VariantViewGeneralState = {
  [genomeId: string]: {
    [variantId: string]: StateForVariant;
  };
};

const ensurePresenceOfVariantState = (
  state: VariantViewGeneralState,
  genomeId: string,
  variantId: string
) => {
  if (!state[genomeId]) {
    state[genomeId] = {};
  }
  if (!state[genomeId][variantId]) {
    state[genomeId][variantId] = {
      view: 'default',
      alleleId: null,
      expandedTranscriptConseqeuenceIds: []
    };
  }
};

const variantViewGeneralSlice = createSlice({
  name: 'entity-viewer-variant-view-view',
  initialState: {} as VariantViewGeneralState,
  reducers: {
    setView(
      state,
      action: PayloadAction<{
        genomeId: string;
        variantId: string;
        view: ViewName;
      }>
    ) {
      const { genomeId, variantId, view } = action.payload;
      ensurePresenceOfVariantState(state, genomeId, variantId);
      state[genomeId][variantId].view = view;
    },
    setAllele(
      state,
      action: PayloadAction<{
        genomeId: string;
        variantId: string;
        alleleId: string;
      }>
    ) {
      const { genomeId, variantId, alleleId } = action.payload;
      ensurePresenceOfVariantState(state, genomeId, variantId);
      state[genomeId][variantId].alleleId = alleleId;
    }
  }
});

export const { setView, setAllele } = variantViewGeneralSlice.actions;

export default variantViewGeneralSlice.reducer;
