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

import 'fake-indexeddb/auto';
import { openDB } from 'idb/with-async-ittr';
import times from 'lodash/times';

import IndexedDB from 'src/services/indexeddb-service';

import {
  BLAST_SUBMISSIONS_STORE_NAME,
  BLAST_SUBMISSION_STORAGE_DURATION
} from './blastStorageServiceConstants';

import {
  saveBlastSubmission,
  deleteExpiredBlastSubmissions
} from './blastStorageService';

import { createBlastSubmission } from 'tests/fixtures/blast/blastSubmission';

const getDatabase = async () => {
  return await openDB('test-db', 1, {
    upgrade(db) {
      db.createObjectStore(BLAST_SUBMISSIONS_STORE_NAME);
    }
  });
};

jest.spyOn(IndexedDB, 'getDB').mockImplementation(() => getDatabase());

describe('blastStorageService', () => {
  afterEach(async () => {
    await IndexedDB.clear(BLAST_SUBMISSIONS_STORE_NAME);
  });

  describe('deleteExpiredBlastSubmissions', () => {
    it('deletes expired BLAST submissions', async () => {
      const db = await IndexedDB.getDB();
      const submissions = times(5, () => createBlastSubmission());
      const nonExpiredSubmissionIds: string[] = [];

      submissions.forEach((submission, index) => {
        if (index < 3) {
          submission.submittedAt =
            Date.now() - BLAST_SUBMISSION_STORAGE_DURATION - 1000; // one second after the expiry date
        } else {
          submission.submittedAt =
            Date.now() - BLAST_SUBMISSION_STORAGE_DURATION + 1000; // one second before the expiry date
          nonExpiredSubmissionIds.push(submission.id);
        }
      });

      // Prepare the database
      for (const submission of submissions) {
        await saveBlastSubmission(submission.id, submission);
      }

      await deleteExpiredBlastSubmissions();

      const remainingSubmissions = await db.getAll(
        BLAST_SUBMISSIONS_STORE_NAME
      );
      const remainingSubmissionIds = remainingSubmissions.map(
        (submission) => submission.id
      );

      expect(remainingSubmissionIds.sort()).toEqual(
        nonExpiredSubmissionIds.sort()
      );
    });
  });
});
