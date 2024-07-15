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
import { openDB } from 'idb';

import IndexedDB from 'src/services/indexeddb-service';

import {
  VEP_SUBMISSIONS_STORE_NAME,
  VEP_SUBMISSION_STORAGE_DURATION
} from './vepStorageServiceConstants';

import {
  saveVepSubmission,
  getVepSubmission,
  updateVepSubmission,
  getUncompletedVepSubmission,
  getUnviewedVepSubmissions,
  getViewedVepSubmissions,
  deleteVepSubmission,
  deleteExpiredVepSubmissions
} from './vepStorageService';

import { createVepSubmission } from 'tests/fixtures/vep/vepSubmission';

const getDatabase = async () => {
  return await openDB('test-db', 1, {
    upgrade(db) {
      db.createObjectStore(VEP_SUBMISSIONS_STORE_NAME);
    }
  });
};

jest.spyOn(IndexedDB, 'getDB').mockImplementation(() => getDatabase());

describe('vepStorageService', () => {
  afterEach(async () => {
    await IndexedDB.clear(VEP_SUBMISSIONS_STORE_NAME);
  });

  describe('saveVepSubmission', () => {
    it('saves a VEP submission', async () => {
      const vepSubmission = createVepSubmission();
      await saveVepSubmission(vepSubmission);

      // check that the submission has been saved
      const db = await getDatabase();
      const savedSubmission = await db.get(
        VEP_SUBMISSIONS_STORE_NAME,
        vepSubmission.id
      );

      expect(savedSubmission).toEqual(vepSubmission);
    });
  });

  describe('getVepSubmission', () => {
    // Note that fake-indexeddb doesn't seem to properly support the storage of Files

    it('retrieves a VEP submission', async () => {
      const vepSubmission = createVepSubmission();
      vepSubmission.inputText = 'hello world';

      const db = await getDatabase();
      await db.put(VEP_SUBMISSIONS_STORE_NAME, vepSubmission, vepSubmission.id);

      const storedVepSubmission = await getVepSubmission(vepSubmission.id);

      expect(storedVepSubmission).toEqual(vepSubmission);
    });

    // it.only('works with files?', async () => {
    //   const vepSubmission = createVepSubmission();
    //   const text = 'hello world';
    //   const blob = new Blob([text], {
    //     type: "text/plain",
    //   });

    //   const file = new File([text], 'test.txt');

    //   const testObj = {
    //     foo: 'foo',
    //     file,
    //     blob
    //   };

    //   console.log({ file });

    //   const db = await getDatabase();
    //   await db.put(VEP_SUBMISSIONS_STORE_NAME, testObj, 'test');
    //   const storedKeys = await db.getAllKeys(VEP_SUBMISSIONS_STORE_NAME);
    //   const result = await db.get(VEP_SUBMISSIONS_STORE_NAME, 'test');

    //   console.log('storedKeys', storedKeys);
    //   console.log('result', result);
    // });
  });

  describe('updateVepSubmission', () => {
    it('updates stored VEP submission', async () => {
      // arrange
      const vepSubmission = createVepSubmission();
      vepSubmission.status = 'NOT_SUBMITTED';
      vepSubmission.parameters.symbol = false;
      await saveVepSubmission(vepSubmission);

      // act
      await updateVepSubmission(vepSubmission.id, {
        status: 'SUBMITTED',
        parameters: {
          ...vepSubmission.parameters,
          symbol: true
        }
      });

      // check that the submission has been updated
      const db = await getDatabase();
      const savedSubmission = await db.get(
        VEP_SUBMISSIONS_STORE_NAME,
        vepSubmission.id
      );

      const expectedSubmission = {
        ...structuredClone(vepSubmission),
        status: 'SUBMITTED',
        parameters: {
          ...vepSubmission.parameters,
          symbol: true
        }
      };

      expect(savedSubmission).toEqual(expectedSubmission);
    });
  });

  describe('getUncompletedVepSubmission', () => {
    it('retrieves VEP submission data that have not yet been submitted', async () => {
      // arrange
      const submission1 = createVepSubmission();
      const submission2 = createVepSubmission();
      const submission3 = createVepSubmission();
      submission1.submittedAt = Date.now();
      submission2.submittedAt = null;
      submission3.submittedAt = Date.now();
      await saveVepSubmission(submission1);
      await saveVepSubmission(submission2);
      await saveVepSubmission(submission3);

      // act
      const uncompletedSubmission = await getUncompletedVepSubmission();

      // assert
      expect(uncompletedSubmission).toEqual(submission2);
    });
  });

  describe('getUnviewedVepSubmissions', () => {
    it('retrieves VEP submissions whose results have not been viewed', async () => {
      // arrange
      const submission1 = createVepSubmission({
        fragment: { resultsSeen: true }
      });
      const submission2 = createVepSubmission({
        fragment: { resultsSeen: false }
      });
      const submission3 = createVepSubmission({
        fragment: { resultsSeen: true }
      });
      const submission4 = createVepSubmission({
        fragment: { resultsSeen: false }
      });
      await saveVepSubmission(submission1);
      await saveVepSubmission(submission2);
      await saveVepSubmission(submission3);
      await saveVepSubmission(submission4);

      // act
      const unviewedSubmissions = await getUnviewedVepSubmissions();

      // assert
      expect(unviewedSubmissions.length).toBe(2);
      expect(
        unviewedSubmissions.map((submission) => submission.id).toSorted()
      ).toEqual([submission2.id, submission4.id].toSorted());
    });
  });

  describe('getViewedVepSubmissions', () => {
    it('retrieves VEP submissions whose results have been viewed', async () => {
      // arrange
      const submission1 = createVepSubmission({
        fragment: { resultsSeen: true }
      });
      const submission2 = createVepSubmission({
        fragment: { resultsSeen: false }
      });
      const submission3 = createVepSubmission({
        fragment: { resultsSeen: true }
      });
      const submission4 = createVepSubmission({
        fragment: { resultsSeen: false }
      });
      await saveVepSubmission(submission1);
      await saveVepSubmission(submission2);
      await saveVepSubmission(submission3);
      await saveVepSubmission(submission4);

      // act
      const unviewedSubmissions = await getViewedVepSubmissions();

      // assert
      expect(unviewedSubmissions.length).toBe(2);
      expect(
        unviewedSubmissions.map((submission) => submission.id).toSorted()
      ).toEqual([submission1.id, submission3.id].toSorted());
    });
  });

  describe('deleteVepSubmission', () => {
    it('deletes VEP submission from persistent browser storage', async () => {
      // arrange
      const submission1 = createVepSubmission();
      const submission2 = createVepSubmission();
      await saveVepSubmission(submission1);
      await saveVepSubmission(submission2);

      // act
      await deleteVepSubmission(submission1.id);

      // assert
      const db = await IndexedDB.getDB();
      const storedSubmissions = await db.getAll(VEP_SUBMISSIONS_STORE_NAME);

      expect(storedSubmissions.length).toBe(1);
      expect(storedSubmissions[0].id).toBe(submission2.id);
    });
  });

  describe('deleteExpiredVepSubmissions', () => {
    it('removes old VEP submissions from persistent browser storage', async () => {
      // arrange
      const oldDate = Date.now() - VEP_SUBMISSION_STORAGE_DURATION + 1;
      const submission1 = createVepSubmission();
      const submission2 = createVepSubmission({
        fragment: { submittedAt: oldDate }
      });
      const submission3 = createVepSubmission();
      const submission4 = createVepSubmission({
        fragment: { submittedAt: oldDate }
      });
      await saveVepSubmission(submission1);
      await saveVepSubmission(submission2);
      await saveVepSubmission(submission3);
      await saveVepSubmission(submission4);

      // act
      await deleteExpiredVepSubmissions();

      // assert
      const db = await IndexedDB.getDB();
      const storedSubmissions = await db.getAll(VEP_SUBMISSIONS_STORE_NAME);

      expect(storedSubmissions.length).toBe(2);
      expect(
        storedSubmissions.map((submission) => submission.id).toSorted()
      ).toEqual([submission1.id, submission3.id].toSorted());
    });
  });
});
