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

import IndexedDB from 'src/services/indexeddb-service';

import {
  PREVIOUSLY_VIEWED_OBJECTS_STORE_NAME as STORE_NAME,
  GENOME_BROWSER_PREFIX,
  ENTITY_VIEWER_PREFIX,
  type APP_PREFIX_TYPE
} from './previouslyViewedObjectsStorageConstants';

import type { PreviouslyViewedObject as PreviouslyViewedGenomeBrowserObject } from 'src/content/app/genome-browser/state/browser-bookmarks/browserBookmarksSlice';
import type { PreviouslyViewedEntity } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSlice';

/**
store:
previously-viewed-objects

key: ['genome-browser', 'genome_id']: [{},{},{},,,]
 */

type StoredObject =
  | PreviouslyViewedGenomeBrowserObject // from the Genome Browser
  | PreviouslyViewedEntity; // from EntityViewer

// NOTE: you probably don't want to use this function directly.
// Use the functions for specific apps below
export const savePreviouslyViewedObjects = async (
  appPrefix: APP_PREFIX_TYPE,
  genomeId: string,
  value: StoredObject[]
) => {
  const key = generateKey(appPrefix, genomeId);
  await IndexedDB.set(STORE_NAME, key, value);
};

// NOTE: you probably don't want to use this function directly.
// Use the functions for specific apps below
export const getPreviouslyViewedObjects = async (
  appPrefix: APP_PREFIX_TYPE,
  genomeId: string
): Promise<StoredObject[]> => {
  const key = generateKey(appPrefix, genomeId);

  const savedData = await IndexedDB.get(STORE_NAME, key);

  // TODO: validate the data?
  if (savedData) {
    return savedData;
  } else {
    return [];
  }
};

// when a genome is removed, delete all previously viewed objects from all apps
export const deletePreviouslyViewedObjectsForGenome = async (
  genomeId: string
) => {
  const db = await IndexedDB.getDB();
  const allKeys = await db.getAllKeys(STORE_NAME);
  const keysForDeletion = allKeys.filter((key) => {
    const [, genomeIdInKey] = key as string[];
    return genomeId === genomeIdInKey;
  });

  const transaction = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all(
    keysForDeletion.map((key) => transaction.store.delete(key))
  );
  await transaction.done;
};

const generateKey = (appPrefix: APP_PREFIX_TYPE, genomeId: string) => [
  appPrefix,
  genomeId
];

/**** App-specific functions ****/

export const savePreviouslyViewedGenomeBrowserObjects = async (
  genomeId: string,
  objects: PreviouslyViewedGenomeBrowserObject[]
) => {
  await savePreviouslyViewedObjects(GENOME_BROWSER_PREFIX, genomeId, objects);
};

export const getPreviouslyViewedGenomeBrowserObjects = async (
  genomeId: string
): Promise<PreviouslyViewedGenomeBrowserObject[]> => {
  const objects = await getPreviouslyViewedObjects(
    GENOME_BROWSER_PREFIX,
    genomeId
  );

  // TODO: Typescript 5.5 will have Inferred Type Predicates, and should correctly infer the type returned from filter
  return objects.filter((object) =>
    isPreviouslyViewedGenomeBrowserObject(object)
  ) as PreviouslyViewedGenomeBrowserObject[];
};

export const savePreviouslyViewedEntities = async (
  genomeId: string,
  objects: PreviouslyViewedEntity[]
) => {
  await savePreviouslyViewedObjects(ENTITY_VIEWER_PREFIX, genomeId, objects);
};

export const getPreviouslyViewedEntities = async (
  genomeId: string
): Promise<PreviouslyViewedEntity[]> => {
  const objects = await getPreviouslyViewedObjects(
    ENTITY_VIEWER_PREFIX,
    genomeId
  );

  // TODO: Typescript 5.5 will have Inferred Type Predicates, and should correctly infer the type returned from filter
  return objects.filter((object) =>
    isPreviouslyViewedEntity(object)
  ) as PreviouslyViewedEntity[];
};

/**** Validators ****/
const isPreviouslyViewedGenomeBrowserObject = (
  object: unknown
): object is PreviouslyViewedGenomeBrowserObject => {
  const expectedFields: Array<keyof PreviouslyViewedGenomeBrowserObject> = [
    'genome_id',
    'object_id',
    'type',
    'label'
  ];

  for (const key of expectedFields) {
    if (object && typeof object === 'object' && !(key in object)) {
      return false;
    }
  }
  return true;
};

const isPreviouslyViewedEntity = (
  object: unknown
): object is PreviouslyViewedEntity => {
  const expectedFields: Array<keyof PreviouslyViewedEntity> = [
    'id',
    'urlId',
    'type',
    'label'
  ];

  for (const key of expectedFields) {
    if (object && typeof object === 'object' && !(key in object)) {
      return false;
    }
  }
  return true;
};
