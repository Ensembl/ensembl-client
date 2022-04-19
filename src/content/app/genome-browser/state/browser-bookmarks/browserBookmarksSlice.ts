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
import pick from 'lodash/pick';

import {
  getBrowserActiveFocusObject,
  getBrowserActiveGenomeId
} from '../browser-general/browserGeneralSelectors';
import {
  getActiveGenomeBrowserBookmarks,
  getActiveGenomePreviouslyViewedObjects
} from './browserBookmarksSelectors';

import browserBookmarksStorageService from 'src/content/app/genome-browser/components/browser-sidebar-modal/services/browser-bookmarks-storage-service';
import browserStorageService from 'src/content/app/genome-browser/services/browser-storage-service';

import type { RootState } from 'src/store';
import type { ParsedUrlPayload } from '../browser-general/browserGeneralSlice';

export type PreviouslyViewedObject = {
  genome_id: string;
  object_id: string;
  type: string;
  label: string | string[];
};

export type PreviouslyViewedObjects = {
  [genomeId: string]: PreviouslyViewedObject[];
};

export type BrowserBookmarksStateForGenome = {
  bookmarks: [];
  previouslyViewedObjects: PreviouslyViewedObject[];
};

export type BrowserBookmarksState = Readonly<{
  [genomeId: string]: BrowserBookmarksStateForGenome;
}>;

export const defaultBrowserBookmarksStateForGenome: BrowserBookmarksStateForGenome =
  {
    bookmarks: [],
    previouslyViewedObjects: []
  };

export const pickPersistentBrowserBookmarksProperties = (
  browserSidebarModal: Partial<BrowserBookmarksStateForGenome>
) => {
  const persistentProperties = ['previouslyViewedObjects'];
  return pick(browserSidebarModal, persistentProperties);
};

export const getPersistentBrowserBookmarksStateForGenome = (
  genomeId: string
): Partial<BrowserBookmarksStateForGenome> => {
  return browserStorageService.getBrowserBookmarks()[genomeId] || {};
};

export const updatePreviouslyViewedObjectsAndSave =
  (): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    const activeFocusObject = getBrowserActiveFocusObject(state);
    if (!activeGenomeId || !activeFocusObject) {
      return;
    }

    const previouslyViewedObjects = [
      ...getActiveGenomePreviouslyViewedObjects(state)
    ];

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
      activeFocusObject.type === 'gene' &&
      activeFocusObject.label !== activeFocusObject.stable_id
        ? activeFocusObject.label
        : null;

    const label =
      activeFocusObject.type === 'gene' && geneSymbol
        ? [geneSymbol, stable_id as string]
        : activeFocusObject.label;

    const newObject = {
      genome_id: activeFocusObject.genome_id,
      object_id: activeFocusObject.object_id,
      type: activeFocusObject.type,
      label: label
    };

    const updatedEntitiesArray = [newObject, ...previouslyViewedObjects];

    // Limit the total number of previously viewed objects to 250
    const previouslyViewedObjectsSlice = updatedEntitiesArray.slice(-250);

    browserBookmarksStorageService.updatePreviouslyViewedObjects({
      [activeGenomeId]: previouslyViewedObjectsSlice
    });

    const data = {
      ...getActiveGenomeBrowserBookmarks(state),
      previouslyViewedObjects: previouslyViewedObjectsSlice
    };

    const persistentTrackProperties =
      pickPersistentBrowserBookmarksProperties(data);
    browserStorageService.updateBrowserBookmarks({
      [activeGenomeId]: persistentTrackProperties
    });

    dispatch(
      updateBrowserBookmarksForGenome({
        activeGenomeId,
        data
      })
    );
  };

export const getBrowserBookmarksStateForGenome = (
  genomeId: string
): BrowserBookmarksStateForGenome => {
  return genomeId
    ? {
        ...defaultBrowserBookmarksStateForGenome,
        ...getPersistentBrowserBookmarksStateForGenome(genomeId)
      }
    : defaultBrowserBookmarksStateForGenome;
};

const browserBookmarks = createSlice({
  name: 'genome-browser-bookmarks',
  initialState: {} as BrowserBookmarksState,
  reducers: {
    setInitialBrowserBookmarksDataForGenome(
      state,
      action: PayloadAction<ParsedUrlPayload>
    ) {
      const { activeGenomeId } = action.payload;
      if (!state[activeGenomeId]) {
        state[activeGenomeId] = defaultBrowserBookmarksStateForGenome;
      }
    },
    updateBrowserBookmarksForGenome(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
        data: Partial<BrowserBookmarksStateForGenome>;
      }>
    ) {
      const { activeGenomeId, data } = action.payload;

      state[activeGenomeId] = {
        ...state[activeGenomeId],
        ...data
      };
    }
  }
});

export const {
  setInitialBrowserBookmarksDataForGenome,
  updateBrowserBookmarksForGenome
} = browserBookmarks.actions;

export default browserBookmarks.reducer;
