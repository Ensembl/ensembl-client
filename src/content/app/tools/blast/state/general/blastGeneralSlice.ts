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

type BlastView =
  | 'blast-form' //new job form
  | 'unviewed-submissions' //unviewed jobs
  | 'submissions-list' // jobs list (list of viewed)
  | 'submission-results'; // one submission result

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
