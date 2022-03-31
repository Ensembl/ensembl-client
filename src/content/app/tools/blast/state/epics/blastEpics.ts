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
  from,
  timer,
  Subject,
  pipe,
  map,
  mergeMap,
  concatMap,
  filter,
  expand,
  tap,
  toArray,
  EMPTY
} from 'rxjs';
import { isFulfilled, type Action } from '@reduxjs/toolkit';
import type { Epic } from 'redux-observable';

import config from 'config';

import { submitBlast } from '../blast-api/blastApiSlice';

import * as observableApiService from 'src/services/observable-api-service';
import {
  saveBlastSubmission,
  updateSavedBlastJob
} from 'src/content/app/tools/blast/services/blastStorageService';

import {
  updateJob,
  restoreBlastSubmissions,
  type JobStatus,
  type BlastJob
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import type { RootState } from 'src/store';

const POLLING_INTERVAL = 15000; // fifteen seconds

/**
 * An epic that listens to redux action with the data from a BLAST form submission.
 * It saves the submission to IndexedDB, polls for job statuses,
 * and when a job is finished or failed, updates its status in indexedDB,
 * and sends a redux action to update its status in redux
 */
export const blastFormSubmissionEpic: Epic<Action, Action, RootState> = (
  action$
) =>
  action$.pipe(
    filter(submitBlast.matchFulfilled),
    tap((action) => {
      // save BLAST submission to IndexedDB
      const { submissionId, submission } = action.payload;
      saveBlastSubmission(submissionId, submission);
    }),
    map((action) => {
      const {
        submissionId,
        submission: { results }
      } = action.payload;

      return results.map((job) => ({ submissionId, job }));
    }),
    poll(),
    tap(databaseUpdaterSubject),
    map((pollingResult) => {
      const {
        submissionId,
        job: { jobId, status }
      } = pollingResult;
      // finish by returning a redux action
      return updateJob({ submissionId, jobId, fragment: { status } });
    })
  );

/**
 * Similar to blastFormSubmissionEpic, but listens to redux action
 * that reads BLAST submissions back from IndexedDB.
 * It checks for running jobs among the saved submissions,
 * and polls their status until their are finished or failed.
 */
export const blastSubmissionsRestoreEpic: Epic<Action, Action, RootState> = (
  action$
) =>
  action$.pipe(
    filter(isFulfilled(restoreBlastSubmissions)),
    map(({ payload: submissions }) => {
      return Object.entries(submissions).flatMap(([submissionId, submission]) =>
        submission.results
          .filter((job) => job.status === 'RUNNING')
          .map((job) => ({
            submissionId,
            job
          }))
      );
    }),
    poll(),
    tap(databaseUpdaterSubject),
    map((pollingResult) => {
      const {
        submissionId,
        job: { jobId, status }
      } = pollingResult;
      // finish by returning a redux action
      return updateJob({ submissionId, jobId, fragment: { status } });
    })
  );

/**
 * Common polling logic.
 * The expand operator is recursive: whatever is returned from it (the result of checkJobStatuses),
 * is fed back in.
 * Here, as long as checkJobStatuses returns jobs whose status is RUNNING,
 * they will be fed back into the expand, and then back to checkJobStatuses
 */
const poll = () =>
  pipe(
    expand((input: { submissionId: string; job: BlastJob }[]) => {
      const runningJobsList = input.filter(
        ({ job }) => job.status === 'RUNNING'
      );
      return runningJobsList.length
        ? timer(POLLING_INTERVAL).pipe(
            concatMap(() => checkJobStatuses(runningJobsList))
          )
        : EMPTY;
    }),
    mergeMap((results) => from(results)), // transform the array of objects returned from the previous operator into individual objects
    filter((pollingResult) =>
      ['FINISHED', 'FAILURE'].includes(pollingResult.job.status)
    ) // TODO: do we need to handle NOT_FOUND (aka 404) or ERROR (aka 500)?
  );

// query all running jobs once, one job after the other
const checkJobStatuses = (input: { submissionId: string; job: BlastJob }[]) => {
  return from(input).pipe(
    concatMap(({ submissionId, job }) => {
      const { jobId } = job;
      const url = `${config.toolsApiBaseUrl}/blast/jobs/status/${jobId}`;
      return observableApiService.fetch<{ status: string }>(url).pipe(
        map((result) => ({
          submissionId,
          job: {
            ...job,
            status: (result as { status: JobStatus }).status
          }
        }))
      );
    }),
    toArray()
  );
};

// save polling results to database
const databaseUpdaterSubject = new Subject<{
  submissionId: string;
  job: BlastJob;
}>().pipe(
  // make sure to wait until the async job of saving to indexedDb has been completed before starting a new one
  concatMap((pollingResult) => {
    const {
      submissionId,
      job: { jobId, status }
    } = pollingResult;
    return from(
      updateSavedBlastJob({ submissionId, jobId, fragment: { status } })
    );
  })
);
