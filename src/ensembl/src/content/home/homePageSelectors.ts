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

import * as urlFor from 'src/shared/helpers/urlHelper';
import { getChrLocationStr } from 'src/content/app/browser/browserHelper';

import {
  getBrowserActiveEnsObjectIds,
  getAllChrLocations
} from 'src/content/app/browser/browserSelectors';
import {
  getEnsObjectById,
  getEnsObjectLoadingStatus
} from 'src/shared/state/ens-object/ensObjectSelectors';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { LoadingState } from 'src/shared/types/loading-state';

import { RootState } from 'src/store';

export type PreviouslyViewedGenomeBrowserObject = {
  speciesName: string;
  assemblyName: string;
  link: string;
};

export type PreviouslyViewedGenomeBrowserObjects = {
  areLoading: boolean;
  objects: PreviouslyViewedGenomeBrowserObject[];
};

export const getPreviouslyViewedGenomeBrowserObjects = (
  state: RootState
): PreviouslyViewedGenomeBrowserObjects => {
  const ensObjectIdsMap = getBrowserActiveEnsObjectIds(state);
  const chrLocations = getAllChrLocations(state);
  const committedSpecies = getCommittedSpecies(state);

  const ensObjectMap: {
    [genomeId: string]: {
      speciesName: string;
      assemblyName: string;
      ensObjectId: string;
    };
  } = Object.keys(ensObjectIdsMap).reduce((result, genomeId) => {
    const ensObjectId = ensObjectIdsMap[genomeId];
    const ensObject = getEnsObjectById(state, ensObjectId);
    const species = committedSpecies.find(
      (species) => species.genome_id === genomeId
    );

    if (!ensObject || !species) {
      return result;
    } else {
      const speciesName = species.common_name || species.scientific_name;
      const assemblyName = species.assembly_name;
      const ensObjectId = ensObject.object_id;
      return {
        ...result,
        [genomeId]: {
          speciesName,
          assemblyName,
          ensObjectId
        }
      };
    }
  }, {});

  const areLoading: boolean = Object.keys(ensObjectIdsMap).some((genomeId) => {
    const ensObjectId = ensObjectIdsMap[genomeId];
    const ensObjectLoadingStatus = getEnsObjectLoadingStatus(
      state,
      ensObjectId
    );
    return ensObjectLoadingStatus === LoadingState.LOADING;
  });

  const previouslyViewedObjects = Object.keys(ensObjectMap).map((id) => ({
    speciesName: ensObjectMap[id].speciesName,
    assemblyName: ensObjectMap[id].assemblyName,
    link: urlFor.browser({
      genomeId: id,
      focus: ensObjectMap[id].ensObjectId,
      location: getChrLocationStr(chrLocations[id])
    })
  }));

  return {
    areLoading,
    objects: previouslyViewedObjects
  };
};
