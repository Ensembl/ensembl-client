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

import { getAllBlastSubmissions } from 'src/content/app/tools/blast/services/blastStorageService';

import { submitBlast } from '../blast-api/blastApiSlice';

import type { BlastParameterName } from 'src/content/app/tools/blast/types/blastSettings';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

export type JobStatus =
  | 'RUNNING' // the job is currently being processed
  | 'FINISHED' // job has finished, and the results can then be retrieved
  | 'FAILURE' // the job failed
  | 'ERROR' // an error occurred attempting to get the job status — TODO: ask backend to represent this as a 500 error?
  | 'NOT_FOUND'; // TODO: ask backend to represent this as a 404 error?

export type BlastSubmission = {
  submission: {
    species: Species[];
    sequences: string[]; // Or perhaps parsed sequences?
    parameters: Partial<Record<BlastParameterName, string>>;
  };
  results: Array<{
    jobId: string;
    status: JobStatus;
    seen: boolean;
    data: null; // TODO: add data type
  }>;
  submittedAt: number; // timestamp
};

export type BlastJob = BlastSubmission['results'][number];

type BlastResultsState = {
  [submissionId: string]: BlastSubmission;
};

export const restoreBlastSubmissions = createAsyncThunk(
  'blast-results/restore-blast-submissions',
  () => getAllBlastSubmissions() || {}
);

const blastResultsSlice = createSlice({
  name: 'blast-results',
  initialState: {} as BlastResultsState,
  reducers: {
    updateJob(
      state,
      action: PayloadAction<{
        submissionId: string;
        jobId: string;
        fragment: Partial<BlastJob>;
      }>
    ) {
      const { submissionId, jobId, fragment } = action.payload;
      const submission = state[submissionId];
      const job = submission.results.find((job) => job.jobId === jobId);
      Object.assign(job, fragment);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(restoreBlastSubmissions.fulfilled, (state, { payload }) => {
      return payload;
    });
    builder.addMatcher(submitBlast.matchFulfilled, (state, { payload }) => {
      const { submissionId, submission } = payload;
      state[submissionId] = submission;
    });
  }
});

export const { updateJob } = blastResultsSlice.actions;

export default blastResultsSlice.reducer;
