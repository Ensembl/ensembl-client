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

import type { IDBPDatabase, IDBPTransaction } from 'idb';

import config from 'config';

import { SELECTED_SPECIES_STORE_NAME } from 'src/content/app/species-selector/services/speciesSelectorStorageConstants';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { Release } from 'src/shared/types/release';
import type { IndexedDBUpdateScheduler } from './dbUpdateScheduler';

export const migrateSpeciesStore = ({
  db,
  oldVersion,
  transaction,
  scheduler
}: {
  db: IDBPDatabase;
  oldVersion: number;
  transaction: IDBPTransaction<unknown, string[], 'versionchange'>;
  scheduler: IndexedDBUpdateScheduler;
}) => {
  if (oldVersion <= 6) {
    scheduler.addTask(() => runSixToSevenMigration({ db, transaction }));
  }
  if (oldVersion <= 7) {
    runSevenToEightMigration({ transaction });
  }
};

// Species saved to indexedDB before version 7 do not have release information on them.
// During the migration, fetch this information from the 'explain' endpoint,
// and update the saved species
const runSixToSevenMigration = async ({
  db,
  transaction
}: {
  db: IDBPDatabase;
  transaction: IDBPTransaction<unknown, string[], 'versionchange'>;
}) => {
  // use the 'versionchange' transaction to read the saved genomes from the store
  const speciesStore = transaction.objectStore(SELECTED_SPECIES_STORE_NAME);

  const allSpecies: CommittedItem[] = await speciesStore.getAll();
  await transaction.done;

  if (!allSpecies.length) {
    return;
  }

  const releaseRequestPromises = allSpecies.map(async (species) => {
    const genomeId = species.genome_id;
    const url = `${config.metadataApiBaseUrl}/genome/${genomeId}/explain`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return {
        ...species,
        release: data.release as Release
      };
    } catch {
      return null;
    }
  });
  const updatedSpeciesList = await Promise.all(releaseRequestPromises);

  for await (const [index, species] of allSpecies.entries()) {
    const updatedSpeciesData = updatedSpeciesList[index];
    if (updatedSpeciesData) {
      const speciesWithRelease = {
        ...species,
        release: updatedSpeciesData.release
      };
      await db.put(
        SELECTED_SPECIES_STORE_NAME,
        speciesWithRelease,
        species.genome_id
      );
    } else {
      // failed to fetch data for a genome; something has gone wrong; delete the genome from the store
      await db.delete(SELECTED_SPECIES_STORE_NAME, species.genome_id);
    }
  }
};

// Species saved to indexedDB before version 8 do not the timestamp
// recording when they were added (selected) by the user.
// This timestamp is used to ensure a stable sorting order of selected species lozenges.
// During the migration, add a unique now-ish timestamp to each of the stored species.
const runSevenToEightMigration = async ({
  transaction
}: {
  transaction: IDBPTransaction<unknown, string[], 'versionchange'>;
}) => {
  const speciesStore = transaction.objectStore(SELECTED_SPECIES_STORE_NAME);
  const allSpecies: CommittedItem[] = await speciesStore.getAll();

  const timestamp = Date.now();

  allSpecies.forEach((species, index) => {
    species.selectedAt = timestamp + index;
  });

  for (const species of allSpecies) {
    await speciesStore.put(species, species.genome_id);
  }
};
