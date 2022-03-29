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

import type { PayloadAction, ListenerEffectAPI } from '@reduxjs/toolkit';

import config from 'config';

import { submitBlast } from '../blast-api/blastApiSlice';
import {
  restoreBlastSubmissions,
  updateJob
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import {
  saveBlastSubmission,
  updateSavedBlastJob
} from 'src/content/app/tools/blast/services/blastStorageService';

import type { BlastSubmission } from '../blast-results/blastResultsSlice';
import type { RootState, AppDispatch } from 'src/store';

export const submitBlastListener = {
  matcher: submitBlast.matchFulfilled,
  effect: async (
    action: PayloadAction<{
      submissionId: string;
      submission: BlastSubmission;
    }>,
    listenerApi: ListenerEffectAPI<RootState, AppDispatch>
  ) => {
    const { submissionId, submission } = action.payload;
    const { dispatch } = listenerApi;

    await saveBlastSubmission(submissionId, submission);

    const jobIds = submission.results.map(({ jobId }) => ({
      submissionId,
      jobId
    }));

    for await (const job of pollJobStatuses(jobIds)) {
      dispatch(updateJob(job));
      await updateSavedBlastJob(job);
    }
  }
};

export const resforeBlastSubmissionsListener = {
  actionCreator: restoreBlastSubmissions.fulfilled,
  effect: async (
    action: PayloadAction<Record<string, BlastSubmission>>,
    listenerApi: ListenerEffectAPI<RootState, AppDispatch>
  ) => {
    const { dispatch } = listenerApi;

    const jobIds = Object.entries(action.payload).flatMap(
      ([submissionId, submission]) =>
        submission.results
          .filter((job) => job.status === 'RUNNING')
          .map(({ jobId }) => ({
            submissionId,
            jobId
          }))
    );

    if (!jobIds.length) {
      return;
    }

    for await (const job of pollJobStatuses(jobIds)) {
      dispatch(updateJob(job));
      await updateSavedBlastJob(job);
    }
  }
};

async function* pollJobStatuses(
  jobs: Array<{ submissionId: string; jobId: string }>
) {
  while (jobs.length) {
    for (const job of [...jobs]) {
      const { status } = await fetchJobStatus(job.jobId);

      if (['FINISHED', 'FAILURE'].includes(status)) {
        jobs = jobs.filter(({ jobId }) => jobId !== job.jobId);
        yield {
          ...job,
          fragment: { status }
        };
      }
    }

    await timer(5000);
  }
}

const timer = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const fetchJobStatus = async (jobId: string) => {
  const endpointURL = `${config.toolsApiBaseUrl}/blast/jobs/status/${jobId}`;

  const response = await fetch(endpointURL, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error();
  }
};
