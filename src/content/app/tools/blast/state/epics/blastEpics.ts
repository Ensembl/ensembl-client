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

import { from, interval, Subject, pipe } from 'rxjs';
import { map, mergeMap, concatMap, filter, take, tap } from 'rxjs/operators';
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
  type JobStatus
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import type { RootState } from 'src/store';

const POLLING_INTERVAL = 5000; // five seconds

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

      return results.map(({ jobId }) => ({ submissionId, jobId }));
    }),
    pollForJobStatuses() // this will eventually return updateJob redux actions
  );

export const blastSubmissionsResroteEpic: Epic<Action, Action, RootState> = (
  action$
) =>
  action$.pipe(
    filter(isFulfilled(restoreBlastSubmissions)),
    map(({ payload: submissions }) => {
      return Object.entries(submissions).flatMap(([submissionId, submission]) =>
        submission.results
          .filter((job) => job.status === 'RUNNING')
          .map(({ jobId }) => ({
            submissionId,
            jobId
          }))
      );
    }),
    pollForJobStatuses()
  );

/**
 * Common polling logic: a pipeline that receives an array of objects
 * of type { submissionId: string; jobId: string; },
 * polls for status of each job once in a while;
 * and when a job is finished or failed, updates its status in indexedDB,
 * and sends a redux action to update its status in redux
 */
const pollForJobStatuses = () =>
  pipe(
    mergeMap((ids: { submissionId: string; jobId: string }[]) => {
      return from(ids).pipe(
        mergeMap(({ submissionId, jobId }) => {
          const url = `${config.toolsApiBaseUrl}/blast/jobs/status/${jobId}`;
          return interval(POLLING_INTERVAL).pipe(
            mergeMap(() => observableApiService.fetch<{ status: string }>(url)),
            filter(
              (result) =>
                'status' in result &&
                ['FINISHED', 'FAILURE'].includes(result.status)
            ), // TODO: do we need to handle NOT_FOUND (aka 404) or ERROR (aka 500)?
            map((result) => ({
              submissionId,
              jobId,
              status: (result as { status: JobStatus }).status
            })),
            take(1) // stop polling when the final job status is received
          );
        })
      );
    }),
    tap(pollingResultSubject),
    map((pollingResult) => {
      const { submissionId, jobId, status } = pollingResult;
      // finish by returning a redux action
      return updateJob({ submissionId, jobId, fragment: { status } });
    })
  );

// save polling results to database
const pollingResultSubject = new Subject<{
  submissionId: string;
  jobId: string;
  status: JobStatus;
}>().pipe(
  // make sure to wait until the async job of saving to indexedDb has been completed before starting a new one
  concatMap((pollingResult) => {
    const { submissionId, jobId, status } = pollingResult;
    return from(
      updateSavedBlastJob({ submissionId, jobId, fragment: { status } })
    );
  })
);
