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
import times from 'lodash/times';
import { faker } from '@faker-js/faker';

import { VEP_SUBMISSIONS_STORE_NAME } from 'src/content/app/tools/vep/services/vepStorageServiceConstants';

import { migrateVepStore } from 'src/services/indexeddb-migrations/vepStoreMigrations';

describe('v9 -> v10 migration', () => {
  // During migration to version 10,
  // all locally stored VEP submissions should be deleted
  // due to backwards incompatibility of the new VEP release

  const oldVersion = 9;
  const newVersion = 10;

  test('cleanin up VEP storage', async () => {
    // Create a db using the old db version
    const oldDb = await openDB('test-db', oldVersion, {
      upgrade(db) {
        db.createObjectStore(VEP_SUBMISSIONS_STORE_NAME);
      }
    });

    // It doesn't really matter what we fill the db store with
    // The point of the test is to verify that the store gets cleared

    const mockSubmissionsCount = 3;
    const mockVepSubmissions = times(mockSubmissionsCount, () => {
      return {
        id: faker.string.uuid(),
        foo: faker.lorem.sentence()
      };
    });

    // Save mock data into the database
    for (const submission of mockVepSubmissions) {
      await oldDb.put(VEP_SUBMISSIONS_STORE_NAME, submission, submission.id);
    }

    // confirm that the VEP store has some data
    const storedVepData = await oldDb.getAll(VEP_SUBMISSIONS_STORE_NAME);
    expect(storedVepData.length).toBe(mockSubmissionsCount);

    oldDb.close();

    // Now run the db migration
    const newDb = await openDB('test-db', newVersion, {
      upgrade(db, oldVersion, __, transaction) {
        migrateVepStore({
          oldVersion,
          transaction
        });
      }
    });

    // Confirm that the store is now empty
    const vepData = await newDb.getAll(VEP_SUBMISSIONS_STORE_NAME);
    expect(vepData.length).toBe(0);
  });
});
