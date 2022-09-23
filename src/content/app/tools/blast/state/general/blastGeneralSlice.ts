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

/**
 * LANGUAGE NOTE:
 *
 * We use the following terminology in the codebase:
 * - A BLAST submission is a result of submitting the BLAST form.
 *   Since a form may include multiple query sequences and multiple target species,
 *   a BLAST submission may contain one or more BLAST jobs
 * - A BLAST job is the result of running the BLAST program for one query sequence against one species
 *
 * Confusingly, the UI uses the terms "submission" and "job" interchangeably,
 * especially in the buttons "New job", "Unviewed jobs", "Jobs list", in order to save screen space
 *
 */

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
