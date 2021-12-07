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
  Dispatch,
  PayloadAction,
  ThunkAction
} from '@reduxjs/toolkit';
import { replace } from 'connected-react-router';
import { isEqual } from 'lodash';
import pickBy from 'lodash/pickBy';

import browserStorageService from 'src/content/app/genome-browser/services/browser-storage-service';
import * as urlFor from 'src/shared/helpers/urlHelper';

import { getChrLocationStr } from 'src/content/app/genome-browser/helpers/browserHelper';
import { ParsedUrlPayload } from 'src/content/app/genome-browser/state/browser-entity/browserEntitySlice';
import { buildFocusIdForUrl } from 'src/shared/state/ens-object/ensObjectHelpers';

import { getChrLocation } from 'src/content/app/genome-browser/state/browser-location/browserLocationSelectors';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId
} from 'src/content/app/genome-browser/state/browser-entity/browserEntitySelectors';

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
  return (dispatch: Dispatch, getState: () => RootState) => {
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
  return (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);
    const activeEnsObjectId = getBrowserActiveEnsObjectId(state);
    const savedChrLocation = getChrLocation(state);
    if (!activeGenomeId || !activeEnsObjectId) {
      return;
    }
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

const browserLocationSlice = createSlice({
  name: 'genome-browser-location',
  initialState: defaultBrowserLocationState as BrowserLocationState,
  reducers: {
    setLocationDataFromUrl(state, action: PayloadAction<ParsedUrlPayload>) {
      const { activeGenomeId, chrLocation } = action.payload;
      if (chrLocation) {
        state.chrLocations[activeGenomeId] = chrLocation;
      } else {
        state.chrLocations = pickBy(
          state.chrLocations,
          (value, key) => key !== activeGenomeId
        );
      }
    },
    updateChrLocation(state, action: PayloadAction<ChrLocations>) {
      state.chrLocations = {
        ...state.chrLocations,
        ...action.payload
      };
    },
    updateActualChrLocation(state, action: PayloadAction<ChrLocations>) {
      state.actualChrLocations = {
        ...state.actualChrLocations,
        ...action.payload
      };
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
      state.chrLocations = pickBy(
        state.chrLocations,
        (value, key) => key !== genomeId
      );
      state.actualChrLocations = pickBy(
        state.chrLocations,
        (value, key) => key !== genomeId
      );
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
