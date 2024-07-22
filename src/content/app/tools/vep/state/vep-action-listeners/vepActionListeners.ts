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

import { type PayloadAction } from '@reduxjs/toolkit';

import config from 'config';

import { vepFormSubmit } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';
import {
  updateSubmission,
  changeSubmissionId
} from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice';

import type { AppDispatch } from 'src/store';
import type {
  AppStartListening,
  AppListenerEffectAPI
} from 'src/listenerMiddleware';

/**
 * 1. Change submission id from the temporary client-side one to the permanentt one assigned by the server
 *   - In Redux
 *   - In indexedDB
 * 2. Change submission status:
 *   - SUBMITTED if submitted
 *   - UNSUCCESSFUL_SUBMISSION if failed to submit
 * - Start polling for submission status
 *   - SUBMITTED — continue polling
 *   - RUNNING - update status (in redux and in indexedDB); but continue polling
 *   - SUCCEEDED, FAILED, CANCELLED - update status (in redux and in indexedDB), and stop polling
 */

const vepFormSuccessfulSubmissionListener = {
  matcher: vepFormSubmit.matchFulfilled,
  effect: async (
    action: PayloadAction<{
      // submission_id: string;
      old_submission_id: string;
      new_submission_id: string;
    }>,
    listenerApi: AppListenerEffectAPI
  ) => {
    const { dispatch } = listenerApi;
    const { old_submission_id, new_submission_id } = action.payload;
    await dispatch(
      changeSubmissionId({
        oldId: old_submission_id,
        newId: new_submission_id,
        fragment: { status: 'SUBMITTED' }
      })
    );

    pollForSubmissionStatus({
      submissionId: new_submission_id,
      dispatch
    });
  }
};

const vepFormUnsuccessfulSubmissionListener = {
  matcher: vepFormSubmit.matchRejected,
  effect: async (
    action: PayloadAction<{
      submission_id: string;
    }>,
    listenerApi: AppListenerEffectAPI
  ) => {
    const { dispatch } = listenerApi;
    const { submission_id } = action.payload;

    await dispatch(
      updateSubmission({
        submissionId: submission_id,
        fragment: { status: 'UNSUCCESSFUL_SUBMISSION' }
      })
    );
  }
};

const temporaryVepSubmissionStatuses = ['RUNNING'] as const;

const finalVepSubmissionStatuses = [
  'SUCCEEDED',
  'FAILED',
  'CANCELLED'
] as const;

const pollForSubmissionStatus = async ({
  submissionId,
  dispatch
}: {
  submissionId: string;
  dispatch: AppDispatch;
}) => {
  const url = `${config.toolsApiBaseUrl}/vep/submissions/${submissionId}/status`;

  let lastSubmissionStatus = 'SUBMITTED';
  let continuePolling = true;

  while (continuePolling) {
    await pause(15);
    const response = await fetch(url);
    if (!response.ok) {
      continue;
    }

    const { status } = await response.json();

    if (
      temporaryVepSubmissionStatuses.includes(status) &&
      status !== lastSubmissionStatus
    ) {
      lastSubmissionStatus = status;
      await dispatch(updateSubmission({ submissionId, fragment: { status } }));
    } else if (finalVepSubmissionStatuses.includes(status)) {
      continuePolling = false;
      await dispatch(updateSubmission({ submissionId, fragment: { status } }));
    }
  }
};

const pause = async (seconds: number) => {
  const milliseconds = seconds * 1000;
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

export const startVepListeners = (startListening: AppStartListening) => {
  // startListening(vepFormConfigQueryListener);
  startListening(vepFormSuccessfulSubmissionListener);
  startListening(vepFormUnsuccessfulSubmissionListener as any);
};
