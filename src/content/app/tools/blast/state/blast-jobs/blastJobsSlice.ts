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

import { BlastFormState } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';
import { LoadingState } from 'src/shared/types/loading-state';

export type BlastJobResult = {
  jobIds: string[];
};

type BlastJob = {
  jobId: number;
  jobData: BlastFormState;
  result: BlastJobResult | null;
  status: LoadingState;
  error?: unknown;
};

export type BlastJobsState = {
  jobs: BlastJob[];
};

export const initialState: BlastJobsState = {
  jobs: []
};

type SaveBlastJobResultPayload = Omit<BlastJob, 'jobData'>;

const blastJobsSlice = createSlice({
  name: 'blast-jobs',
  initialState,
  reducers: {
    saveBlastJob(state, action: PayloadAction<{ jobData: BlastFormState }>) {
      const jobId = state.jobs.length;
      state.jobs.push({
        status: LoadingState.LOADING,
        jobId,
        jobData: action.payload.jobData,
        result: null
      });
    },
    saveBlastJobResult(
      state,
      action: PayloadAction<SaveBlastJobResultPayload>
    ) {
      const { jobId, result, status, error } = action.payload;
      state.jobs[jobId].result = result;
      state.jobs[jobId].error = error;
      state.jobs[jobId].status = status;
    }
  }
});

export const { saveBlastJob, saveBlastJobResult } = blastJobsSlice.actions;

export default blastJobsSlice.reducer;
