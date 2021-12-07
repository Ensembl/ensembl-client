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

import browserStorageService from 'src/content/app/genome-browser/services/browser-storage-service';

import { ParsedUrlPayload } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { RootState } from 'src/store';

const isServer = typeof window === 'undefined';
const chrLocations = !isServer ? browserStorageService.getChrLocation() : [];

export type ChrLocation = [string, number, number];

export type ChrLocations = { [genomeId: string]: ChrLocation };

export type BrowserLocationState = Readonly<{
  chrLocations: ChrLocations; // final location of the browser when user stopped dragging/zooming; used to update the url
  actualChrLocations: ChrLocations; // transient locations that change while user is dragging or zooming
  regionEditorActive: boolean;
  regionFieldActive: boolean;
  isObjectInDefaultPosition: boolean;
}>;

export const defaultBrowserLocationState: BrowserLocationState = {
  chrLocations,
  actualChrLocations: {},
  regionEditorActive: false,
  regionFieldActive: false,
  isObjectInDefaultPosition: false
};

export const setActualChrLocation: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = (chrLocation: ChrLocation) => {
  return (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    if (!activeGenomeId) {
      return;
    }
    const payload = {
      [activeGenomeId]: chrLocation
    };

    dispatch(updateActualChrLocation(payload));
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
    const payload = {
      [activeGenomeId]: chrLocation
    };

    dispatch(updateChrLocation(payload));
    browserStorageService.updateChrLocation(payload);
  };
};

const browserLocationSlice = createSlice({
  name: 'genome-browser-location',
  initialState: defaultBrowserLocationState as BrowserLocationState,
  reducers: {
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
    updateActualChrLocation(state, action: PayloadAction<ChrLocations>) {
      state.actualChrLocations = Object.assign(
        state.actualChrLocations,
        action.payload
      );
    },
    toggleRegionEditorActive(state, action: PayloadAction<boolean>) {
      state.regionEditorActive = action.payload;
    },
    toggleRegionFieldActive(state, action: PayloadAction<boolean>) {
      state.regionFieldActive = action.payload;
    },
    updateDefaultPositionFlag(state, action: PayloadAction<boolean>) {
      state.isObjectInDefaultPosition = action.payload;
    },
    deleteGenomeLocationData(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      delete state.chrLocations[genomeId];
      delete state.actualChrLocations[genomeId];
    }
  }
});

export const {
  setLocationDataFromUrl,
  updateChrLocation,
  updateActualChrLocation,
  toggleRegionEditorActive,
  toggleRegionFieldActive,
  updateDefaultPositionFlag,
  deleteGenomeLocationData
} = browserLocationSlice.actions;

export default browserLocationSlice.reducer;
