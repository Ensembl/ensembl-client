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

import { createSelector } from '@reduxjs/toolkit';

import { buildFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';
import isGeneFocusObject from './isGeneFocusObject';

import { LoadingState } from 'src/shared/types/loading-state';
import type {
  FocusObject,
  FocusGene,
  FocusObjectIdConstituents
} from 'src/shared/types/focus-object/focusObjectTypes';
import type { RootState } from 'src/store';

export const getFocusObjectLoadingStatus = (
  state: RootState,
  objectId: string
): LoadingState => state.browser.focusObjects[objectId]?.loadingStatus ?? null;

export const getFocusObjectById = (
  state: RootState,
  objectId: string
): FocusObject | null => {
  return state.browser.focusObjects[objectId]?.data ?? null;
};

export const getFocusObjectByParams = (
  state: RootState,
  params: FocusObjectIdConstituents
): FocusObject | null => {
  const focusObjectId = buildFocusObjectId(params);
  return getFocusObjectById(state, focusObjectId);
};

export const getFocusGene = (
  state: RootState,
  focusGeneId: string
): FocusGene | null => {
  const focusObject = state.browser.focusObjects[focusGeneId]?.data;
  return isGeneFocusObject(focusObject) ? focusObject : null;
};

export const getFocusGeneVisibleTranscripts = createSelector(
  getFocusGene,
  (focusGene: FocusGene | null): string[] | null => {
    return focusGene?.visibleTranscriptIds ?? null;
  }
);
