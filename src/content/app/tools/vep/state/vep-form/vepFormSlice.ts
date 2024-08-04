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

import {
  createSlice,
  createAsyncThunk,
  nanoid,
  type PayloadAction
} from '@reduxjs/toolkit';

import {
  getVepSubmission,
  saveVepSubmission,
  getVepSubmissionWithoutInputFile,
  getUncompletedVepSubmissionWithoutInputFile,
  updateVepSubmission
} from 'src/content/app/tools/vep/services/vepStorageService';

import {
  getTemporaryVepSubmissionId,
  getVepFormState
} from './vepFormSelectors';

import { addSubmission } from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice';

import type {
  VepFormConfig,
  VepFormParameterName
} from 'src/content/app/tools/vep/types/vepFormConfig';
import type { VepSelectedSpecies } from 'src/content/app/tools/vep/types/vepSubmission';
import type {
  VepSubmission as StoredVepSubmission,
  VepSubmissionWithoutInputFile
} from 'src/content/app/tools/vep/types/vepSubmission';
import type { RootState } from 'src/store';

type VepFormParameters = Partial<
  Record<VepFormParameterName, string | boolean>
>;

export type VepFormState = {
  submissionId: string | null; // temporary client-side submission id
  selectedSpecies: VepSelectedSpecies | null;
  submissionName: string | null;
  inputText: string | null;
  inputFileName: string | null;
  isInputCommitted: boolean;
  parameters: VepFormParameters;
};

export const initialState: VepFormState = {
  submissionId: null,
  selectedSpecies: null,
  submissionName: null,
  inputText: '',
  inputFileName: null,
  isInputCommitted: false,
  parameters: {}
};

/**
 * This action checks if there is an already saved, but unsubmitted, VEP form data.
 *   - If yes, it copies its information into redux state
 *   - If not, it creates and saves a data container for VEP form data
 */
export const initialiseVepForm = createAsyncThunk(
  'vep-form/initialiseVepForm',
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const temporaryVepSubmissionId = getTemporaryVepSubmissionId(state);

    if (temporaryVepSubmissionId) {
      // don't do anything; redux state has already been initialised
      return;
    }

    const storedVepFormData =
      await getUncompletedVepSubmissionWithoutInputFile();

    if (storedVepFormData) {
      return {
        submissionId: storedVepFormData.id
      };
    }

    const temporaryId = `temporary-${nanoid()}`;

    const initialSubmissionData: StoredVepSubmission = {
      id: temporaryId,
      species: null,
      submissionName: null,
      inputText: null,
      inputFile: null,
      parameters: {},
      createdAt: Date.now(),
      submittedAt: null,
      status: 'NOT_SUBMITTED',
      resultsSeen: false
    };
    await saveVepSubmission(initialSubmissionData);

    return {
      submissionId: temporaryId
    };
  }
);

export const updateInputFile = createAsyncThunk(
  'vep-form/updateInputFile',
  async (file: File, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const temporaryVepSubmissionId = getTemporaryVepSubmissionId(state);
    const storedSubmission = await getVepSubmission(
      temporaryVepSubmissionId as string
    );

    if (!storedSubmission) {
      return;
    }

    const updatedSubmission = {
      ...storedSubmission,
      inputText: null,
      inputFile: file
    };

    await updateVepSubmission(storedSubmission.id, updatedSubmission);

    return {
      fileName: file.name
    };
  }
);

export const clearVariantsInput = createAsyncThunk(
  'vep-form/clearVariantsInput',
  async (_, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const temporaryVepSubmissionId = getTemporaryVepSubmissionId(state);
    const storedSubmission = await getVepSubmission(
      temporaryVepSubmissionId as string
    );

    if (!storedSubmission) {
      return;
    }

    const updatedSubmission = {
      ...storedSubmission,
      inputText: null,
      inputFile: null
    };

    await updateVepSubmission(storedSubmission.id, updatedSubmission);

    return {
      inputText: null,
      fileName: null
    };
  }
);

/**
 * Upon VEP form submission, do the following:
 * - Update saved form data with data from redux store
 * - Change status of saved VEP form data to SUBMITTING
 * - Clear redux state
 */
export const onVepFormSubmission = createAsyncThunk(
  'vep-form/onVepFormSubmission',
  async ({ submissionId }: { submissionId: string }, thunkApi) => {
    const state = thunkApi.getState() as RootState;
    const dispatch = thunkApi.dispatch;
    const vepFormState = getVepFormState(state);

    await updateVepSubmission(submissionId, {
      species: vepFormState.selectedSpecies,
      submissionName: vepFormState.submissionName,
      inputText: vepFormState.inputText,
      parameters: vepFormState.parameters,
      submittedAt: Date.now(),
      status: 'SUBMITTING'
    });

    const updatedStoredSubmission =
      await getVepSubmissionWithoutInputFile(submissionId);

    dispatch(
      addSubmission(updatedStoredSubmission as VepSubmissionWithoutInputFile)
    );
  }
);

const vepFormSlice = createSlice({
  name: 'vep-form',
  initialState,
  reducers: {
    setSelectedSpecies: (
      state,
      action: PayloadAction<{ species: VepSelectedSpecies }>
    ) => {
      // NOTE: selecting a new species means that form parameters,
      // whose values might remain from previously selected species,
      // should be reset
      state.selectedSpecies = action.payload.species;
      state.parameters = {};
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
    updateInputCommittedFlag: (state, action: PayloadAction<boolean>) => {
      state.isInputCommitted = action.payload;
    },
    resetForm: (state) => {
      return {
        ...initialState,
        submissionId: state.submissionId
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initialiseVepForm.fulfilled, (state, action) => {
      if (action.payload) {
        state.submissionId = action.payload.submissionId;
      }
    });

    builder.addCase(updateInputFile.fulfilled, (state, action) => {
      if (action.payload) {
        state.inputFileName = action.payload.fileName;
      }
    });

    builder.addCase(clearVariantsInput.fulfilled, (state) => {
      state.inputFileName = null;
      state.inputText = null;
    });

    builder.addCase(onVepFormSubmission.fulfilled, () => {
      return initialState;
    });
  }
});

export const {
  setSelectedSpecies,
  setDefaultParameters,
  updateParameters,
  updateSubmissionName,
  updateInputText,
  updateInputCommittedFlag,
  resetForm
} = vepFormSlice.actions;

export default vepFormSlice.reducer;
