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
  Action,
  ActionCreator,
  createSlice,
  PayloadAction,
  ThunkAction
} from '@reduxjs/toolkit';
import pickBy from 'lodash/pickBy';

import browserStorageService from 'src/content/app/genome-browser/services/browser-storage-service';
import trackPanelStorageService from 'src/content/app/genome-browser/components/track-panel/services/track-panel-storage-service';

import { fetchEnsObject } from 'src/shared/state/ens-object/ensObjectActions';
import {
  ChrLocation,
  deleteGenomeLocationData,
  setLocationDataFromUrl
} from 'src/content/app/genome-browser/state/browser-location/browserLocationSlice';
import {
  deleteGenomeTrackPanelData,
  setInitialTrackPanelDataForGenome
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import {
  getBrowserActiveEnsObjectIds,
  getBrowserTrackStates,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { ensureSpeciesIsEnabled } from 'src/content/app/species-selector/state/speciesSelectorSlice';

import {
  BrowserTrackStates,
  TrackActivityStatus
} from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { RootState } from 'src/store';

export type BrowserEntityState = Readonly<{
  activeGenomeId: string | null;
  activeEnsObjectIds: { [genomeId: string]: string };
  trackStates: BrowserTrackStates;
}>;

const isServer = typeof window === 'undefined';

const activeGenomeId = !isServer
  ? browserStorageService.getActiveGenomeId()
  : null;
const activeEnsObjectIds = !isServer
  ? browserStorageService.getActiveEnsObjectIds()
  : [];
const trackStates = !isServer ? browserStorageService.getTrackStates() : {};

export const defaultBrowserEntityState: BrowserEntityState = {
  activeGenomeId,
  activeEnsObjectIds,
  trackStates
};

export type ParsedUrlPayload = {
  activeGenomeId: string;
  activeEnsObjectId: string | null;
  chrLocation: ChrLocation | null;
};

export type UpdateTrackStatesPayload = {
  genomeId: string;
  categoryName: string;
  trackId: string;
  status: TrackActivityStatus;
};

export const fetchDataForLastVisitedObjects: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => async (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeEnsObjectIdsMap = getBrowserActiveEnsObjectIds(state);
  Object.values(activeEnsObjectIdsMap).forEach((objectId) =>
    dispatch(fetchEnsObject(objectId))
  );
};

export const updateTrackStatesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (payload: BrowserTrackStates) => (dispatch, getState: () => RootState) => {
  dispatch(updateTrackStates(payload));
  const trackStates = getBrowserTrackStates(getState());
  browserStorageService.saveTrackStates(trackStates);
};

export const setDataFromUrlAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (payload: ParsedUrlPayload) => (dispatch) => {
  dispatch(setEntityDataFromUrl(payload));
  dispatch(setLocationDataFromUrl(payload));
  dispatch(setInitialTrackPanelDataForGenome(payload));

  const { activeGenomeId, activeEnsObjectId, chrLocation } = payload;

  dispatch(ensureSpeciesIsEnabled(payload.activeGenomeId));
  browserStorageService.saveActiveGenomeId(payload.activeGenomeId);
  chrLocation &&
    browserStorageService.updateChrLocation({ [activeGenomeId]: chrLocation });

  if (activeEnsObjectId) {
    browserStorageService.updateActiveEnsObjectIds({
      [activeGenomeId]: activeEnsObjectId
    });
  }
};

export const updateBrowserActiveEnsObjectIdsAndSave = (
  activeEnsObjectId: string
): ThunkAction<void, any, null, Action<string>> => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }
    const currentActiveEnsObjectIds = getBrowserActiveEnsObjectIds(state);
    const updatedActiveEnsObjectIds = {
      ...currentActiveEnsObjectIds,
      [activeGenomeId]: activeEnsObjectId
    };

    dispatch(updateBrowserActiveEnsObjectIds(updatedActiveEnsObjectIds));
    dispatch(fetchEnsObject(activeEnsObjectId));

    browserStorageService.updateActiveEnsObjectIds(updatedActiveEnsObjectIds);
  };
};

export const deleteSpeciesInGenomeBrowser = (
  genomeIdToRemove: string
): ThunkAction<void, any, null, Action<string>> => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();

    dispatch(deleteGenomeEntityData(genomeIdToRemove));
    dispatch(deleteGenomeLocationData(genomeIdToRemove));
    dispatch(deleteGenomeTrackPanelData(genomeIdToRemove));

    const updatedActiveEnsObjectIds = pickBy(
      getBrowserActiveEnsObjectIds(state),
      (value, key) => key !== genomeIdToRemove
    );

    dispatch(updateBrowserActiveEnsObjectIds(updatedActiveEnsObjectIds));

    browserStorageService.deleteGenome(genomeIdToRemove);
    trackPanelStorageService.deleteGenome(genomeIdToRemove);
  };
};

const browserGeneralSlice = createSlice({
  name: 'genome-browser-entity',
  initialState: defaultBrowserEntityState,
  reducers: {
    setActiveGenomeId(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      state.activeGenomeId = genomeId;
    },
    setEntityDataFromUrl(state, action: PayloadAction<ParsedUrlPayload>) {
      const { activeGenomeId, activeEnsObjectId } = action.payload;

      state.activeGenomeId = activeGenomeId;
      if (activeEnsObjectId) {
        state.activeEnsObjectIds[activeGenomeId] = activeEnsObjectId;
      }
    },
    updateBrowserActiveEnsObjectIds(
      state,
      action: PayloadAction<{ [objectId: string]: string }>
    ) {
      state.activeEnsObjectIds = action.payload;
    },
    updateTrackStates(state, action: PayloadAction<BrowserTrackStates>) {
      state.trackStates = Object.assign(state.trackStates, action.payload);
    },
    deleteGenomeEntityData(state, action: PayloadAction<string>) {
      const genomeIdToRemove = action.payload;
      const activeGenomeId = state.activeGenomeId;

      if (activeGenomeId === genomeIdToRemove) {
        state.activeGenomeId = null;
        delete state.activeEnsObjectIds[activeGenomeId];
      }
    }
  }
});

export const {
  setActiveGenomeId,
  setEntityDataFromUrl,
  updateTrackStates,
  updateBrowserActiveEnsObjectIds,
  deleteGenomeEntityData
} = browserGeneralSlice.actions;

export default browserGeneralSlice.reducer;
