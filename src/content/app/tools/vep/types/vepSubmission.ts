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

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

export type VepSelectedSpecies = Omit<CommittedItem, 'isEnabled'>;

export const clientSideSubmissionStatuses = [
  'NOT_SUBMITTED', // initial status of a submission while it is being prepared by the user
  'SUBMITTING', // during the time between user clicking the submit button, and the submission being accepted by the backend
  'UNSUCCESSFUL_SUBMISSION' // some unspecified (most likely network timeout) error happened during submission
] as const;

/**
 * Note: Seqera also has an UNKNOWN status, which it explains as "an indeterminate status";
 * but we don't know either when it can occur or what to do with it. Currently the expectation is
 * that if it ever occurs, tools api will report this submission as failed.
 */
export const serverSideSubmissionStatuses = [
  'SUBMITTED', // Pending execution
  'RUNNING',
  'SUCCEEDED',
  'FAILED', // Executed, but at least one task failed with a terminate error strategy
  'CANCELLED' // Stopped manually during execution
] as const;

export type ClientSideSubmissionStatus =
  (typeof clientSideSubmissionStatuses)[number];
export type ServerSideSubmissionStatus =
  (typeof serverSideSubmissionStatuses)[number];

export type SubmissionStatus =
  | ClientSideSubmissionStatus
  | ServerSideSubmissionStatus;

/**
 * Schema of the data that will be persisted in indexedDB.
 */
export type VepSubmission = {
  id: string;
  species: VepSelectedSpecies | null;
  inputText: string | null;
  inputFile: File | null;
  submissionName: string | null;
  parameters: Record<string, unknown>;
  createdAt: number; // <-- to allow enable the submissions list
  submittedAt: number | null; // <-- can get the unsubmitted submission
  resultsSeen: boolean;
  status: SubmissionStatus; // <-- a member of a closed dictionary of words
};

export type VepSubmissionWithoutInputFile = Omit<VepSubmission, 'inputFile'> & {
  inputFileName: string | null;
};

/**
 * Schema of the payload submitted to the server.
 */
export type VepSubmissionPayload = {
  submission_id: string; // temporary client-side id under which the submission is stored
  genome_id: string;
  input_file: File;
  parameters: string;
};
