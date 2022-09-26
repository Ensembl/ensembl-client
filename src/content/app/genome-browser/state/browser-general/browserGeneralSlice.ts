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
  type Action,
  type ActionCreator,
  type PayloadAction,
  type ThunkAction
} from '@reduxjs/toolkit';
import { batch } from 'react-redux';
import pickBy from 'lodash/pickBy';
import set from 'lodash/fp/set';

import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';
import browserBookmarksStorageService from 'src/content/app/genome-browser/services/browser-bookmarks/browserBookmarksStorageService';
import trackSettingsStorageService from 'src/content/app/genome-browser/components/track-settings-panel/services/trackSettingsStorageService';

import { fetchFocusObject } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';

import {
  deleteGenomeTrackPanelData,
  setInitialTrackPanelDataForGenome
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import { updatePreviouslyViewedObjectsAndSave } from 'src/content/app/genome-browser/state/browser-bookmarks/browserBookmarksSlice';
import { deleteTrackSettingsForGenome } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

import {
  getBrowserActiveFocusObjectIds,
  getBrowserActiveGenomeId,
  getBrowserActiveFocusObjectId,
  getBrowserTrackStates
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import type {
  BrowserTrackStates,
  TrackActivityStatus
} from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import type { RootState } from 'src/store';
import { Status } from 'src/shared/types/status';

export type ChrLocation = [string, number, number];

export type ChrLocations = { [genomeId: string]: ChrLocation };

export type BrowserGeneralState = Readonly<{
  activeGenomeId: string | null;
  activeFocusObjectIds: { [genomeId: string]: string };
  trackStates: BrowserTrackStates;
  chrLocations: ChrLocations; // final location of the browser when user stopped dragging/zooming; used to update the url
  actualChrLocations: ChrLocations; // transient locations that change while user is dragging or zooming
  regionEditorActive: boolean;
  regionFieldActive: boolean;
}>;

export type ParsedUrlPayload = {
  activeGenomeId: string;
  activeFocusObjectId: string | null;
  chrLocation: ChrLocation | null;
};

export type UpdateTrackStatesPayload = {
  genomeId: string;
  categoryName: string;
  trackId: string;
  status: TrackActivityStatus;
};

export const fetchDataForLastVisitedObjects: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = () => async (dispatch, getState: () => RootState) => {
  const state = getState();
  const activeFocusObjectIdsMap = getBrowserActiveFocusObjectIds(state);
  Object.values(activeFocusObjectIdsMap).forEach((objectId) =>
    dispatch(fetchFocusObject(objectId))
  );
};

export const setDataFromUrlAndSave: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (payload: ParsedUrlPayload) => (dispatch, getState: () => RootState) => {
  const { activeGenomeId, activeFocusObjectId, chrLocation } = payload;
  const state = getState();
  const currentActiveGenomeId = getBrowserActiveGenomeId(state);
  const currentActiveFocusObjectId = getBrowserActiveFocusObjectId(state);

  batch(() => {
    // update previously viewed objects before active genome id or active focus object id have changed
    if (
      activeGenomeId === currentActiveGenomeId &&
      activeFocusObjectId !== currentActiveFocusObjectId
    ) {
      dispatch(updatePreviouslyViewedObjectsAndSave());
    }

    dispatch(browserGeneralSlice.actions.setDataFromUrl(payload));
    dispatch(setInitialTrackPanelDataForGenome(payload));
  });

  browserStorageService.saveActiveGenomeId(activeGenomeId);
  chrLocation &&
    browserStorageService.updateChrLocation({ [activeGenomeId]: chrLocation });

  if (activeFocusObjectId) {
    browserStorageService.updateActiveFocusObjectIds({
      [activeGenomeId]: activeFocusObjectId
    });
  }
};

export const updateBrowserActiveFocusObjectIdsAndSave = (
  activeFocusObjectId: string
): ThunkAction<void, any, void, Action<string>> => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }
    const currentActiveFocusObjectIds = getBrowserActiveFocusObjectIds(state);
    const updatedActiveFocusObjectIds = {
      ...currentActiveFocusObjectIds,
      [activeGenomeId]: activeFocusObjectId
    };

    dispatch(updateBrowserActiveFocusObjectIds(updatedActiveFocusObjectIds));
    dispatch(fetchFocusObject(activeFocusObjectId));

    browserStorageService.updateActiveFocusObjectIds(
      updatedActiveFocusObjectIds
    );
  };
};

export const updateObjectTrackStates: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (payload: { status: Status; transcriptIds?: string[] }) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state) as string;
    const activeFocusObjectId = getBrowserActiveFocusObjectId(state) as string;
    const trackStates = getBrowserTrackStates(state);
    const { status, transcriptIds } = payload;

    let newTrackStates = set(
      `${activeGenomeId}.objectTracks.${activeFocusObjectId}.status`,
      status,
      trackStates
    );

    if (transcriptIds) {
      newTrackStates = set(
        `${activeGenomeId}.objectTracks.${activeFocusObjectId}.transcripts`,
        transcriptIds,
        newTrackStates
      );
    }

    dispatch(updateTrackStates(newTrackStates));
    browserStorageService.saveTrackStates(newTrackStates);
  };
};

