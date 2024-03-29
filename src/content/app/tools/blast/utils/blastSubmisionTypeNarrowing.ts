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
  BlastSubmission,
  SuccessfulBlastSubmission,
  FailedBlastSubmission
} from 'src/content/app/tools/blast/state/blast-results/blastResultsSlice';

export const isSuccessfulBlastSubmission = (
  submission?: BlastSubmission
): submission is SuccessfulBlastSubmission => {
  if (!submission) {
    return false;
  } else {
    return 'results' in submission;
  }
};

export const isFailedBlastSubmission = (
  submission?: BlastSubmission
): submission is FailedBlastSubmission => {
  if (!submission) {
    return false;
  } else {
    return 'error' in submission;
  }
};

export const haveAllJobsFailed = (
  submission?: SuccessfulBlastSubmission
): boolean => {
  return submission?.results?.every((job) => job.status === 'FAILURE') ?? false;
};
