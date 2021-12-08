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
import { replace } from 'connected-react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';
import browserStorageService from 'src/content/app/genome-browser/services/browser-storage-service';
import trackPanelStorageService from 'src/content/app/genome-browser/components/track-panel/services/track-panel-storage-service';

import { fetchEnsObject } from 'src/shared/state/ens-object/ensObjectActions';

import {
  deleteGenomeTrackPanelData,
  setInitialTrackPanelDataForGenome
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import {
  getBrowserActiveEnsObjectIds,
  getBrowserTrackStates,
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId,
  getChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { ensureSpeciesIsEnabled } from 'src/content/app/species-selector/state/speciesSelectorSlice';

import {
  BrowserTrackStates,
  TrackActivityStatus
} from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { RootState } from 'src/store';
import isEqual from 'lodash/isEqual';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';
import { getChrLocationStr } from 'src/content/app/genome-browser/helpers/browserHelper';

export type ChrLocation = [string, number, number];

export type ChrLocations = { [genomeId: string]: ChrLocation };

export type BrowserGeneralState = Readonly<{
  activeGenomeId: string | null;
  activeEnsObjectIds: { [genomeId: string]: string };
  trackStates: BrowserTrackStates;
  chrLocations: ChrLocations; // final location of the browser when user stopped dragging/zooming; used to update the url
  actualChrLocations: ChrLocations; // transient locations that change while user is dragging or zooming
  regionEditorActive: boolean;
  regionFieldActive: boolean;
  isObjectInDefaultPosition: boolean;
}>;

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
  dispatch(setGeneralDataFromUrl(payload));
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

export const setChrLocation: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = (chrLocation: ChrLocation) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    const activeEnsObjectId = getBrowserActiveEnsObjectId(state);

    if (!activeGenomeId || !activeEnsObjectId) {
      return;
    }
    const savedChrLocation = getChrLocation(state);

    const payload = {
      [activeGenomeId]: chrLocation
    };

    dispatch(updateChrLocation(payload));
    browserStorageService.updateChrLocation(payload);

    if (!isEqual(chrLocation, savedChrLocation)) {
      const newUrl = urlFor.browser({
        genomeId: activeGenomeId,
        focus: buildFocusIdForUrl(activeEnsObjectId),
        location: getChrLocationStr(chrLocation)
      });
      dispatch(replace(newUrl));
    }
  };
};

export const deleteSpeciesInGenomeBrowser = (
  genomeIdToRemove: string
): ThunkAction<void, any, null, Action<string>> => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();

    dispatch(deleteGenomeGeneralData(genomeIdToRemove));
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

export const defaultBrowserGeneralState: BrowserGeneralState = {
  activeGenomeId: null,
  activeEnsObjectIds: {},
  trackStates: {},
  chrLocations: {},
  actualChrLocations: {},
  regionEditorActive: false,
  regionFieldActive: false,
  isObjectInDefaultPosition: false
};

const browserGeneralSlice = createSlice({
  name: 'genome-browser-general',
  initialState: defaultBrowserGeneralState as BrowserGeneralState,
  reducers: {
    loadBrowserGeneralState(state) {
      const activeGenomeId = browserStorageService.getActiveGenomeId();
      const activeEnsObjectIds = browserStorageService.getActiveEnsObjectIds();
      const trackStates = browserStorageService.getTrackStates();
      const chrLocations = browserStorageService.getChrLocation();

      state.activeGenomeId = activeGenomeId;
      state.activeEnsObjectIds = activeEnsObjectIds;
      state.trackStates = trackStates;
      state.chrLocations = chrLocations;
    },
    setActiveGenomeId(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      state.activeGenomeId = genomeId;
    },
    setGeneralDataFromUrl(state, action: PayloadAction<ParsedUrlPayload>) {
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
    deleteGenomeGeneralData(state, action: PayloadAction<string>) {
      const genomeIdToRemove = action.payload;
      const activeGenomeId = state.activeGenomeId;

      delete state.chrLocations[genomeIdToRemove];
      delete state.actualChrLocations[genomeIdToRemove];

      if (activeGenomeId === genomeIdToRemove) {
        state.activeGenomeId = null;
        delete state.activeEnsObjectIds[activeGenomeId];
      }
    },
    setLocationDataFromUrl(state, action: PayloadAction<ParsedUrlPayload>) {
      const { activeGenomeId, chrLocation } = action.payload;
      if (chrLocation) {
        state.chrLocations[activeGenomeId] = chrLocation;
      } else {
        delete state.chrLocations[activeGenomeId];
      }
    },
    updateChrLocation(state, action: PayloadAction<ChrLocations>) {
      state.chrLocations = Object.assign(state.chrLocations, action.payload);
    },
    updateActualChrLocation(state, action: PayloadAction<ChrLocation>) {
      const activeGenomeId = state.activeGenomeId;
      if (activeGenomeId) {
        state.actualChrLocations = Object.assign(state.actualChrLocations, {
          [activeGenomeId]: action.payload
        });
      }
    },
    toggleRegionEditorActive(state, action: PayloadAction<boolean>) {
      state.regionEditorActive = action.payload;
    },
    toggleRegionFieldActive(state, action: PayloadAction<boolean>) {
      state.regionFieldActive = action.payload;
    },
    updateDefaultPositionFlag(state, action: PayloadAction<boolean>) {
      state.isObjectInDefaultPosition = action.payload;
    }
  }
});

export const {
  loadBrowserGeneralState,
  setActiveGenomeId,
  setGeneralDataFromUrl,
  updateTrackStates,
  updateBrowserActiveEnsObjectIds,
  deleteGenomeGeneralData,
  setLocationDataFromUrl,
  updateChrLocation,
  updateActualChrLocation,
  toggleRegionEditorActive,
  toggleRegionFieldActive,
  updateDefaultPositionFlag
} = browserGeneralSlice.actions;

export default browserGeneralSlice.reducer;
