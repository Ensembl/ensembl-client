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

import { createSlice } from '@reduxjs/toolkit';

import { fetchGenomeInfo } from 'src/shared/state/genome/genomeApiSlice';

import type { GenomeInfo } from './genomeTypes';

export type GenomesState = Readonly<{
  genomeTagToGenomeIdMap: Record<string, string>; // maps the id used in the url to the genome uuid
  genomes: Record<string, GenomeInfo>;
}>;

const defaultGenomeState: GenomesState = {
  genomeTagToGenomeIdMap: {},
  genomes: {}
};
const genomeSlice = createSlice({
  name: 'genomeInfo',
  initialState: defaultGenomeState,
  reducers: {},
  extraReducers: (builder) => {
    // GenomeInfo
    builder.addMatcher(fetchGenomeInfo.matchFulfilled, (state, { payload }) => {
      const { genomeId, genomeTag, genomeInfo } = payload;

      state.genomes[genomeId] = genomeInfo;

      if (genomeTag) {
        // TODO: fetchGenomeInfo function is going to retrieve genome info using the id from the url.
        // Consider what should happen if the id from the url becomes associated with a more recent genome id.
        // We should probably check whether state.genomeTagToGenomeIdMap[genomeTag] exists before updating it
        state.genomeTagToGenomeIdMap[genomeTag] = genomeId;
      } else {
        state.genomeTagToGenomeIdMap[genomeId] = genomeId;
      }
    });
  }
});

export default genomeSlice.reducer;
