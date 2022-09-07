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

// one job is one sequence against one or multiple species
// each sequence is one job and user can submit multiple sequence against one or more species in one form which will become one submission will multiple jobs
// There can be confusion with the language on the UI which mention "jobs"
type BlastView =
  | 'blast-form' //new job form - form for submitting a new batch of BLASTS jobs
  | 'unviewed-submissions' //unviewed BLAST submissions - once the submission result are viewed they are moved to job list
  | 'submissions-list' //list of viewed BLAST submissions
  | 'submission-results'; //results of BLAST jobs in a single submission

type BlastGeneralState = {
  view: BlastView;
};

export const initialState: BlastGeneralState = {
  view: 'blast-form'
};

const blastGeneralSlice = createSlice({
  name: 'blast-general',
  initialState,
  reducers: {
    setBlastView(state, action: PayloadAction<BlastView>) {
      state.view = action.payload;
    }
  }
});

export const { setBlastView } = blastGeneralSlice.actions;

export default blastGeneralSlice.reducer;
