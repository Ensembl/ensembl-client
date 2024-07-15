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
  type PayloadAction
} from '@reduxjs/toolkit';

import {
  getVepSubmissions,
  updateVepSubmission as updateStoredVepSubmission,
  deleteVepSubmission as deleteStoredVepSubmission
} from 'src/content/app/tools/vep/services/vepStorageService';

import type { VepSubmissionWithoutInputFile } from 'src/content/app/tools/vep/types/vepSubmission';

type VepSubmissionsState = Record<string, VepSubmissionWithoutInputFile>;

export const restoreVepSubmissions = createAsyncThunk(
  'vep-submissions/restoreSubmissions',
  async () => {
    const storedSubmissions = await getVepSubmissions();
    const newState: VepSubmissionsState = {};
    for (const submission of storedSubmissions) {
      newState[submission.id] = submission;
    }

    return newState;
  }
);

export const updateSubmission = createAsyncThunk(
  'vep-submissions/updateSubmission',
  async (params: {
    submissionId: string;
    fragment: Partial<Omit<VepSubmissionWithoutInputFile, 'inputFileName'>>;
  }) => {
    const { submissionId, fragment } = params;
    await updateStoredVepSubmission(submissionId, fragment);

    return {
      submissionId,
      fragment
    };
  }
);

export const deleteSubmission = createAsyncThunk(
  'vep-submissions/deleteSubmission',
  async (params: { submissionId: string }) => {
    const { submissionId } = params;

    await deleteStoredVepSubmission(submissionId);

    return params;
  }
);

const vepSubmissionsSlice = createSlice({
  name: 'vep-submissions',
  initialState: {} as VepSubmissionsState,
  reducers: {
    addSubmission: (
      state,
      action: PayloadAction<VepSubmissionWithoutInputFile>
    ) => {
      const submission = action.payload;
      state[submission.id] = submission;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(restoreVepSubmissions.fulfilled, (_, action) => {
      return action.payload;
    });

    builder.addCase(updateSubmission.fulfilled, (state, action) => {
      const { submissionId, fragment } = action.payload;
      const submission = state[submissionId];

      if (submission) {
        const updatedSubmission = {
          ...submission,
          ...fragment
        };
        state[submissionId] = updatedSubmission;
      }
    });

    builder.addCase(deleteSubmission.fulfilled, (state, action) => {
      const { submissionId } = action.payload;
      delete state[submissionId];
    });
  }
});

export default vepSubmissionsSlice.reducer;
