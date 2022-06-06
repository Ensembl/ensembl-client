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

import { createSlice, Action, ThunkAction } from '@reduxjs/toolkit';

import { fetchGenomeInfo } from 'src/shared/state/genome/genomeApiSlice';

import { fetchExampleFocusObjects } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';

import type { GenomeInfo } from './genomeTypes';

export type GenomeInfoState = Readonly<{
  urlToGenomeIdMap: Record<string, string>; // maps the id used in the url to the genome uuid
  genomes: Record<string, GenomeInfo>;
}>;

export const defaultGenomeInfoState: GenomeInfoState = {
  urlToGenomeIdMap: {},
  genomes: {}
};

/**
 * PLAN:
 * - a function that should collect the information about the genome (metadata api in the future; will include dataset ids? release number?)
 * - notice that subsequent requests can be made only after the disambiguation of the url string
 * - a function for fetching karyotype and track categories (to be used in the genome browser)
 * - after fetching a genome, make sure that the user has a selected species for this genome;
 *   if not, add this species automatically using the fetched data
 * - keep in mind the differences between the server-side and the client-side context
 *
 * - when generating urls, we don't necessarily have to generate them via redux (via a genomeId => urlSlug mapping)
 *
 */

export const fetchGenomeData =
  (genomeId: string): ThunkAction<void, any, void, Action<string>> =>
  async (dispatch) => {
    // const result = await dispatch(fetchGenomeInfo.initiate(genomeId));
    // const x = result.data;

    // await Promise.all([
    // dispatch(fetchGenomeInfo(genomeId)),
    // dispatch(fetchGenomeKaryotype(genomeId))
    // ]);

    // dispatch(ensureSpeciesIsCommitted(genomeId));

    dispatch(fetchExampleFocusObjects(genomeId));
  };

// export const fetchGenomeInfo = createAsyncThunk(
//   'genome/fetch_genome_info',
//   async (genomeId: string, thunkAPI) => {
//     const state = thunkAPI.getState() as RootState;
//     const genomeInfo = getGenomeInfoById(state, genomeId);

//     if (genomeInfo) {
//       return; // nothing to do
//     }
//     try {
//       const url = `/api/genomesearch/genome/info?genome_id=${genomeId}`;
//       const response = await apiService.fetch(url);
//       return {
//         [genomeId]: response.genome_info[0] // FIXME: Why the response is an array instead of an object keyed by genomeId?
//       };
//     } catch (error) {
//       thunkAPI.rejectWithValue(error as Error);
//     }
//   }
// );

const defaultGenomeState = {
  genomeInfo: defaultGenomeInfoState as GenomeInfoState // FIXME: is this field even necessary anymore?
};
const genomeSlice = createSlice({
  name: 'genomeInfo',
  initialState: defaultGenomeState,
  reducers: {},
  extraReducers: (builder) => {
    // GenomeInfo
    builder.addMatcher(fetchGenomeInfo.matchFulfilled, (state, { payload }) => {
      const { genomeId, urlSlug, genomeInfo } = payload;

      state.genomeInfo.genomes[genomeId] = genomeInfo;

      if (urlSlug) {
        // TODO: fetchGenomeInfo function is going to retrieve genome info using the id from the url.
        // Consider what should happen if the id from the url becomes associated with a more recent genome id.
        // We should probably check whether state.genomeInfo.urlToGenomeIdMap[urlSlug] exists before updating it
        state.genomeInfo.urlToGenomeIdMap[urlSlug] = genomeId;
      } else {
        state.genomeInfo.urlToGenomeIdMap[genomeId] = genomeId;
      }
    });
  }
});

export default genomeSlice.reducer;
