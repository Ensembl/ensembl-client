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

import { createSelector } from '@reduxjs/toolkit';
import {
  isSuccessfulBlastSubmission,
  isFailedBlastSubmission
} from 'src/content/app/tools/blast/utils/blastSubmisionTypeNarrowing';

import type { RootState } from 'src/store';
import type { BlastSubmission } from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

export const getBlastSubmissions = (state: RootState) =>
  state.blast.blastResults.submissions;

export const getBlastSubmissionsUi = (state: RootState) =>
  state.blast.blastResults.ui;

export const getUnviewedBlastSubmissions = createSelector(
  (state: RootState) => getBlastSubmissions(state),
  (submissions) =>
    Object.values(submissions).filter(
      (submission) => isFailedBlastSubmission(submission) || !submission.seen
    )
);

export const getViewedBlastSubmissions = createSelector(
  (state: RootState) => getBlastSubmissions(state),
  (submissions) =>
    Object.values(submissions).filter(
      (submission) => isSuccessfulBlastSubmission(submission) && submission.seen
    )
);

export const getBlastSubmissionById = (
  state: RootState,
  id: string
): BlastSubmission | undefined => state.blast.blastResults.submissions[id];
