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
import cloneDeep from 'lodash/cloneDeep';

import type { ParsedInputSequence } from 'src/content/app/tools/blast/types/parsedInputSequence';

type BlastFormState = {
  step: 'sequences' | 'species'; // will only be relevant on smaller screens
  sequences: ParsedInputSequence[];
  shouldAppendEmptyInput: boolean;
};

const initialState: BlastFormState = {
  step: 'sequences',
  sequences: [],
  shouldAppendEmptyInput: true
};

const blastFormSlice = createSlice({
  name: 'blast-form',
  initialState,
  reducers: {
    setSequences(
      state,
      action: PayloadAction<{ sequences: ParsedInputSequence[] }>
    ) {
      const { sequences } = action.payload;
      state.sequences = sequences;
      state.shouldAppendEmptyInput = Boolean(!sequences.length);
    },
    updateEmptyInputDisplay(state, action: PayloadAction<boolean>) {
      state.shouldAppendEmptyInput = action.payload;
    },
    switchToSequencesStep(state) {
      state.step = 'sequences';
    },
    switchToSpeciesStep(state) {
      state.step = 'species';
    },
    clearForm() {
      return cloneDeep(initialState);
    }
  }
});

export const { setSequences, updateEmptyInputDisplay, switchToSpeciesStep } =
  blastFormSlice.actions;
export default blastFormSlice.reducer;
