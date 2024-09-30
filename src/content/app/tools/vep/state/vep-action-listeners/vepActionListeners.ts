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

import { vepFormSubmit } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';
import {
  updateSubmission,
  changeSubmissionId,
  deleteSubmission,
  restoreVepSubmissions,
  type VepSubmissionsInState
} from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice';

import VepSubmissionStatusPolling from 'src/content/app/tools/vep/state/vep-action-listeners/vepSubmissionStatusPolling';

import type { VepSubmissionWithoutInputFile } from 'src/content/app/tools/vep/types/vepSubmission';
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
 * 3. Start polling for submission status
 *   - SUBMITTED — continue polling
 *   - RUNNING - update status (in redux and in indexedDB); but continue polling
 *   - SUCCEEDED, FAILED, CANCELLED - update status (in redux and in indexedDB), and stop polling
 * 4. Note that user can refresh (or close/open) the browser while there are still some submissions pending.
 *    Therefore, listen to the restore VEP submissions event, filter unfinished submissions, and poll for their status.
 * 5. Note that user can delete a submission while polling is still in progress.
 *    Thus, listen to delete submission actions, and remove deleted submissions from polling.
 */

const vepSubmissionStatusPolling = new VepSubmissionStatusPolling();

const vepFormSuccessfulSubmissionListener = {
  matcher: vepFormSubmit.matchFulfilled,
  effect: async (
    action: PayloadAction<{
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

    vepSubmissionStatusPolling.enqueueSubmission({
      submission: {
        id: new_submission_id,
        status: 'SUBMITTED'
      },
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

const vepSubmissionsRestoreListener = {
  actionCreator: restoreVepSubmissions.fulfilled,
  effect: async (
    action: PayloadAction<VepSubmissionsInState>,
    listenerApi: AppListenerEffectAPI
  ) => {
    // only respond to the first action
    // (this action should happen only once over the lifetime of the page; but due to double execution useEffect in React StrictMode, it will be called twice in dev)
    listenerApi.unsubscribe();
    const { dispatch } = listenerApi;

    const unresolvedSubmissions: VepSubmissionWithoutInputFile[] = [];
    const interruptedSubmissions: VepSubmissionWithoutInputFile[] = [];

    for (const submission of Object.values(action.payload)) {
      if (submission.status === 'SUBMITTING') {
        interruptedSubmissions.push(submission);
      } else if (['SUBMITTED', 'RUNNING'].includes(submission.status)) {
        unresolvedSubmissions.push(submission);
      }
    }

    vepSubmissionStatusPolling.processSubmissionsOnStartup({
      submissions: unresolvedSubmissions,
      dispatch
    });

    // If at startup there are submissions with a "SUBMITTING" status,
    // it means that the browser was refreshed/closed
    // before submission data has been successfully transmitted to the server.
    // Mark these submissions as failed.
    for (const submission of interruptedSubmissions) {
      await dispatch(
        updateSubmission({
          submissionId: submission.id,
          fragment: { status: 'UNSUCCESSFUL_SUBMISSION' }
        })
      );
    }
  }
};

const vepSubmissionDeleteListener = {
  actionCreator: deleteSubmission.fulfilled,
  effect: async (
    action: PayloadAction<{
      submissionId: string;
    }>
  ) => {
    const { submissionId } = action.payload;
    vepSubmissionStatusPolling.removeSubmission(submissionId);
  }
};

export const startVepListeners = (startListening: AppStartListening) => {
  startListening(vepFormSuccessfulSubmissionListener);
  startListening(vepFormUnsuccessfulSubmissionListener as any);
  startListening(vepSubmissionDeleteListener);
  startListening(vepSubmissionsRestoreListener);
};
