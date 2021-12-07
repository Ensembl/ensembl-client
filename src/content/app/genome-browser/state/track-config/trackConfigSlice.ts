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

import { updateTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { getBrowserTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { BrowserTrackStates } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { RootState } from 'src/store';

export type CogList = {
  [key: string]: number;
};

export type TrackConfigState = Readonly<{
  applyToAllConfig: {
    isSelected: boolean;
    allTrackNamesOn: boolean;
    allTrackLabelsOn: boolean;
  };
  browserCogList: number;
  browserCogTrackList: CogList;
  selectedCog: string | null;
  trackConfigNames: { [key: string]: boolean };
  trackConfigLabel: { [key: string]: boolean };
}>;

export const defaultTrackConfigState: TrackConfigState = {
  applyToAllConfig: {
    isSelected: false,
    allTrackNamesOn: false,
    allTrackLabelsOn: true
  },
  browserCogList: 0,
  browserCogTrackList: {},
  selectedCog: null,
  trackConfigLabel: {},
  trackConfigNames: {}
};

export const updateTrackStatesAndSave: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (payload: BrowserTrackStates) => (dispatch, getState: () => RootState) => {
  dispatch(updateTrackStates(payload));
  const trackStates = getBrowserTrackStates(getState());
  browserStorageService.saveTrackStates(trackStates);
};

const browserTrackConfigSlice = createSlice({
  name: 'genome-browser-track-config',
  initialState: defaultTrackConfigState,
  reducers: {
    updateCogList(state, action: PayloadAction<number>) {
      state.browserCogList = action.payload;
    },
    updateCogTrackList(state, action: PayloadAction<CogList>) {
      state.browserCogTrackList = action.payload;
    },
    updateSelectedCog(state, action: PayloadAction<string | null>) {
      state.selectedCog = action.payload;
    },
    updateApplyToAll(state, action: PayloadAction<boolean>) {
      state.applyToAllConfig.isSelected = action.payload;
    },
    updateApplyToAllTrackNames(state, action: PayloadAction<boolean>) {
      state.applyToAllConfig.allTrackNamesOn = action.payload;
    },
    updateApplyToAllTrackLabels(state, action: PayloadAction<boolean>) {
      state.applyToAllConfig.allTrackLabelsOn = action.payload;
    },
    updateTrackConfigNames(
      state,
      action: PayloadAction<{ selectedCog: string; isTrackNameShown: boolean }>
    ) {
      const { selectedCog, isTrackNameShown } = action.payload;
      state.trackConfigNames[selectedCog] = isTrackNameShown;
    },
    updateTrackConfigLabel(
      state,
      action: PayloadAction<{ selectedCog: string; isTrackLabelShown: boolean }>
    ) {
      const { selectedCog, isTrackLabelShown } = action.payload;
      state.trackConfigLabel[selectedCog] = isTrackLabelShown;
    }
  }
});

export const {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog,
  updateApplyToAll,
  updateApplyToAllTrackNames,
  updateApplyToAllTrackLabels,
  updateTrackConfigNames,
  updateTrackConfigLabel
} = browserTrackConfigSlice.actions;

export default browserTrackConfigSlice.reducer;
