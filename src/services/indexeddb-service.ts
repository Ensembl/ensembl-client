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

import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'ensembl-website';
const DB_VERSION = 1;

const getDbPromise = () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // FIXME use constants for object store names
      if (!db.objectStoreNames.contains('contact-forms')) {
        db.createObjectStore('contact-forms');
      }
      if (!db.objectStoreNames.contains('blast-submissions')) {
        db.createObjectStore('blast-submissions');
      }
    }
  });
};

class IndexedDB {
  static db: IDBPDatabase | null = null;

  private static async getDB() {
    if (!this.db) {
      this.db = await getDbPromise();
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
}

export default IndexedDB;
