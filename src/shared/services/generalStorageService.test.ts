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

import { GENERAL_STORE_NAME, RELEASE_KEY } from './generalStorageConstants';

import { saveReleaseInfo, getReleaseInfo } from './generalStorageService';

const getDatabase = async () => {
  return await openDB('test-db', 1, {
    upgrade(db) {
      db.createObjectStore(GENERAL_STORE_NAME);
    }
  });
};

vi.spyOn(IndexedDB, 'getDB').mockImplementation(() => getDatabase());

afterEach(async () => {
  await IndexedDB.clear(GENERAL_STORE_NAME);
});

describe('generalStorageService', () => {
  describe('storing and retrieving release information', () => {
    const releases = [
      {
        name: '2026-07-13',
        type: 'partial'
      } as const,
      {
        name: '2026-07',
        type: 'integrated'
      } as const
    ];

    test('saving release information', async () => {
      await saveReleaseInfo(releases);

      // now read back the stored data
      const restoredReleases = await IndexedDB.get(
        GENERAL_STORE_NAME,
        RELEASE_KEY
      );
      expect(restoredReleases).toEqual(releases);
    });

    test('reading back release information', async () => {
      // write release information to IndexedDB directly
      await IndexedDB.set(GENERAL_STORE_NAME, RELEASE_KEY, releases);

      const restoredReleases = await getReleaseInfo();
      expect(restoredReleases).toEqual(releases);
    });

    test('reading empty release information', async () => {
      const emptyReleases = await getReleaseInfo();
      expect(emptyReleases).toEqual([]);
    });

    test('updating release information', async () => {
      // write release information to IndexedDB directly
      await IndexedDB.set(GENERAL_STORE_NAME, RELEASE_KEY, releases);

      const newReleases = [
        {
          name: '2026-08-01',
          type: 'partial'
        } as const,
        {
          name: '2026-08',
          type: 'integrated'
        } as const
      ];

      await saveReleaseInfo(newReleases);

      // now read back the stored data
      const restoredReleases = await IndexedDB.get(
        GENERAL_STORE_NAME,
        RELEASE_KEY
      );
      expect(restoredReleases).toEqual(newReleases);
    });
  });
});
