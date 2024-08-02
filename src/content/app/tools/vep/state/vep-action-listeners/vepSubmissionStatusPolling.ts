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

import config from 'config';

import { updateSubmission } from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSlice';

import type { AppDispatch } from 'src/store';
import type { SubmissionStatus } from 'src/content/app/tools/vep/types/vepSubmission';

export const POLLING_INTERVAL = 15 * 1000;

type PolledSubmission = {
  id: string;
  status: SubmissionStatus;
};

const unsettledSubmissionsStatuses: SubmissionStatus[] = [
  'SUBMITTED',
  'RUNNING'
];

class VepSubmissionStatusPolling {
  submissions: Record<string, PolledSubmission> = {};
  queue: string[] = [];
  isProcessing: boolean = false;
  dispatch: AppDispatch | null = null;

  enqueueSubmission = ({
    submission,
    dispatch
  }: {
    submission: PolledSubmission;
    dispatch: AppDispatch;
  }) => {
    this.submissions[submission.id] = submission;
    this.queue.unshift(submission.id);
    this.dispatch = dispatch;

    if (!this.isProcessing) {
      this.processQueueWithDelay();
    }
  };

  processQueueWithDelay = async () => {
    if (!this.queue.length) {
      this.isProcessing = false;
      return;
    }
    this.isProcessing = true;

    await this.pause();

    const submissionId = this.queue.pop() as string;
    const url = `${config.toolsApiBaseUrl}/vep/submissions/${submissionId}/status`;
    const response = await fetch(url);
    await this.handleResponse({ submissionId, response });

    // this makes it a recursive function; but by avoiding the return statement, we shouldn't be leaking memory
    this.processQueueWithDelay();
  };

  // method to run if there are any submissions with unresolved statuses in the browser storage
  // when the app starts up
  processSubmissionsOnStartup = async ({
    submissions,
    dispatch
  }: {
    submissions: PolledSubmission[];
    dispatch: AppDispatch;
  }) => {
    this.dispatch = dispatch;

    // query submission statuses one right after the other without the artificial delay,
    // because it is quite likely that they have finished running
    for (const submission of submissions) {
      this.submissions[submission.id] = submission;
      const submissionId = submission.id;
      const url = `${config.toolsApiBaseUrl}/vep/submissions/${submissionId}/status`;
      const response = await fetch(url);
      await this.handleResponse({ submissionId, response });
    }

    // in case there are any submissions with unresolved statuses, continue polling their statuses as usual
    this.processQueueWithDelay();
  };

  handleResponse = async ({
    submissionId,
    response
  }: {
    submissionId: string;
    response: Response;
  }) => {
    if (!response.ok) {
      if (response.status >= 500) {
        // try later
        this.queue.unshift(submissionId);
      } else if (response.status === 404)
        // fail submission
        this.reportSubmissionStatus({
          submissionId,
          status: 'FAILED'
        });
    }

    const { status } = await response.json();

    if (!this.submissions[submissionId]) {
      // this should not happen
      return;
    }

    if (status !== this.submissions[submissionId].status) {
      this.submissions[submissionId].status = status;
      this.reportSubmissionStatus({
        submissionId,
        status
      });
    } else {
      // put submission id back in the queue to query its status again later
      this.queue.unshift(submissionId);
    }
  };

  reportSubmissionStatus = (submission: {
    submissionId: string;
    status: SubmissionStatus;
  }) => {
    if (!this.dispatch) {
      // should not happen
      return;
    }
    // dispatch an action that will update both the redux state and the browser permanent storage
    // remove submission with this id
    this.dispatch(
      updateSubmission({
        submissionId: submission.submissionId,
        fragment: { status: submission.status }
      })
    );

    // if status is not final status, add submission back to the queue; otherwise, clear the submission
    if (unsettledSubmissionsStatuses.includes(submission.status)) {
      this.queue.unshift(submission.submissionId);
    } else {
      this.removeSubmission(submission.submissionId);
    }
  };

  // Run this when submission has reached its final status, or has been deleted by user
  removeSubmission = (submissionId: string) => {
    if (this.submissions[submissionId]) {
      delete this.submissions[submissionId];
    }
    const submissionIdIndexInQueue = this.queue.findIndex(
      (id) => id === submissionId
    );
    if (submissionIdIndexInQueue !== -1) {
      this.queue.splice(submissionIdIndexInQueue, 1);
    }
  };

  pause = async () => {
    return new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
  };
}

export default VepSubmissionStatusPolling;
