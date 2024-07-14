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

import { nanoid } from '@reduxjs/toolkit';

import IndexedDB from 'src/services/indexeddb-service';

import { VEP_SUBMISSIONS_STORE_NAME as STORE_NAME } from './vepStorageServiceConstants';

import type {
  VepSubmission,
  VepSubmissionWithoutVariantsInput
} from 'src/content/app/tools/vep/types/vepSubmission';

/**
 * - Find unsubmitted VEP form data — there should only be one
 * - Find all unseen VEP submissions
 * - Find all seen VEP submissions
 */

export const saveVepSubmission = async (submission: VepSubmission) => {
  const submissionId = submission.id;
  await IndexedDB.set(STORE_NAME, submissionId, submission);
};

/**
 * Returns the full stored VEP submission, including user's variants input.
 * NOTE: since the variants input could be a file reaching as much as 250MB in size,
 * be careful when using this method not to overload the memory.
 */
export const getVepSubmission = async (
  submissionId: string
): Promise<VepSubmission | undefined> => {
  return await IndexedDB.get(STORE_NAME, submissionId);
};

/**
 * Returns the stored VEP submission without user's variants input, which,
 * unless we are restoring the input form or preparing the payload to send to the server,
 * is not needed for any UI purposes
 */
export const getVepSubmissionWithoutVariantsInput = async (
  submissionId: string
): Promise<VepSubmissionWithoutVariantsInput | undefined> => {
  const storedSubmission = await getVepSubmission(submissionId);

  if (!storedSubmission) {
    return;
  }

  const inputFile = storedSubmission.inputFile;
  const inputFileName = inputFile?.name ?? null;

  delete (storedSubmission as Partial<VepSubmission>).inputFile;

  return {
    ...storedSubmission,
    inputFileName
  };
};

export const updateVepSubmission = async (
  submissionId: string,
  fragment: Partial<VepSubmission>
) => {
  const storedSubmission = await getVepSubmission(submissionId);

  if (!storedSubmission) {
    return;
  }

  const updatedSubmission = {
    ...storedSubmission,
    ...fragment
  };

  await saveVepSubmission(updatedSubmission);
};

// Returns the data for a VEP submission that the user is still preparing and has not yet submitted.
// There should only ever be one such submission.
export const getUncompletedVepSubmission = async () => {
  const db = await IndexedDB.getDB();
  let cursor = await db.transaction(STORE_NAME).store.openCursor();

  while (cursor) {
    const storedSubmission: VepSubmission = cursor.value;

    if (!storedSubmission.submittedAt) {
      return storedSubmission;
    } else {
      cursor = await cursor.continue();
    }
  }
};

// Similarly to getVepSubmissionWithoutVariantsInput, strips potentially heavy input fields before returning
export const getUncompletedVepSubmissionWithoutVariantsInput = async () => {
  const storedSubmission = await getUncompletedVepSubmission();

  if (!storedSubmission) {
    return;
  }

  const inputFile = storedSubmission.inputFile;
  const inputFileName = inputFile?.name ?? null;

  delete (storedSubmission as Partial<VepSubmission>).inputFile;

  return {
    ...storedSubmission,
    inputFileName
  };
};

/**
 * Create and save initial and mostly empty VEP form data,
 * which can then be updated to store form data
 */
export const initialiseTemporarySubmissionData = async () => {
  const initialSubmissionData: VepSubmission = {
    id: `temporary-${nanoid}`,
    species: null,
    submissionName: null,
    inputText: null,
    inputFile: null,
    parameters: {},
    createdAt: Date.now(),
    submittedAt: null,
    status: 'NOT_SUBMITTED',
    resultsSeen: false
  };

  await saveVepSubmission(initialSubmissionData);
};

// Submissions whose results users have not yet viewed
export const getUnviewedVepSubmissions = async () => {};

// Submissions whose results users have already viewed
export const getViewedVepSubmissions = async () => {};

export const deleteVepSubmission = async (submissionId: string) => {
  await IndexedDB.delete(STORE_NAME, submissionId);
};

export const deleteExpiredVepSubmissions = async () => {};
