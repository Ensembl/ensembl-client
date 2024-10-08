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

import type { RootState } from 'src/store';
import type {
  VepSubmission,
  VepSubmissionWithoutInputFile
} from 'src/content/app/tools/vep/types/vepSubmission';

const getVepSubmissionsState = (state: RootState) => state.vep.vepSubmissions;

export const getAllVepSubmissions = (state: RootState) =>
  getVepSubmissionsState(state).submissions;

export const getVepSubmissionsRestoredFlag = (state: RootState) =>
  getVepSubmissionsState(state).areSubmissionsRestored;

export const getUnviewedVepSubmissions = createSelector(
  [getAllVepSubmissions],
  (vepSubmissionsState) => {
    return [...Object.values(vepSubmissionsState)]
      .filter((submission) => !submission.resultsSeen)
      .toSorted(sortSubmissionsChronologically);
  }
);

export const getViewedVepSubmissions = createSelector(
  [getAllVepSubmissions],
  (vepSubmissionsState) => {
    return [...Object.values(vepSubmissionsState)]
      .filter((submission) => submission.resultsSeen)
      .toSorted(sortSubmissionsChronologically);
  }
);

export const getVepSubmissionById = (
  state: RootState,
  submissionId: string
): VepSubmissionWithoutInputFile | null => {
  const vepSubmissionsState = getAllVepSubmissions(state);
  return vepSubmissionsState[submissionId] ?? null;
};

const sortSubmissionsChronologically = (
  submission1: Pick<VepSubmission, 'createdAt'>,
  submission2: Pick<VepSubmission, 'createdAt'>
) => submission2.createdAt - submission1.createdAt;
