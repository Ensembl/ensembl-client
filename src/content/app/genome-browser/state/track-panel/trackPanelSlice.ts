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
  type ThunkAction,
  type Action
} from '@reduxjs/toolkit';

import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getActiveTrackPanel } from './trackPanelSelectors';
import { ParsedUrlPayload } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { closeBrowserSidebarModal } from '../browser-sidebar-modal/browserSidebarModalSlice';

import { TrackSet } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';

import type { RootState } from 'src/store';

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
  highlightedTrackId: string;
  collapsedTrackIds: string[];
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  selectedTrackPanelTab: TrackSet.GENOMIC,
  isTrackPanelOpened: true,
  highlightedTrackId: '',
  collapsedTrackIds: []
};

export const toggleTrackPanel =
  (isTrackPanelOpened: boolean): ThunkAction<void, any, void, Action<string>> =>
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
  ): ThunkAction<void, any, void, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const activeGenomeId = getBrowserActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

    dispatch(closeBrowserSidebarModal());

    const data = {
      ...getActiveTrackPanel(getState()),
      selectedTrackPanelTab
    };

    dispatch(
      updateTrackPanelForGenome({
        activeGenomeId,
        data
      })
    );
  };

export const changeHighlightedTrackId =
  (highlightedTrackId: string): ThunkAction<void, any, void, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);

    if (!activeGenomeId) {
      return;
    }

    const data = {
      ...getActiveTrackPanel(state),
      highlightedTrackId
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
