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
import { IDBFactory } from 'fake-indexeddb';
import { openDB } from 'idb/with-async-ittr';
import { faker } from '@faker-js/faker';

import IndexedDB from 'src/services/indexeddb-service';

indexedDB = new IDBFactory(); // should create a completely fresh copy of in-memory mock indexedDB

const FIRST_STORE_NAME = 'first-store';
const SECOND_STORE_NAME = 'second-store';

const getDatabase = async () => {
  return await openDB('test-db', 1, {
    upgrade(db) {
      db.createObjectStore(FIRST_STORE_NAME);
      db.createObjectStore(SECOND_STORE_NAME);
    }
  });
};

jest.spyOn(IndexedDB, 'getDB').mockImplementation(() => getDatabase());

describe('IndexedDB service', () => {
  afterEach(async () => {
    await IndexedDB.clear(FIRST_STORE_NAME);
    await IndexedDB.clear(SECOND_STORE_NAME);
  });

  describe('IndexedDB.clearDatabase', () => {
    const mockRecordsCount = 10;

    const fillDbWithMockData = async () => {
      for (let i = 0; i < mockRecordsCount; i++) {
        await IndexedDB.set(
          FIRST_STORE_NAME,
          `entry-${i}`,
          faker.lorem.sentence()
        );
        await IndexedDB.set(
          SECOND_STORE_NAME,
          `entry-${i}`,
          faker.lorem.sentence()
        );
      }
    };

    const getRecordsFromStore = async (storeName: string) => {
      const db = await IndexedDB.getDB();
      return await db.getAll(storeName);
    };

    it('clears all object stores in the database', async () => {
      // Initial setup: fill the database with mock data
      await fillDbWithMockData();

      // Verify that the mock data has indeed been stored in the database
      let recordsInFirstStore = await getRecordsFromStore(FIRST_STORE_NAME);
      let recordsInSecondStore = await getRecordsFromStore(SECOND_STORE_NAME);
      expect(recordsInFirstStore.length).toBe(mockRecordsCount);
      expect(recordsInSecondStore.length).toBe(mockRecordsCount);

      // Now clear the database
      await IndexedDB.clearDatabase();

      // Verify that all object stores in the database have been cleared
      recordsInFirstStore = await getRecordsFromStore(FIRST_STORE_NAME);
      recordsInSecondStore = await getRecordsFromStore(SECOND_STORE_NAME);
      expect(recordsInFirstStore.length).toBe(0);
      expect(recordsInSecondStore.length).toBe(0);
    });
  });
});
