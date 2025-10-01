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
import { openDB } from 'idb';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { waitFor } from '@testing-library/react';
import times from 'lodash/times';

import { SELECTED_SPECIES_STORE_NAME } from 'src/content/app/species-selector/services/speciesSelectorStorageConstants';

import { migrateSpeciesStore } from 'src/services/indexeddb-migrations/speciesStoreMigrations';
import { IndexedDBUpdateScheduler } from 'src/services/indexeddb-migrations/dbUpdateScheduler';
import { createSelectedSpecies } from 'tests/fixtures/selected-species';

const mockMetadataBaseApi = 'http://metadata-api';

vi.mock('config', () => ({
  metadataApiBaseUrl: 'http://metadata-api'
}));

const server = setupServer(
  http.get(`${mockMetadataBaseApi}/genome/:genomeId/explain`, ({ params }) => {
    const { genomeId } = params;

    const minimalGenomeData = {
      genome_id: genomeId,
      release: {
        name: 'new-release',
        type: 'integrated'
      }
    };

    return HttpResponse.json(minimalGenomeData);
  })
);

beforeAll(() =>
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    }
  })
);
beforeEach(() => {
  // create a fresh copy of the database
  indexedDB = new IDBFactory();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('v6 -> v7 migration', () => {
  // During migration to version 7,
  // all stored species should receive a release field

  const oldVersion = 6;
  const newVersion = 7;

  test('adding release information to stored species', async () => {
    // Create a db using a version prior to when genome releases were introduced
    const oldDb = await openDB('test-db', oldVersion, {
      upgrade(db) {
        db.createObjectStore(SELECTED_SPECIES_STORE_NAME);
      }
    });

    const speciesList = times(3, () => {
      const species = createSelectedSpecies() as any;
      delete species['release'];
      return species;
    });

    // Just making sure that species don't have the release field before saving
    expect(speciesList.every((species) => species.release === undefined)).toBe(
      true
    );

    // Save the species into the database
    for (const species of speciesList) {
      await oldDb.put(SELECTED_SPECIES_STORE_NAME, species, species.genome_id);
    }

    oldDb.close();

    // Now run the db migration
    const newDb = await openDB('test-db', newVersion, {
      upgrade(db, oldVersion, __, transaction) {
        const asyncTaskScheduler = new IndexedDBUpdateScheduler();
        migrateSpeciesStore({
          db,
          oldVersion,
          transaction,
          scheduler: asyncTaskScheduler
        });
        asyncTaskScheduler.runTasks();
      }
    });

    await waitFor(async () => {
      // Read back the species, and confirm that all of them now have release data
      const retrievedSpecies = await newDb.getAll(SELECTED_SPECIES_STORE_NAME);
      expect(
        retrievedSpecies.every((species) => species.release !== undefined)
      ).toBe(true);
    });
  });

  // Make sure release data isn't modified in the future
  test('no changes to species stored after version 7', async () => {
    const versionSeven = 7;
    const versionEight = 8;
    const newReleaseName = 'new-and-shiny';

    const oldDb = await openDB('test-db', versionSeven, {
      upgrade(db) {
        db.createObjectStore(SELECTED_SPECIES_STORE_NAME);
      }
    });

    const speciesList = times(3, () => {
      const species = createSelectedSpecies({
        release: {
          name: newReleaseName,
          type: 'integrated'
        }
      });
      return species;
    });

    // Save the species into the database
    for (const species of speciesList) {
      await oldDb.put(SELECTED_SPECIES_STORE_NAME, species, species.genome_id);
    }

    oldDb.close();

    // Now run the db migration
    const newDb = await openDB('test-db', versionEight, {
      upgrade(db, oldVersion, __, transaction) {
        const asyncTaskScheduler = new IndexedDBUpdateScheduler();
        migrateSpeciesStore({
          db,
          oldVersion,
          transaction,
          scheduler: asyncTaskScheduler
        });
        asyncTaskScheduler.runTasks();
      }
    });

    // Read back the species, and confirm that their release data hasn't changed
    const retrievedSpecies = await newDb.getAll(SELECTED_SPECIES_STORE_NAME);
    expect(
      retrievedSpecies.every(
        (species) => species.release.name === newReleaseName
      )
    ).toBe(true);
  });
});

describe('v7 -> v8 migration', () => {
  // During migration to version 8,
  // all stored species should receive an `addedAt` field,
  // with a unique timestamp

  test('a field with a timestamp is added to stored species', async () => {
    const oldDbVersion = 7;
    const newDbVersion = 8;

    // Create a db using a version prior to when timestamps for saved species were introduced
    const oldDb = await openDB('test-db', oldDbVersion, {
      upgrade(db) {
        db.createObjectStore(SELECTED_SPECIES_STORE_NAME);
      }
    });

    const speciesList = times(3, () => {
      const species = createSelectedSpecies() as any;
      delete species['addedAt'];
      return species;
    });

    // Just making sure that species don't have the addedAt field before saving
    expect(speciesList.every((species) => species.addedAt === undefined)).toBe(
      true
    );

    // Save the species into the database
    for (const species of speciesList) {
      await oldDb.put(SELECTED_SPECIES_STORE_NAME, species, species.genome_id);
    }

    oldDb.close();

    // Now run the db migration
    const newDb = await openDB('test-db', newDbVersion, {
      upgrade(db, oldVersion, __, transaction) {
        const asyncTaskScheduler = new IndexedDBUpdateScheduler();
        migrateSpeciesStore({
          db,
          oldVersion,
          transaction,
          scheduler: asyncTaskScheduler
        });
        asyncTaskScheduler.runTasks();
      }
    });

    const retrievedSpecies = await newDb.getAll(SELECTED_SPECIES_STORE_NAME);
    expect(
      retrievedSpecies.every((species) => species.addedAt !== undefined)
    ).toBe(true);
  });
});
