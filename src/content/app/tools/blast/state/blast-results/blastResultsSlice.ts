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
  getAllBlastSubmissions,
  updateBlastSubmission as updateBlastSubmissionInStorage,
  deleteBlastSubmission as deleteBlastSubmissionFromStorage,
  deleteExpiredBlastSubmissions as deleteExpiredBlastSubmissionsFromStorage
} from 'src/content/app/tools/blast/services/blastStorageService';

import { submitBlast } from '../blast-api/blastApiSlice';

import type {
  MandatoryBlastParameterName,
  OptionalBlastParameterName,
  SequenceType
} from 'src/content/app/tools/blast/types/blastSettings';
import type { BlastJobResult as BlastJobResultsFromAPI } from 'src/content/app/tools/blast/types/blastJob';
import type { Species } from 'src/content/app/tools/blast/state/blast-form/blastFormSlice';

export type JobStatus =
  | 'RUNNING' // the job is currently being processed
  | 'FINISHED' // job has finished, and the results can then be retrieved
  | 'FAILURE' // the job failed
  | 'ERROR' // an error occurred attempting to get the job status — TODO: ask backend to represent this as a 500 error?
  | 'NOT_FOUND'; // TODO: ask backend to represent this as a 404 error?

export type MandatorySubmissionParameters = Record<
  MandatoryBlastParameterName,
  string
>;
export type OptionalSubmissionParameters = Partial<
  Record<OptionalBlastParameterName, string>
>;
export type BlastSubmissionParameters = MandatorySubmissionParameters &
  OptionalSubmissionParameters & {
    stype: SequenceType;
  };

export type BlastJob = {
  jobId: string;
  sequenceId: number;
  genomeId: string;
  status: JobStatus;
  data: null | BlastJobResultsFromAPI;
};

export type BlastJobWithResults = Omit<BlastJob, 'data'> & {
  data: BlastJobResultsFromAPI;
};

export type BlastSubmission = {
  id: string;
  submittedData: {
    species: Species[];
    sequences: { id: number; value: string }[]; // TODO: consider whether to have strings or parsed sequences
    preset: string;
    submissionName: string;
    parameters: BlastSubmissionParameters;
  };
  results: BlastJob[];
  submittedAt: number; // timestamp, in milliseconds
  seen: boolean; // whether the user has viewed the results of this submission
};

export type BlastResultsUI = {
  unviewedJobsPage: {
    expandedSubmissionIds: string[];
  };
  viewedJobsPage: {
    expandedSubmissionIds: string[];
  };
};

export type BlastResultsState = {
  submissions: { [submissionId: string]: BlastSubmission };
  ui: BlastResultsUI;
};

export const restoreBlastSubmissions = createAsyncThunk(
  'blast-results/restore-blast-submissions',
  async () => {
    await deleteExpiredBlastSubmissionsFromStorage();
    return (await getAllBlastSubmissions()) || {};
  }
);

export const deleteBlastSubmission = createAsyncThunk(
  'blast-results/delete-blast-submissions',
  async (submissionId: string) => {
    await deleteBlastSubmissionFromStorage(submissionId);
    return submissionId;
  }
);

export const markBlastSubmissionAsSeen = createAsyncThunk(
  'blast-results/mark-blast-submission-as-seen',
  async (submissionId: string) => {
    await updateBlastSubmissionInStorage(submissionId, { seen: true });

    return submissionId;
  }
);

export const initialBlastResultsState: BlastResultsState = {
  submissions: {},
  ui: {
    unviewedJobsPage: {
      expandedSubmissionIds: []
    },
    viewedJobsPage: {
      expandedSubmissionIds: []
    }
  }
};
const blastResultsSlice = createSlice({
  name: 'blast-results',
  initialState: initialBlastResultsState,
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
      const submission = state.submissions[submissionId];
      const job = submission.results.find((job) => job.jobId === jobId);
      if (job) {
        Object.assign(job, fragment);
      }
    },
    updateSubmissionUi(
      state,
      action: PayloadAction<{
        fragment: Partial<BlastResultsUI>;
      }>
    ) {
      const { fragment } = action.payload;
      state.ui = { ...state.ui, ...fragment };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(restoreBlastSubmissions.fulfilled, (state, { payload }) => {
      state.submissions = payload;
    });
    builder.addCase(deleteBlastSubmission.fulfilled, (state, { payload }) => {
      const submissionId = payload;
      delete state.submissions[submissionId];
    });
    builder.addCase(
      markBlastSubmissionAsSeen.fulfilled,
      (state, { payload }) => {
        const submissionId = payload;
        const submission = state.submissions[submissionId];
        if (submission) {
          submission.seen = true;
        }
      }
    );
    builder.addMatcher(submitBlast.matchFulfilled, (state, { payload }) => {
      const { submissionId, submission } = payload;
      state.submissions[submissionId] = submission;
    });
  }
});

export const { updateJob, updateSubmissionUi } = blastResultsSlice.actions;

export default blastResultsSlice.reducer;
