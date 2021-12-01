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

import get from 'lodash/get';

import { buildEnsObjectId, EnsObjectIdConstituents } from './ensObjectHelpers';

import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { getBrowserActiveGenomeId } from 'src/content/app/browser/browserSelectors';

import { LoadingState } from 'src/shared/types/loading-state';
import { RootState } from 'src/store';
import { EnsObject } from './ensObjectTypes';

export const getEnsObjectLoadingStatus = (
  state: RootState,
  objectId: string
): LoadingState =>
  get(
    state,
    `ensObjects.${objectId}.loadingStatus`,
    LoadingState.NOT_REQUESTED
  );

export const getEnsObjectById = (
  state: RootState,
  objectId: string
): EnsObject | null => {
  return get(state, `ensObjects.${objectId}.data`, null);
};

export const getEnsObjectByParams = (
  state: RootState,
  params: EnsObjectIdConstituents
): EnsObject | null => {
  const ensObjectId = buildEnsObjectId(params);
  return getEnsObjectById(state, ensObjectId);
};

export const getExampleEnsObjects = (state: RootState): EnsObject[] => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  if (!activeGenomeId) {
    return [];
  }
  const exampleObjects = getGenomeExampleFocusObjects(state, activeGenomeId);
  return exampleObjects
    .map(({ id, type }) => {
      const ensObjectId = buildEnsObjectId({
        genomeId: activeGenomeId,
        type,
        objectId: id
      });
      return state.ensObjects[ensObjectId]?.data;
    })
    .filter(Boolean) as EnsObject[]; // make sure there are no undefineds in the returned array;
};

export const getExampleGenes = (state: RootState): EnsObject[] => {
  return getExampleEnsObjects(state).filter((entity) => entity.type === 'gene');
};
