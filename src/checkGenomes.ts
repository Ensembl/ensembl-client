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

import config from 'config';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { checkNeedToUpdateGenomes } from 'src/shared/validators/genomeValidators';

import {
  getAllSelectedSpecies,
  saveMultipleSelectedSpecies,
  deleteSelectedSpeciesById
} from 'src/content/app/species-selector/services/speciesSelectorStorageService';
import { deleteTrackSettingsForGenome } from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageService';
import { deleteAllFocusObjectsForGenome as deleteGenomeBrowserFocusObjectsForGenome } from 'src/content/app/genome-browser/services/focus-objects/focusObjectStorageService';
import { deletePreviouslyViewedObjectsForGenome } from 'src/shared/services/previouslyViewedObjectsStorageService';
import browserStorageService from './content/app/genome-browser/services/browserStorageService';
import entityViewerStorageService from 'src/content/app/entity-viewer/services/entity-viewer-storage-service';

import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

export const checkGenomes = async () => {
  try {
    const locallyStoredGenomes = await getAllSelectedSpecies();

    const localGenomeIds = locallyStoredGenomes.map(
      (genome) => genome.genome_id
    );

    const referenceGenomePromises = localGenomeIds.map((genomeId) => {
      const url = `${config.metadataApiBaseUrl}/genome/${genomeId}/explain`;
      return fetch(url).then((response) =>
        response.json()
      ) as Promise<BriefGenomeSummary>;
    });

    const referenceGenomes = await Promise.all(referenceGenomePromises);

    const checkResult = checkNeedToUpdateGenomes({
      localGenomes: locallyStoredGenomes,
      referenceGenomes
    });

    if (checkResult.shouldUpdateGenomes) {
      const { genomes, genomeIdsToDelete } = checkResult;

      for (const genomeIdToDelete of genomeIdsToDelete) {
        await deleteGenome(genomeIdToDelete);
      }

      await saveMultipleSelectedSpecies(genomes);

      // make sure that the genome id that was supposed to be deleted
      // isn't in the current url
      for (const genomeIdToDelete of genomeIdsToDelete) {
        if (window.location.href.includes(genomeIdToDelete)) {
          // navigate to genome selector
          window.location.replace(urlFor.speciesSelector());
        }
        await deleteGenome(genomeIdToDelete);
      }
    }
  } catch {
    // not sure what to do; ignore the errors for now
  }
};

const deleteGenome = async (genomeId: string) => {
  // Delete genome information itself
  await deleteSelectedSpeciesById(genomeId);

  await deleteTrackSettingsForGenome(genomeId);
  await deleteGenomeBrowserFocusObjectsForGenome(genomeId);
  await deletePreviouslyViewedObjectsForGenome(genomeId);

  // Some information is still stored in localStorage
  browserStorageService.deleteGenome(genomeId);
  entityViewerStorageService.deleteGenome(genomeId);
};
