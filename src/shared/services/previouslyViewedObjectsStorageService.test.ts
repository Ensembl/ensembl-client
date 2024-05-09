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
  PREVIOUSLY_VIEWED_OBJECTS_STORE_NAME as STORE_NAME,
  GENOME_BROWSER_PREFIX,
  ENTITY_VIEWER_PREFIX
} from './previouslyViewedObjectsStorageConstants';

import {
  savePreviouslyViewedGenomeBrowserObjects,
  savePreviouslyViewedEntities,
  getPreviouslyViewedGenomeBrowserObjects,
  getPreviouslyViewedEntities,
  deletePreviouslyViewedObjectsForGenome,
  getAllPreviouslyViewedGenomeBrowserObjects,
  getAllPreviouslyViewedEntities
} from './previouslyViewedObjectsStorageService';

import type { PreviouslyViewedObject as PreviouslyViewedGenomeBrowserObject } from 'src/content/app/genome-browser/state/browser-bookmarks/browserBookmarksSlice';
import type { PreviouslyViewedEntity } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSlice';

const getDatabase = async () => {
  return await openDB('test-db', 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    }
  });
};

jest.spyOn(IndexedDB, 'getDB').mockImplementation(() => getDatabase());

afterEach(async () => {
  await IndexedDB.clear(STORE_NAME);
});

