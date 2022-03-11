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

import { from, interval, Subject } from 'rxjs';
import { map, mergeMap, concatMap, filter, take, tap } from 'rxjs/operators';
import type { Action } from '@reduxjs/toolkit';
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
  type JobStatus
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

import type { RootState } from 'src/store';

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
    mergeMap((ids) => {
      return from(ids).pipe(
        mergeMap(({ submissionId, jobId }) => {
          const url = `${config.toolsApiBaseUrl}/blast/jobs/status/${jobId}`;
          return interval(5000).pipe(
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
