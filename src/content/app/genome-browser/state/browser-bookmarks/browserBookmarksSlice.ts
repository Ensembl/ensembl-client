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

import {
  createSlice,
  type PayloadAction,
  type Action,
  type ThunkAction
} from '@reduxjs/toolkit';

import {
  getBrowserActiveFocusObject,
  getBrowserActiveGenomeId
} from '../browser-general/browserGeneralSelectors';
import { getPreviouslyViewedObjects } from './browserBookmarksSelectors';

import {
  savePreviouslyViewedGenomeBrowserObjects,
  getAllPreviouslyViewedGenomeBrowserObjects
} from 'src/shared/services/previouslyViewedObjectsStorageService';

import type { RootState } from 'src/store';

export type PreviouslyViewedObject = {
  genome_id: string;
  object_id: string;
  type: string;
  label: string | string[];
};

export type PreviouslyViewedObjectsForGenome = {
  [genomeId: string]: PreviouslyViewedObject[];
};

export type BookmarksForGenome = {
  [genomeId: string]: [];
};

export type BrowserBookmarksState = {
  bookmarks: BookmarksForGenome;
  previouslyViewedObjects: PreviouslyViewedObjectsForGenome;
};

export const initialState: BrowserBookmarksState = {
  bookmarks: {},
  previouslyViewedObjects: {}
};

export const updatePreviouslyViewedObjectsAndSave =
  (): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    const activeFocusObject = getBrowserActiveFocusObject(state);

    if (!activeGenomeId || !activeFocusObject) {
      return;
    }

    const previouslyViewedObjects = getPreviouslyViewedObjects(state);

    const isCurrentEntityPreviouslyViewed = previouslyViewedObjects.some(
      (entity) => entity.object_id === activeFocusObject.object_id
    );

    if (isCurrentEntityPreviouslyViewed) {
      return;
    }

    const stable_id =
      activeFocusObject.type === 'gene'
        ? activeFocusObject.versioned_stable_id || activeFocusObject.stable_id
        : null;

    const geneSymbol =
      activeFocusObject.type === 'gene' && activeFocusObject.label !== stable_id
        ? activeFocusObject.label
        : null;

    const label =
      activeFocusObject.type === 'gene' && geneSymbol
        ? [geneSymbol, stable_id as string]
        : activeFocusObject.label;

    const newObject: PreviouslyViewedObject = {
      genome_id: activeFocusObject.genome_id,
      object_id: activeFocusObject.object_id,
      type: activeFocusObject.type,
      label: label
    };

    const updatedObjects = [newObject, ...previouslyViewedObjects];

    // Limit the total number of previously viewed objects to 250
    const previouslyViewedObjectsSlice = updatedObjects.slice(-250);

    // side effect
    savePreviouslyViewedGenomeBrowserObjects(
      activeGenomeId,
      previouslyViewedObjectsSlice
    );

    dispatch(
      bookmarksSlice.actions.updatePreviouslyViewedObjects({
        activeGenomeId,
        previouslyViewedObjects: previouslyViewedObjectsSlice
      })
    );
  };

export const loadPreviouslyViewedObjects =
  (): ThunkAction<void, RootState, void, Action<string>> =>
  async (dispatch) => {
    const previouslyViewedObjects =
      await getAllPreviouslyViewedGenomeBrowserObjects();

    dispatch(bookmarksSlice.actions.setInitialState(previouslyViewedObjects));
  };

const bookmarksSlice = createSlice({
  name: 'genome-browser-bookmarks',
  initialState,
  reducers: {
    setInitialState(
      state,
      action: PayloadAction<{ [genomeId: string]: PreviouslyViewedObject[] }>
    ) {
      state.previouslyViewedObjects = action.payload;
    },
    updatePreviouslyViewedObjects(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
        previouslyViewedObjects: PreviouslyViewedObject[];
      }>
    ) {
      const { activeGenomeId, previouslyViewedObjects } = action.payload;
      state.previouslyViewedObjects[activeGenomeId] = previouslyViewedObjects;
    },
    deletePreviouslyViewedObjects(
      state,
      action: PayloadAction<{ genomeId: string }>
    ) {
      const { genomeId } = action.payload;
      delete state.previouslyViewedObjects[genomeId];
    }
  }
});

export const { deletePreviouslyViewedObjects } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