export const updateCommonTrackStates: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (payload: { category: string; trackId: string; status: Status }) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state) as string;
    const trackStates = getBrowserTrackStates(state);
    const { category, trackId, status } = payload;

    const newTrackStates = set(
      `${activeGenomeId}.commonTracks.${category}.${trackId}`,
      status,
      trackStates
    );

    dispatch(updateTrackStates(newTrackStates));
    browserStorageService.saveTrackStates(newTrackStates);
  };
};

export const deleteBrowserActiveFocusObjectIdAndSave = (): ThunkAction<
  void,
  any,
  void,
  Action<string>
> => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }
    const currentActiveFocusObjectIds = getBrowserActiveFocusObjectIds(state);

    const updatedActiveFocusObjectIds = pickBy(
      currentActiveFocusObjectIds,
      (_, key) => key !== activeGenomeId
    );

    dispatch(updateBrowserActiveFocusObjectIds(updatedActiveFocusObjectIds));

    browserStorageService.updateActiveFocusObjectIds(
      updatedActiveFocusObjectIds
    );
  };
};

export const setChrLocation: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = (chrLocation: ChrLocation) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    const activeFocusObjectId = getBrowserActiveFocusObjectId(state);

    if (!activeGenomeId || !activeFocusObjectId) {
      return;
    }

    const payload = {
      [activeGenomeId]: chrLocation
    };

    dispatch(updateChrLocation(payload));
    browserStorageService.updateChrLocation(payload);
  };
};

export const deleteSpeciesInGenomeBrowser = (
  genomeIdToRemove: string
): ThunkAction<void, any, void, Action<string>> => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();

    dispatch(deleteBrowserDataForGenome(genomeIdToRemove));
    dispatch(deleteGenomeTrackPanelData(genomeIdToRemove));
    dispatch(deleteTrackSettingsForGenome(genomeIdToRemove));

    const updatedActiveFocusObjectIds = pickBy(
      getBrowserActiveFocusObjectIds(state),
      (value, key) => key !== genomeIdToRemove
    );

    dispatch(updateBrowserActiveFocusObjectIds(updatedActiveFocusObjectIds));

    browserStorageService.deleteGenome(genomeIdToRemove);
    browserBookmarksStorageService.deleteGenome(genomeIdToRemove);
    trackSettingsStorageService.deleteTrackSettings(genomeIdToRemove);
  };
};

export const loadBrowserGeneralState = (): ThunkAction<
  void,
  any,
  void,
  Action<string>
> => {
  return (dispatch) => {
    const activeGenomeId = browserStorageService.getActiveGenomeId();
    const activeFocusObjectIds =
      browserStorageService.getActiveFocusObjectIds();
    const trackStates = browserStorageService.getTrackStates();
    const chrLocations = browserStorageService.getChrLocation();

    dispatch(
      browserGeneralSlice.actions.setInitialState({
        activeGenomeId,
        activeFocusObjectIds,
        trackStates,
        chrLocations
      })
    );
  };
};

export const defaultBrowserGeneralState: BrowserGeneralState = {
  activeGenomeId: null,
  activeFocusObjectIds: {},
  trackStates: {},
  chrLocations: {},
  actualChrLocations: {},
  regionEditorActive: false,
  regionFieldActive: false
};

const browserGeneralSlice = createSlice({
  name: 'genome-browser-general',
  initialState: defaultBrowserGeneralState as BrowserGeneralState,
  reducers: {
    setInitialState(
      state,
      action: PayloadAction<Partial<BrowserGeneralState>>
    ) {
      state = Object.assign(state, action.payload);
    },
    setActiveGenomeId(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      state.activeGenomeId = genomeId;
    },
    setDataFromUrl(state, action: PayloadAction<ParsedUrlPayload>) {
      const { activeGenomeId, activeFocusObjectId, chrLocation } =
        action.payload;
      state.activeGenomeId = activeGenomeId;

      if (activeFocusObjectId) {
        state.activeFocusObjectIds[activeGenomeId] = activeFocusObjectId;
      }

      if (chrLocation) {
        state.chrLocations[activeGenomeId] = chrLocation;
      } else {
        delete state.chrLocations[activeGenomeId];
      }
    },
    updateBrowserActiveFocusObjectIds(
      state,
      action: PayloadAction<{ [objectId: string]: string }>
    ) {
      state.activeFocusObjectIds = action.payload;
    },
    updateTrackStates(state, action: PayloadAction<BrowserTrackStates>) {
      state.trackStates = action.payload;
    },
    deleteBrowserDataForGenome(state, action: PayloadAction<string>) {
      const genomeIdToRemove = action.payload;
      const activeGenomeId = state.activeGenomeId;

      delete state.chrLocations[genomeIdToRemove];
      delete state.actualChrLocations[genomeIdToRemove];

      if (activeGenomeId === genomeIdToRemove) {
        state.activeGenomeId = null;
        delete state.activeFocusObjectIds[activeGenomeId];
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
    }
  }
});

export const {
  setActiveGenomeId,
  updateTrackStates,
  updateBrowserActiveFocusObjectIds,
  deleteBrowserDataForGenome,
  updateChrLocation,
  updateActualChrLocation,
  toggleRegionEditorActive,
  toggleRegionFieldActive
} = browserGeneralSlice.actions;

export default browserGeneralSlice.reducer;
