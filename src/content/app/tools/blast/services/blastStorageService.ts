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

import IndexedDB from 'src/services/indexeddb-service';

import type {
  BlastSubmission,
  BlastJob
} from '../state/blast-results/blastResultsSlice';

const STORE_NAME = 'blast-submissions';

export const saveBlastSubmission = async (
  submissionId: string,
  submission: BlastSubmission
) => {
  await IndexedDB.set(STORE_NAME, submissionId, submission);
};

export const getAllBlastSubmissions = async (): Promise<BlastSubmission[]> => {
  const submissionIds = await IndexedDB.keys(STORE_NAME);
  return Promise.all(
    submissionIds.map((id) => getBlastSubmission(id as string))
  );
};

export const getBlastSubmission = async (
  submissionId: string
): Promise<BlastSubmission> => {
  return await IndexedDB.get(STORE_NAME, submissionId);
};

export const updateSavedBlastJob = async (params: {
  submissionId: string;
  jobId: string;
  fragment: Partial<BlastJob>;
}) => {
  const { submissionId, jobId, fragment } = params;
  const submission = await getBlastSubmission(submissionId);
  const job = submission.results.find((job) => job.jobId === jobId);
  Object.assign(job, fragment); // this will mutate the object
  await saveBlastSubmission(submissionId, submission);
};

export const deleteBlastSubmission = async (submissionId: string) => {
  await IndexedDB.delete(STORE_NAME, submissionId);
};
