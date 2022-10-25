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

import { GB_FOCUS_OBJECTS_STORE_NAME } from './focusObjectStorageConstants';

import type { FocusGene } from 'src/shared/types/focus-object/focusObjectTypes';

type StorableFocusObject = FocusGene;

export type StoredFocusObject = StoredFocusGene;

export type StoredFocusGene = {
  id: string;
  genomeId: string;
  type: 'gene';
  visibleTranscriptIds: string[] | null;
  createdAt: number; // timestamp, in milliseconds
  updatedAt: number; // timestamp, in milliseconds
};

export const saveFocusObject = async (focusObject: StorableFocusObject) => {
  const storableData = buildFocusObjectDataForStorage(focusObject);
  await IndexedDB.set(
    GB_FOCUS_OBJECTS_STORE_NAME,
    focusObject.object_id,
    storableData
  );
};

export const getFocusObject = async (
  focusObjectId: string
): Promise<StoredFocusObject | undefined> => {
  return await IndexedDB.get(GB_FOCUS_OBJECTS_STORE_NAME, focusObjectId);
};

export const updateFocusObject = async (
  focusObjectId: string,
  focusObject: StorableFocusObject
) => {
  const storedFocusObject = await getFocusObject(focusObjectId);
  if (!storedFocusObject) {
    await saveFocusObject(focusObject);
  } else {
    const { createdAt } = storedFocusObject;
    const newData = {
      ...buildFocusObjectDataForStorage(focusObject),
      createdAt // keep the createdAt field unmodified
    };
    await IndexedDB.set(
      GB_FOCUS_OBJECTS_STORE_NAME,
      focusObject.object_id,
      newData
    );
  }
};

export const deleteFocusObject = async (focusObjectId: string) => {
  await IndexedDB.delete(GB_FOCUS_OBJECTS_STORE_NAME, focusObjectId);
};

// useful for cleanup after a species is removed
export const deleteAllFocusObjectsForGenome = async (genomeId: string) => {
  const database = await IndexedDB.getDB();
  const focusObjectsForGenome: Awaited<StoredFocusObject[]> =
    await database.getAllFromIndex(
      GB_FOCUS_OBJECTS_STORE_NAME,
      'genomeId',
      genomeId
    );

  for (const focusObject of focusObjectsForGenome) {
    await IndexedDB.delete(GB_FOCUS_OBJECTS_STORE_NAME, focusObject.id);
  }
};

const buildFocusObjectDataForStorage = (focusObject: StorableFocusObject) => {
  if (focusObject.type === 'gene') {
    return buildFocusGeneStorageData(focusObject);
  }
};

const buildFocusGeneStorageData = (focusGene: FocusGene): StoredFocusGene => ({
  id: focusGene.object_id,
  genomeId: focusGene.genome_id,
  type: 'gene',
  visibleTranscriptIds: focusGene.visibleTranscriptIds,
  createdAt: Date.now(),
  updatedAt: Date.now()
});
