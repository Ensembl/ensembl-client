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

import browserStorageService from 'src/content/app/genome-browser/services/browser-storage-service';
import analyticsTracking from 'src/services/analytics-service';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getActiveTrackPanel } from './trackPanelSelectors';

import { ParsedUrlPayload } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { TrackSet } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { RootState } from 'src/store';

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  selectedTrackPanelTab: TrackSet.GENOMIC,
  isTrackPanelOpened: true
};

export const toggleTrackPanel =
  (isTrackPanelOpened: boolean): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const activeGenomeId = getBrowserActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

    dispatch(
      updateTrackPanelForGenome({
        activeGenomeId,
        data: {
          ...getActiveTrackPanel(getState()),
          isTrackPanelOpened
        }
      })
    );
  };

export const selectTrackPanelTab =
  (
    selectedTrackPanelTab: TrackSet
  ): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const activeGenomeId = getBrowserActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

    analyticsTracking.trackEvent({
      category: 'track_panel_tab',
      label: selectedTrackPanelTab,
      action: 'selected'
    });

    const data = {
      ...getActiveTrackPanel(getState()),
      selectedTrackPanelTab,
      isBrowserSidebarModalOpened: false,
      browserSidebarModalView: null
    };

    dispatch(
      updateTrackPanelForGenome({
        activeGenomeId,
        data
      })
    );
  };

export const getTrackPanelStateForGenome = (
  genomeId: string
): TrackPanelStateForGenome => {
  return genomeId
    ? {
        ...defaultTrackPanelStateForGenome,
        ...getPersistentTrackPanelStateForGenome(genomeId)
      }
    : defaultTrackPanelStateForGenome;
};

export const getPersistentTrackPanelStateForGenome = (
  genomeId: string
): Partial<TrackPanelStateForGenome> => {
  return browserStorageService.getTrackPanels()[genomeId] || {};
};

const trackPanelSlice = createSlice({
  name: 'genome-browser-track-panel',
  initialState: {} as TrackPanelState,
  reducers: {
    setInitialTrackPanelDataForGenome(
      state,
      action: PayloadAction<ParsedUrlPayload>
    ) {
      const { activeGenomeId } = action.payload;
      if (!state[activeGenomeId]) {
        state[activeGenomeId] = getTrackPanelStateForGenome(activeGenomeId);
      }
    },
    updateTrackPanelForGenome(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
        data: Partial<TrackPanelStateForGenome>;
      }>
    ) {
      const { activeGenomeId, data } = action.payload;

      state[activeGenomeId] = {
        ...state[activeGenomeId],
        ...data
      };
    },
    deleteGenomeTrackPanelData(state, action: PayloadAction<string>) {
      delete state[action.payload];
    }
  }
});

export const {
  setInitialTrackPanelDataForGenome,
  updateTrackPanelForGenome,
  deleteGenomeTrackPanelData
} = trackPanelSlice.actions;

export default trackPanelSlice.reducer;
