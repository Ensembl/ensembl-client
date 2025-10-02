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
  saveFocusObject,
  getFocusObject,
  updateFocusObject,
  deleteFocusObject,
  deleteAllFocusObjectsForGenome
} from './focusObjectStorageService';
import { GB_FOCUS_OBJECTS_STORE_NAME } from './focusObjectStorageConstants';

import { createFocusObject } from 'tests/fixtures/focus-object';

import type { FocusGene } from 'src/shared/types/focus-object/focusObjectTypes';

const getDatabase = async () => {
  return await openDB('test-db', 1, {
    upgrade(db) {
      const trackSettingsObjectStore = db.createObjectStore(
        GB_FOCUS_OBJECTS_STORE_NAME
      );
      trackSettingsObjectStore.createIndex('genomeId', 'genomeId', {
        unique: false
      });
    }
  });
};

vi.spyOn(IndexedDB, 'getDB').mockImplementation(() => getDatabase());

describe('focusObjectStorageService', () => {
  const humanGenomeId = 'human';
  const focusGeneId = `${humanGenomeId}:gene:ENSG00000139618.17`;
  let focusGene = createFocusObject('gene') as FocusGene;
  focusGene = {
    ...focusGene,
    genome_id: humanGenomeId,
    object_id: focusGeneId,
    visibleTranscriptIds: [
      'ENST00000380152.8',
      'ENST00000544455.6',
      'ENST00000680887.1'
    ]
  };

  afterEach(async () => {
    await IndexedDB.clear(GB_FOCUS_OBJECTS_STORE_NAME);
  });

  describe('saveFocusObject', () => {
    it('saves a focus object', async () => {
      await saveFocusObject(focusGene);

      const retrievedFocusObjectData = await IndexedDB.get(
        GB_FOCUS_OBJECTS_STORE_NAME,
        focusGeneId
      );
      expect(retrievedFocusObjectData).toBeTruthy();
    });
  });

  describe('getFocusObject', () => {
    it('retrieves stored data about a focus object', async () => {
      await saveFocusObject(focusGene);

      const retrievedFocusObjectData = await getFocusObject(focusGeneId);
      expect(retrievedFocusObjectData?.id).toBe(focusGeneId);
      expect(retrievedFocusObjectData?.genomeId).toBe(humanGenomeId);
      expect(retrievedFocusObjectData?.visibleTranscriptIds).toEqual(
        focusGene.visibleTranscriptIds
      );
    });
  });

  describe('updateFocusObject', () => {
    it('updates stored data about a focus object', async () => {
      await saveFocusObject(focusGene);

      const updatedFocusGene = {
        ...focusGene,
        visibleTranscriptIds: ['ENST00000530893.6', 'ENST00000528762.1']
      };
      await updateFocusObject(focusGeneId, updatedFocusGene);
      const retrievedFocusObjectData = await getFocusObject(focusGeneId);

      expect(retrievedFocusObjectData?.id).toBe(focusGeneId);
      expect(retrievedFocusObjectData?.genomeId).toBe(humanGenomeId);
      expect(retrievedFocusObjectData?.visibleTranscriptIds).toEqual(
        updatedFocusGene.visibleTranscriptIds
      );
    });
  });

  describe('deleteFocusObject', () => {
    it('deletes stored data about a focus object', async () => {
      await saveFocusObject(focusGene);

      await deleteFocusObject(focusGene.object_id);

      const retrievedFocusObjectData = await getFocusObject(focusGeneId);
      expect(retrievedFocusObjectData).toBeFalsy();
    });
  });

  describe('deleteAllFocusObjectsForGenome', () => {
    const getAllFocusObjectsForGenome = async (genomeId: string) => {
      const database = await IndexedDB.getDB();
      return database.getAllFromIndex(
        GB_FOCUS_OBJECTS_STORE_NAME,
        'genomeId',
        genomeId
      );
    };

    it('deletes all focus objects for ', async () => {
      const secondFocusGene = createFocusObject('gene') as FocusGene;
      const thirdFocusGene = createFocusObject('gene') as FocusGene;
      secondFocusGene.genome_id = humanGenomeId;
      thirdFocusGene.genome_id = humanGenomeId;

      await saveFocusObject(focusGene);
      await saveFocusObject(secondFocusGene);
      await saveFocusObject(thirdFocusGene);

      let storedFocusObjects = await getAllFocusObjectsForGenome(humanGenomeId);
      expect(storedFocusObjects.length).toBe(3); // just verifying that all three focus objects are saved and can be retrieved

      await deleteAllFocusObjectsForGenome(humanGenomeId);
      storedFocusObjects = await getAllFocusObjectsForGenome(humanGenomeId);
      expect(storedFocusObjects.length).toBe(0); // data for focus objects should be deleted now
    });
  });
});
