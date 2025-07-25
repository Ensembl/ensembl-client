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

import { openDB, IDBPDatabase, type OpenDBCallbacks } from 'idb';

import { GENERAL_UI_STORE_NAME } from 'src/shared/services/generalUIStorageConstants';
import { SELECTED_SPECIES_STORE_NAME } from 'src/content/app/species-selector/services/speciesSelectorStorageConstants';
import { GB_TRACK_SETTINGS_STORE_NAME } from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageConstants';
import { GB_FOCUS_OBJECTS_STORE_NAME } from 'src/content/app/genome-browser/services/focus-objects/focusObjectStorageConstants';
import { BLAST_SUBMISSIONS_STORE_NAME } from 'src/content/app/tools/blast/services/blastStorageServiceConstants';
import { VEP_SUBMISSIONS_STORE_NAME } from 'src/content/app/tools/vep/services/vepStorageServiceConstants';
import { PREVIOUSLY_VIEWED_OBJECTS_STORE_NAME } from 'src/shared/services/previouslyViewedObjectsStorageConstants';
import { NOTIFICATIONS_STORE_NAME } from 'src/shared/services/notificationsStorageConstants';

import { IndexedDBUpdateScheduler } from './indexeddb-migrations/dbUpdateScheduler';

import { migrateSpeciesStore } from './indexeddb-migrations/speciesStoreMigrations';

const DB_NAME = 'ensembl-website';
const DB_VERSION = 8;

const getDbPromise = (params?: {
  onBlocking?: OpenDBCallbacks<unknown>['blocking'];
}) => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, _, transaction) {
      const asyncTaskScheduler = new IndexedDBUpdateScheduler();

      // FIXME use constants for object store names
      if (!db.objectStoreNames.contains('contact-forms')) {
        db.createObjectStore('contact-forms');
      }
      if (!db.objectStoreNames.contains(GENERAL_UI_STORE_NAME)) {
        db.createObjectStore(GENERAL_UI_STORE_NAME);
      }
      if (!db.objectStoreNames.contains(SELECTED_SPECIES_STORE_NAME)) {
        db.createObjectStore(SELECTED_SPECIES_STORE_NAME);
      } else {
        migrateSpeciesStore({
          db,
          oldVersion,
          transaction,
          scheduler: asyncTaskScheduler
        });
      }
      if (!db.objectStoreNames.contains(BLAST_SUBMISSIONS_STORE_NAME)) {
        db.createObjectStore(BLAST_SUBMISSIONS_STORE_NAME);
      }
      if (!db.objectStoreNames.contains(VEP_SUBMISSIONS_STORE_NAME)) {
        db.createObjectStore(VEP_SUBMISSIONS_STORE_NAME);
      }
      if (!db.objectStoreNames.contains(PREVIOUSLY_VIEWED_OBJECTS_STORE_NAME)) {
        db.createObjectStore(PREVIOUSLY_VIEWED_OBJECTS_STORE_NAME);
      }
      if (!db.objectStoreNames.contains(NOTIFICATIONS_STORE_NAME)) {
        db.createObjectStore(NOTIFICATIONS_STORE_NAME);
      }
      if (!db.objectStoreNames.contains(GB_TRACK_SETTINGS_STORE_NAME)) {
        const trackSettingsObjectStore = db.createObjectStore(
          GB_TRACK_SETTINGS_STORE_NAME,
          { keyPath: ['genomeId', 'trackId'] }
        );
        trackSettingsObjectStore.createIndex('genomeId', 'genomeId', {
          unique: false
        });
      }
      if (!db.objectStoreNames.contains(GB_FOCUS_OBJECTS_STORE_NAME)) {
        const trackSettingsObjectStore = db.createObjectStore(
          GB_FOCUS_OBJECTS_STORE_NAME
        );
        trackSettingsObjectStore.createIndex('genomeId', 'genomeId', {
          unique: false
        });
      }

      asyncTaskScheduler.runTasks({
        onComplete: () => {
          // To pick up the new data and avoid client-side errors, do a full-page reload
          window.location.reload();
        }
      });
    },
    blocking(...args) {
      params?.onBlocking?.(...args);
    }
  });
};

class IndexedDB {
  static db: IDBPDatabase | null = null;

  static async getDB() {
    if (!this.db) {
      this.db = await getDbPromise({
        onBlocking: () => {
          if (!this.db) {
            return;
          }
          /**
           * When this callback is executed, it means that
           * the tab in which this code is running has a connection to IndexedDB
           * that is blocking another tab from upgrading IndexedDB to the latest version.
           * Upon receiving this event, the current tab should close its connection to IndexedDB,
           * and reload to get the latest version of the software.
           */
          this.db.close();
          this.db = null;
          window.location.reload();
        }
      });
    }
    return this.db;
  }

  static async get(store: string, key: IDBValidKey) {
    const db = await this.getDB();
    return db.get(store, key);
  }

  static async set(store: string, key: IDBValidKey, value: any) {
    const db = await this.getDB();
    return db.put(store, value, key);
  }

  static async delete(store: string, key: IDBValidKey) {
    const db = await this.getDB();
    return db.delete(store, key);
  }

  static async clear(store: string) {
    const db = await this.getDB();
    return db.clear(store);
  }

  static async keys(store: string) {
    const db = await this.getDB();
    return db.getAllKeys(store);
  }

  static async clearDatabase() {
    const db = await this.getDB();
    const objectStoreNames = db.objectStoreNames;
    for (const store of objectStoreNames) {
      await db.clear(store);
    }
  }
}

export default IndexedDB;
