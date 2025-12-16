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

import IndexedDB from 'src/services/indexeddb-service';

import {
  saveSingleSelectedSpecies,
  saveMultipleSelectedSpecies,
  getSelectedSpeciesById,
  getAllSelectedSpecies,
  deleteSelectedSpeciesById,
  deleteAllSelectedSpecies
} from './speciesSelectorStorageService';
import { SELECTED_SPECIES_STORE_NAME } from './speciesSelectorStorageConstants';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

const getDatabase = async () => {
  return await openDB('test-db', 1, {
    upgrade(db) {
      db.createObjectStore(SELECTED_SPECIES_STORE_NAME);
    }
  });
};

vi.spyOn(IndexedDB, 'getDB').mockImplementation(() => getDatabase());

afterEach(async () => {
  await IndexedDB.clear(SELECTED_SPECIES_STORE_NAME);
});

describe('speciesSelectorStorageService', () => {
  describe('saveSingleSelectedSpecies', () => {
    it('saves a new selected species', async () => {
      const species = createSelectedSpecies();
      await saveSingleSelectedSpecies(species);

      // now read the species back directly through the db
      const retrievedSpecies = await IndexedDB.get(
        SELECTED_SPECIES_STORE_NAME,
        species.genome_id
      );
      expect(retrievedSpecies).toEqual(species);
    });

    it('updates a previously selected species', async () => {
      const species = createSelectedSpecies(); // will have the isEnabled field set to true
      await IndexedDB.set(
        SELECTED_SPECIES_STORE_NAME,
        species.genome_id,
        species
      );

      species.isEnabled = false;

      await saveSingleSelectedSpecies(species);

      // now read the species back directly through the db
      const retrievedSpecies = await IndexedDB.get(
        SELECTED_SPECIES_STORE_NAME,
        species.genome_id
      );
      expect(retrievedSpecies).toEqual(species);
    });
  });

  describe('saveMultipleSelectedSpecies', () => {
    it('saves several selected species', async () => {
      const speciesList = times(3, () => createSelectedSpecies());

      await saveMultipleSelectedSpecies(speciesList);

      for (const species of speciesList) {
        const retrievedSpecies = await IndexedDB.get(
          SELECTED_SPECIES_STORE_NAME,
          species.genome_id
        );
        expect(retrievedSpecies).toEqual(species);
      }
    });

    it('updates multiple selected species', async () => {
      const speciesList = times(3, () => createSelectedSpecies());

      // saving the original species
      await saveMultipleSelectedSpecies(speciesList);

      speciesList[0].isEnabled = false;

      await saveMultipleSelectedSpecies(speciesList);

      for (const species of speciesList) {
        const retrievedSpecies = await IndexedDB.get(
          SELECTED_SPECIES_STORE_NAME,
          species.genome_id
        );
        expect(retrievedSpecies).toEqual(species);
      }
    });
  });

  describe('getSelectedSpeciesById', () => {
    it('gets a saved species by its id', async () => {
      const species = createSelectedSpecies();
      await IndexedDB.set(
        SELECTED_SPECIES_STORE_NAME,
        species.genome_id,
        species
      );

      const retrievedSpecies = await getSelectedSpeciesById(species.genome_id);
      expect(retrievedSpecies).toEqual(species);
    });
  });

  describe('getAllSelectedSpecies', () => {
    it('gets all saved species', async () => {
      const speciesList = times(3, () => createSelectedSpecies());

      for (const species of speciesList) {
        await IndexedDB.set(
          SELECTED_SPECIES_STORE_NAME,
          species.genome_id,
          species
        );
      }

      const retrievedSpeciesList = await getAllSelectedSpecies();
      expect(retrievedSpeciesList.length).toBe(speciesList.length);

      for (const species of speciesList) {
        const retrievedSpecies = retrievedSpeciesList.find(
          ({ genome_id }) => genome_id === species.genome_id
        );
        expect(retrievedSpecies).toEqual(species);
      }
    });
  });

  describe('deleteSelectedSpeciesById', () => {
    it('deletes the saved species', async () => {
      const species = createSelectedSpecies();
      await IndexedDB.set(
        SELECTED_SPECIES_STORE_NAME,
        species.genome_id,
        species
      );

      await deleteSelectedSpeciesById(species.genome_id);

      // checking whether the species has been deleted
      const retrievedSpecies = await IndexedDB.get(
        SELECTED_SPECIES_STORE_NAME,
        species.genome_id
      );

      expect(retrievedSpecies).toBe(undefined);
    });
  });

  describe('deleteAllSelectedSpecies', () => {
    it('deletes all saved species', async () => {
      // preparatory step: save some species to the database
      const speciesList = times(3, () => createSelectedSpecies());

      for (const species of speciesList) {
        await IndexedDB.set(
          SELECTED_SPECIES_STORE_NAME,
          species.genome_id,
          species
        );
      }

      await deleteAllSelectedSpecies();

      // check that the selected species db store is empty
      const database = await IndexedDB.getDB();
      const retrievedSpeciesList = await database.getAll(
        SELECTED_SPECIES_STORE_NAME
      );

      expect(retrievedSpeciesList.length).toBe(0);
    });
  });
});
