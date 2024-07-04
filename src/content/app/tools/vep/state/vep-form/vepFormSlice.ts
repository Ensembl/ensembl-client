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

import type {
  VepFormConfig,
  VepFormParameterName
} from 'src/content/app/tools/vep/types/vepFormConfig';
import type { VepSelectedSpecies } from 'src/content/app/tools/vep/types/vepSubmission';

type VepFormParameters = Partial<
  Record<VepFormParameterName, string | boolean>
>;

export type VepFormState = {
  selectedSpecies: VepSelectedSpecies | null;
  submissionName: string | null;
  inputText: string;
  inputFile: File | null; // <-- this is temporary; we should not store potentially huge files in-memory
  isInputCommitted: boolean;
  parameters: VepFormParameters;
};

export const initialState: VepFormState = {
  selectedSpecies: null,
  submissionName: null,
  inputText: '',
  inputFile: null,
  isInputCommitted: false,
  parameters: {}
};

const vepFormSlice = createSlice({
  name: 'vep-form',
  initialState,
  reducers: {
    setSelectedSpecies: (
      state,
      action: PayloadAction<{ species: VepSelectedSpecies }>
    ) => {
      state.selectedSpecies = action.payload.species;
    },
    // replace the whole parameters object in the state
    setDefaultParameters: (state, action: PayloadAction<VepFormConfig>) => {
      const defaultParameters: VepFormParameters = {};

      for (const [parameterName, parameter] of Object.entries(
        action.payload.parameters
      )) {
        defaultParameters[parameterName as VepFormParameterName] =
          parameter.default_value;
      }

      state.parameters = defaultParameters;
    },
    // update one or more of the parameters object in the state
    updateParameters: (state, action: PayloadAction<VepFormParameters>) => {
      state.parameters = {
        ...state.parameters,
        ...action.payload
      };
    },
    updateSubmissionName: (state, action: PayloadAction<string>) => {
      state.submissionName = action.payload;
    },
    updateInputText: (state, action: PayloadAction<string>) => {
      state.inputText = action.payload;
    },
    updateInputFile: (state, action: PayloadAction<File>) => {
      state.inputFile = action.payload;
    },
    updateInputCommittedFlag: (state, action: PayloadAction<boolean>) => {
      state.isInputCommitted = action.payload;
    }
  }
});

export const {
  setSelectedSpecies,
  setDefaultParameters,
  updateParameters,
  updateSubmissionName,
  updateInputText,
  updateInputFile,
  updateInputCommittedFlag
} = vepFormSlice.actions;

export default vepFormSlice.reducer;
