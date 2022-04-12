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

import { PayloadAction } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { createSlice } from '@reduxjs/toolkit';
import { Action } from 'redux';
import pick from 'lodash/pick';

import browserSidebarModalStorageService from 'src/content/app/genome-browser/components/browser-sidebar-modal/services/browser-sidebar-modal-storage-service';
import browserStorageService from 'src/content/app/genome-browser/services/browser-storage-service';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObject
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import {
  getActiveGenomePreviouslyViewedObjects,
  getActiveBrowserSidebarModal
} from './browserSidebarModalSelectors';

import { ParsedUrlPayload } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { RootState } from 'src/store';

export type PreviouslyViewedObject = {
  genome_id: string;
  object_id: string;
  type: string;
  label: string | string[];
};

export enum BrowserSidebarModalView {
  SEARCH = 'search',
  TRACKS_MANAGER = 'Tracks manager',
  BOOKMARKS = 'Previously viewed',
  PERSONAL_DATA = 'Personal data',
  SHARE = 'Share',
  DOWNLOADS = 'Downlods'
}

export type PreviouslyViewedObjects = {
  [genomeId: string]: PreviouslyViewedObject[];
};

export type BrowserSidebarModalStateForGenome = Readonly<{
  isBrowserSidebarModalOpened: boolean;
  browserSidebarModalView: BrowserSidebarModalView | null;
  bookmarks: PreviouslyViewedObject[];
  previouslyViewedObjects: PreviouslyViewedObject[];
}>;

export type BrowserSidebarModalState = Readonly<{
  [genomeId: string]: BrowserSidebarModalStateForGenome;
}>;

export const defaultBrowserSidebarModalStateForGenome: BrowserSidebarModalStateForGenome =
  {
    isBrowserSidebarModalOpened: false,
    bookmarks: [],
    previouslyViewedObjects: [],
    browserSidebarModalView: null
  };

export const pickPersistentBrowserSidebarModalProperties = (
  browserSidebarModal: Partial<BrowserSidebarModalStateForGenome>
) => {
  const persistentProperties = ['previouslyViewedObjects'];
  return pick(browserSidebarModal, persistentProperties);
};

export const changeBrowserSidebarModalViewForGenome =
  (
    browserSidebarModalView: BrowserSidebarModalView
  ): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const activeGenomeId = getBrowserActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

    const data = {
      ...getActiveBrowserSidebarModal(getState()),
      browserSidebarModalView
    };

    dispatch(
      updateBrowserSidebarModalForGenome({
        activeGenomeId,
        data
      })
    );
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

    browserSidebarModalStorageService.updatePreviouslyViewedObjects({
      [activeGenomeId]: previouslyViewedObjectsSlice
    });

    const data = {
      ...getActiveBrowserSidebarModal(state),
      previouslyViewedObjects: previouslyViewedObjectsSlice
    };

    const persistentTrackProperties =
      pickPersistentBrowserSidebarModalProperties(data);
    browserStorageService.updateBrowserSidebarModals({
      [activeGenomeId]: persistentTrackProperties
    });

    dispatch(
      updateBrowserSidebarModalForGenome({
        activeGenomeId,
        data
      })
    );
  };

export const openBrowserSidebarModal =
  (
    browserSidebarModalView: BrowserSidebarModalView
  ): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();

    const activeGenomeId = getBrowserActiveGenomeId(state);

    if (!activeGenomeId) {
      return;
    }

    const data = {
      ...getActiveBrowserSidebarModal(state),
      isBrowserSidebarModalOpened: true,
      browserSidebarModalView
    };

    dispatch(
      updateBrowserSidebarModalForGenome({
        activeGenomeId,
        data
      })
    );
  };

export const closeBrowserSidebarModal =
  (): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);

    if (!activeGenomeId) {
      return;
    }

    const data = {
      ...getActiveBrowserSidebarModal(state),
      isBrowserSidebarModalOpened: false,
      browserSidebarModalView: null
    };

    dispatch(
      updateBrowserSidebarModalForGenome({
        activeGenomeId,
        data
      })
    );
  };

export const getBrowserSidebarModalStateForGenome = (
  genomeId: string
): BrowserSidebarModalStateForGenome => {
  return genomeId
    ? {
        ...defaultBrowserSidebarModalStateForGenome,
        ...getPersistentBrowserSidebarModalStateForGenome(genomeId)
      }
    : defaultBrowserSidebarModalStateForGenome;
};

export const getPersistentBrowserSidebarModalStateForGenome = (
  genomeId: string
): Partial<BrowserSidebarModalStateForGenome> => {
  return browserStorageService.getBrowserSidebarModals()[genomeId] || {};
};

const browserSidebarModal = createSlice({
  name: 'genome-browser-sidebar-modal',
  initialState: {} as BrowserSidebarModalState,
  reducers: {
    setInitialBrowserSidebarModalDataForGenome(
      state,
      action: PayloadAction<ParsedUrlPayload>
    ) {
      const { activeGenomeId } = action.payload;
      if (!state[activeGenomeId]) {
        state[activeGenomeId] =
          getBrowserSidebarModalStateForGenome(activeGenomeId);
      }
    },
    updateBrowserSidebarModalForGenome(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
        data: Partial<BrowserSidebarModalStateForGenome>;
      }>
    ) {
      const { activeGenomeId, data } = action.payload;

      state[activeGenomeId] = {
        ...state[activeGenomeId],
        ...data
      };
    },
    deleteGenomeBrowserSidebarModalData(state, action: PayloadAction<string>) {
      delete state[action.payload];
    }
  }
});

export const {
  setInitialBrowserSidebarModalDataForGenome,
  updateBrowserSidebarModalForGenome,
  deleteGenomeBrowserSidebarModalData
} = browserSidebarModal.actions;

export default browserSidebarModal.reducer;
