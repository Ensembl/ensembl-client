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

import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { LoadingState } from 'src/shared/types/loading-state';
import { FocusObject } from './focusObjectTypes';
import {
  buildFocusObjectId,
  FocusObjectIdConstituents
} from 'src/shared/helpers/focusObjectHelpers';
import { RootState } from 'src/store';

export const getFocusObjectLoadingStatus = (
  state: RootState,
  objectId: string
): LoadingState =>
  get(
    state,
    `focusObjects.${objectId}.loadingStatus`,
    LoadingState.NOT_REQUESTED
  );

export const getFocusObjectById = (
  state: RootState,
  objectId: string
): FocusObject | null => {
  return get(state, `focusObjects.${objectId}.data`, null);
};

export const getFocusObjectByParams = (
  state: RootState,
  params: FocusObjectIdConstituents
): FocusObject | null => {
  const focusObjectId = buildFocusObjectId(params);
  return getFocusObjectById(state, focusObjectId);
};

export const getExampleFocusObjects = (state: RootState): FocusObject[] => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  if (!activeGenomeId) {
    return [];
  }
  const exampleObjects = getGenomeExampleFocusObjects(state, activeGenomeId);
  return exampleObjects
    .map(({ id, type }) => {
      const focusObjectId = buildFocusObjectId({
        genomeId: activeGenomeId,
        type,
        objectId: id
      });
      return state.browser.focusObjects[focusObjectId]?.data;
    })
    .filter(Boolean) as FocusObject[]; // make sure there are no undefineds in the returned array;
};

export const getExampleGenes = (state: RootState): FocusObject[] => {
  return getExampleFocusObjects(state).filter(
    (entity) => entity.type === 'gene'
  );
};