describe('previouslyViewedObjectsStorageService', () => {
  describe('storing objects viewed in the genome browser', () => {
    const genomeId = 'human';
    const previouslyViewedObject: PreviouslyViewedGenomeBrowserObject = {
      genome_id: genomeId,
      object_id: 'ENSG0000001',
      type: 'gene',
      label: ['MyGene', 'ENSG0000001']
    };

    test('save objects viewed in the genome browser', async () => {
      await savePreviouslyViewedGenomeBrowserObjects(genomeId, [
        previouslyViewedObject
      ]);

      // now read back the stored option
      const retrievedData = await IndexedDB.get(STORE_NAME, [
        GENOME_BROWSER_PREFIX,
        genomeId
      ]);
      expect(retrievedData).toEqual([previouslyViewedObject]);
    });

    test('retrieve stored objects viewed in the genome browser', async () => {
      // write species name display option to indexed db directly, without using the service
      await IndexedDB.set(
        STORE_NAME,
        [GENOME_BROWSER_PREFIX, genomeId],
        [previouslyViewedObject]
      );

      const retrievedData =
        await getPreviouslyViewedGenomeBrowserObjects(genomeId);
      expect(retrievedData).toEqual([previouslyViewedObject]);
    });

    test('clean up stored objects before returning them', async () => {
      const invalidObject = {
        id: 'foo',
        label: 'I am invalid'
      };

      // write species name display option to indexed db directly, without using the service
      await IndexedDB.set(
        STORE_NAME,
        [GENOME_BROWSER_PREFIX, genomeId],
        [previouslyViewedObject, invalidObject]
      );

      const retrievedData =
        await getPreviouslyViewedGenomeBrowserObjects(genomeId);
      // the invalid object should have been filtered out from the retrieved data
      expect(retrievedData).toEqual([previouslyViewedObject]);
    });
  });

  describe('storing objects viewed in the entity viewer', () => {
    const genomeId = 'human';
    const previouslyViewedObject: PreviouslyViewedEntity = {
      id: 'ENSG0000001.1',
      urlId: 'ENSG0000001',
      type: 'gene',
      label: ['MyGene', 'ENSG0000001']
    };

    test('save objects viewed in the entity viewer', async () => {
      await savePreviouslyViewedEntities(genomeId, [previouslyViewedObject]);

      // now read back the stored option
      const retrievedData = await IndexedDB.get(STORE_NAME, [
        ENTITY_VIEWER_PREFIX,
        genomeId
      ]);
      expect(retrievedData).toEqual([previouslyViewedObject]);
    });

    test('retrieve stored objects viewed in the entity viewer', async () => {
      // write species name display option to indexed db directly, without using the service
      await IndexedDB.set(
        STORE_NAME,
        [ENTITY_VIEWER_PREFIX, genomeId],
        [previouslyViewedObject]
      );

      const retrievedData = await getPreviouslyViewedEntities(genomeId);
      expect(retrievedData).toEqual([previouslyViewedObject]);
    });

    test('clean up stored objects before returning them', async () => {
      const invalidObject = {
        id: 'foo',
        label: 'I am invalid'
      };

      // write species name display option to indexed db directly, without using the service
      await IndexedDB.set(
        STORE_NAME,
        [ENTITY_VIEWER_PREFIX, genomeId],
        [previouslyViewedObject, invalidObject]
      );

      const retrievedData = await getPreviouslyViewedEntities(genomeId);
      // the invalid object should have been filtered out from the retrieved data
      expect(retrievedData).toEqual([previouslyViewedObject]);
    });
  });

  describe('retrieval of all objects per app', () => {
    const humanGenomeId = 'human';
    const mouseGenomeId = 'mouse';
    const humanGenomeBrowserObject: PreviouslyViewedGenomeBrowserObject = {
      genome_id: humanGenomeId,
      object_id: 'ENSG0000001',
      type: 'gene',
      label: ['MyGene', 'ENSG0000001']
    };
    const humanEntityViewerObject: PreviouslyViewedEntity = {
      id: 'ENSG0000001.1',
      urlId: 'ENSG0000001',
      type: 'gene',
      label: ['MyGene', 'ENSG0000001']
    };
    const mouseGenomeBrowserObject = {
      ...humanGenomeBrowserObject,
      genome_id: mouseGenomeId,
      object_id: 'ENSM0000001'
    };
    const mouseEntityViewerObject = {
      ...humanEntityViewerObject,
      id: 'ENSM0000001'
    };

    beforeEach(async () => {
      await IndexedDB.set(
        STORE_NAME,
        [GENOME_BROWSER_PREFIX, humanGenomeId],
        [humanGenomeBrowserObject]
      );
      await IndexedDB.set(
        STORE_NAME,
        [ENTITY_VIEWER_PREFIX, humanGenomeId],
        [humanEntityViewerObject]
      );
      await IndexedDB.set(
        STORE_NAME,
        [GENOME_BROWSER_PREFIX, mouseGenomeId],
        [mouseGenomeBrowserObject]
      );
      await IndexedDB.set(
        STORE_NAME,
        [ENTITY_VIEWER_PREFIX, mouseGenomeId],
        [mouseEntityViewerObject]
      );
    });

    test('retrieve all objects viewed in the genome browser', async () => {
      const retrievedData = await getAllPreviouslyViewedGenomeBrowserObjects();
      expect(retrievedData[humanGenomeId]).toEqual([humanGenomeBrowserObject]);
      expect(retrievedData[mouseGenomeId]).toEqual([mouseGenomeBrowserObject]);
    });

    test('retrieve all objects viewed in the entity viewer', async () => {
      const retrievedData = await getAllPreviouslyViewedEntities();
      expect(retrievedData[humanGenomeId]).toEqual([humanEntityViewerObject]);
      expect(retrievedData[mouseGenomeId]).toEqual([mouseEntityViewerObject]);
    });
  });

  describe('deletePreviouslyViewedObjectsForGenome', () => {
    const humanGenomeId = 'human';
    const mouseGenomeId = 'mouse';
    const humanGenomeBrowserObject: PreviouslyViewedGenomeBrowserObject = {
      genome_id: humanGenomeId,
      object_id: 'ENSG0000001',
      type: 'gene',
      label: ['MyGene', 'ENSG0000001']
    };
    const humanEntityViewerObject: PreviouslyViewedEntity = {
      id: 'ENSG0000001.1',
      urlId: 'ENSG0000001',
      type: 'gene',
      label: ['MyGene', 'ENSG0000001']
    };
    const mouseGenomeBrowserObject = {
      ...humanGenomeBrowserObject,
      genome_id: mouseGenomeId,
      object_id: 'ENSM0000001'
    };
    const mouseEntityViewerObject = {
      ...humanEntityViewerObject,
      id: 'ENSM0000001'
    };

    it('deletes all previously viewed objects for a given genome', async () => {
      // prepare the database by storing a couple of objects in it
      await IndexedDB.set(
        STORE_NAME,
        [GENOME_BROWSER_PREFIX, humanGenomeId],
        [humanGenomeBrowserObject]
      );
      await IndexedDB.set(
        STORE_NAME,
        [ENTITY_VIEWER_PREFIX, humanGenomeId],
        [humanEntityViewerObject]
      );
      await IndexedDB.set(
        STORE_NAME,
        [GENOME_BROWSER_PREFIX, mouseGenomeId],
        [mouseGenomeBrowserObject]
      );
      await IndexedDB.set(
        STORE_NAME,
        [ENTITY_VIEWER_PREFIX, mouseGenomeId],
        [mouseEntityViewerObject]
      );

      await deletePreviouslyViewedObjectsForGenome(humanGenomeId);

      const db = await IndexedDB.getDB();
      const retrievedData = await db.getAll(STORE_NAME); // this is going to be an array of arrays of previously viewed objects

      // make sure that in the retrieved data, the genome browser object goes before the entitiy viewer object
      const sortedData = retrievedData.flat().toSorted((obj1, obj2) => {
        if ('object_id' in obj1) {
          return -1;
        } else if ('object_id' in obj2) {
          return 1;
        } else {
          return 0;
        }
      });

      expect(sortedData).toEqual([
        mouseGenomeBrowserObject,
        mouseEntityViewerObject
      ]);
    });
  });
});
