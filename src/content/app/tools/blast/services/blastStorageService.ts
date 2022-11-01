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

import {
  BLAST_SUBMISSIONS_STORE_NAME as STORE_NAME,
  BLAST_SUBMISSION_STORAGE_DURATION
} from './blastStorageServiceConstants';

import type {
  BlastSubmission,
  BlastJob
} from '../state/blast-results/blastResultsSlice';

export const saveBlastSubmission = async (
  submissionId: string,
  submission: BlastSubmission
) => {
  await IndexedDB.set(STORE_NAME, submissionId, submission);
};

export const getAllBlastSubmissions = async (): Promise<
  Record<string, BlastSubmission>
> => {
  const db = await IndexedDB.getDB();
  const submissions = (await db.getAll(STORE_NAME)) as BlastSubmission[];

  return submissions.reduce((obj, submission) => {
    return {
      ...obj,
      [submission.id]: submission
    };
  }, {} as Record<string, BlastSubmission>);
};

export const getBlastSubmission = async (
  submissionId: string
): Promise<BlastSubmission> => {
  return await IndexedDB.get(STORE_NAME, submissionId);
};

export const updateBlastSubmission = async (
  submissionId: string,
  fragment: Partial<BlastSubmission>
) => {
  const submission = await getBlastSubmission(submissionId);
  if (!submission) {
    return;
  }
  const updatedSubmission = {
    ...submission,
    ...fragment
  };

  await saveBlastSubmission(submissionId, updatedSubmission);
};

export const updateSavedBlastJob = async (params: {
  submissionId: string;
  jobId: string;
  fragment: Partial<BlastJob>;
}) => {
  const { submissionId, jobId, fragment } = params;
  const submission = await getBlastSubmission(submissionId);
  const job = submission.results.find((job) => job.jobId === jobId);

  if (!job) {
    return;
  }

  Object.assign(job, fragment); // this will mutate the object
  await saveBlastSubmission(submissionId, submission);
};

export const deleteBlastSubmission = async (submissionId: string) => {
  await IndexedDB.delete(STORE_NAME, submissionId);
};

export const deleteExpiredBlastSubmissions = async () => {
  const db = await IndexedDB.getDB();
  // Delete all expired BLAST jobs in one transaction
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  for await (const cursor of transaction.store) {
    const submission: BlastSubmission = cursor.value;
    const { submittedAt } = submission;
    if (submittedAt < Date.now() - BLAST_SUBMISSION_STORAGE_DURATION) {
      cursor.delete();
    }
  }
  await transaction.done;
};
