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
  GENERAL_UI_STORE_NAME,
  SPECIES_NAME_DISPLAY_OPTION_KEY
} from './generalUIStorageConstants';
import { speciesNameDisplayOptions } from 'src/content/app/species-selector/constants/speciesNameDisplayConstants';

import {
  saveSpeciesNameDisplayOption,
  getSpeciesNameDisplayOption
} from './generalUIStorageService';

const getDatabase = async () => {
  return await openDB('test-db', 1, {
    upgrade(db) {
      db.createObjectStore(GENERAL_UI_STORE_NAME);
    }
  });
};

jest.spyOn(IndexedDB, 'getDB').mockImplementation(() => getDatabase());

afterEach(async () => {
  await IndexedDB.clear(GENERAL_UI_STORE_NAME);
});

describe('generalUIStorageService', () => {
  describe('storing and retrieving species name display option', () => {
    test('saving species name display option', async () => {
      const displayOption = speciesNameDisplayOptions[1]; // a non-default display option
      await saveSpeciesNameDisplayOption(displayOption);

      // now read back the stored option
      const retrievedOption = await IndexedDB.get(
        GENERAL_UI_STORE_NAME,
        SPECIES_NAME_DISPLAY_OPTION_KEY
      );
      expect(retrievedOption).toEqual(displayOption);
    });

    test('reading species name display option', async () => {
      const displayOption = speciesNameDisplayOptions[1]; // a non-default display option

      // write species name display option to indexed db directly, without using the service
      await IndexedDB.set(
        GENERAL_UI_STORE_NAME,
        SPECIES_NAME_DISPLAY_OPTION_KEY,
        displayOption
      );

      const retrievedOption = await getSpeciesNameDisplayOption();
      expect(retrievedOption).toEqual(displayOption);
    });

    test('updating species name display option', async () => {
      const displayOption1 = speciesNameDisplayOptions[0];
      const displayOption2 = speciesNameDisplayOptions[1];

      await saveSpeciesNameDisplayOption(displayOption1);
      await saveSpeciesNameDisplayOption(displayOption2);

      // now read back the stored option
      const retrievedOption = await IndexedDB.get(
        GENERAL_UI_STORE_NAME,
        SPECIES_NAME_DISPLAY_OPTION_KEY
      );
      expect(retrievedOption).toEqual(displayOption2);
    });

    test('reading an empty option', async () => {
      // nothing has been written to the db
      const retrievedOption = await getSpeciesNameDisplayOption();
      expect(retrievedOption).toBe(null);
    });

    test('discarding invalid species name display option', async () => {
      // Suppose db stores an outdated option that we do not know how to handle anymore.
      // In this case, the service should just return null, as if no option were written to the db
      const invalidDisplayOption = 'foo';

      // write the display option to indexed db directly, without using the service
      await IndexedDB.set(
        GENERAL_UI_STORE_NAME,
        SPECIES_NAME_DISPLAY_OPTION_KEY,
        invalidDisplayOption
      );

      const retrievedOption = await getSpeciesNameDisplayOption();
      expect(retrievedOption).toEqual(null);
    });
  });
});
