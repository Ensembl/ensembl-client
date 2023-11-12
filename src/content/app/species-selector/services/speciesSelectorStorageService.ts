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

import { SELECTED_SPECIES_STORE_NAME } from './speciesSelectorStorageConstants';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

// updates a single selected species, or creates a record for this species if it does not exist
export const saveSingleSelectedSpecies = async (
  selectedSpecies: CommittedItem
) => {
  try {
    await IndexedDB.set(
      SELECTED_SPECIES_STORE_NAME,
      selectedSpecies.genome_id,
      selectedSpecies
    );
  } catch {
    // exit without error
  }
};

export const saveMultipleSelectedSpecies = async (
  speciesList: CommittedItem[]
) => {
  try {
    const db = await IndexedDB.getDB();
    const transaction = db.transaction(
      SELECTED_SPECIES_STORE_NAME,
      'readwrite'
    );

    for (const species of speciesList) {
      await transaction.store.put(species, species.genome_id);
    }

    await transaction.done;
  } catch {
    // exit without error
  }
};

export const getSelectedSpeciesById = async (
  id: string
): Promise<CommittedItem | undefined> => {
  try {
    return await IndexedDB.get(SELECTED_SPECIES_STORE_NAME, id);
  } catch {
    return undefined;
  }
};

export const getAllSelectedSpecies = async (): Promise<CommittedItem[]> => {
  try {
    const db = await IndexedDB.getDB();
    return db.getAll(SELECTED_SPECIES_STORE_NAME);
  } catch {
    return [];
  }
};

export const deleteSelectedSpeciesById = async (id: string) => {
  try {
    await IndexedDB.delete(SELECTED_SPECIES_STORE_NAME, id);
  } catch {
    // exit without error
  }
};

export const deleteAllSelectedSpecies = async () => {
  try {
    await IndexedDB.clear(SELECTED_SPECIES_STORE_NAME);
  } catch {
    // exit without error
  }
};
