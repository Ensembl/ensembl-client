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
  VEP_SUBMISSIONS_STORE_NAME as STORE_NAME,
  VEP_SUBMISSION_STORAGE_DURATION,
  TEMPORARY_VEP_SUBMISSION_STORAGE_DURATION
} from './vepStorageServiceConstants';

import type {
  VepSubmission,
  VepSubmissionWithoutInputFile
} from 'src/content/app/tools/vep/types/vepSubmission';

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
export const getVepSubmissionWithoutInputFile = async (
  submissionId: string
): Promise<VepSubmissionWithoutInputFile | undefined> => {
  const storedSubmission = await getVepSubmission(submissionId);

  if (!storedSubmission) {
    return;
  }

  return removeInputFileFromSubmission(storedSubmission);
};

export const updateVepSubmission = async (
  submissionId: string,
  fragment: Partial<VepSubmission>
) => {
  const storedSubmission = await getVepSubmission(submissionId);

  if (!storedSubmission) {
    return;
  }

  // The if block below is a hack due to IndexedDB (mis)behaviour in Safari.
  // Safari seems to dislike it when you store a record one of whose fields is a file (i.e. a blob),
  // and when you then retrieve that record from the db, change one of the fields that is not the file field,
  // and save it back to the db.
  // In such cases, IndexedDB in Safari (as recent as Safari 18) fails with an error:
  // 'UnknownError: Error preparing Blob/File data to be stored in object store'
  //
  // The if block below clones the stored file into a new one. This is silly additional CPU work and memory pressure.
  // TODO: observe in newer Safaris if this remains a problem, and remove this hack if no longer is.
  if (storedSubmission.inputFile) {
    const fileClone = await storedSubmission.inputFile.arrayBuffer();
    storedSubmission.inputFile = new File(
      [fileClone],
      storedSubmission.inputFile.name
    );
  }

  const updatedSubmission = {
    ...storedSubmission,
    ...fragment
  };

  await saveVepSubmission(updatedSubmission);
};

/**
 * The purpose of this function is to change the id of a submission,
 * which should only happen when the client submits VEP form data
 * (which is stored in the browser under temporary client-side-generated id),
 * and receives from the server a permanent id associated with this submission.
 */
export const changeVepSubmissionId = async (
  oldId: string,
  newId: string,
  fragment: Partial<VepSubmission> = {}
) => {
  const db = await IndexedDB.getDB();

  // Update submission, save it under a new id, and delete the submission stored under old id,
  // all in one transaction.
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.store;

  const storedSubmission: VepSubmission = await store.get(oldId);
  const updatedSubmission = {
    ...storedSubmission,
    id: newId,
    ...fragment
  };
  await store.put(updatedSubmission, newId);
  await store.delete(oldId);

  await transaction.done;
};

// Excluding the submission that has not been completed/submitted
// And removing the input file from every submission in the return value
export const getVepSubmissions = async (): Promise<
  VepSubmissionWithoutInputFile[]
> => {
  const db = await IndexedDB.getDB();
  let cursor = await db.transaction(STORE_NAME).store.openCursor();

  const submissions: VepSubmissionWithoutInputFile[] = [];

  while (cursor) {
    const storedSubmission: VepSubmission = cursor.value;

    if (storedSubmission.submittedAt) {
      submissions.push(removeInputFileFromSubmission(storedSubmission));
    }
    cursor = await cursor.continue();
  }

  return submissions;
};

export const deleteVepSubmission = async (submissionId: string) => {
  await IndexedDB.delete(STORE_NAME, submissionId);
};

export const deleteExpiredVepSubmissions = async () => {
  const db = await IndexedDB.getDB();
  // Delete all expired VEP jobs in one transaction
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  for await (const cursor of transaction.store) {
    const submission: VepSubmission = cursor.value;
    const { submittedAt, createdAt } = submission;

    const isOldTemporarySubmission =
      !submittedAt &&
      createdAt < Date.now() - TEMPORARY_VEP_SUBMISSION_STORAGE_DURATION;
    const isExpiredSubmission =
      submittedAt && submittedAt < Date.now() - VEP_SUBMISSION_STORAGE_DURATION;

    if (isOldTemporarySubmission || isExpiredSubmission) {
      cursor.delete();
    }
  }
  await transaction.done;
};

const removeInputFileFromSubmission = (
  submission: VepSubmission
): VepSubmissionWithoutInputFile => {
  const result = { ...submission };
  const fileName = submission.inputFile?.name ?? null;

  delete (result as Partial<VepSubmission>).inputFile;

  return {
    ...result,
    inputFileName: fileName
  };
};
