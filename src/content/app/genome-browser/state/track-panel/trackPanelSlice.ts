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
  createAsyncThunk,
  type PayloadAction,
  type ThunkAction,
  type Action
} from '@reduxjs/toolkit';

import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';
import { parseFocusObjectId } from 'src/shared/helpers/focusObjectHelpers';

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
  (
    isTrackPanelOpened: boolean
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
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
    selectedTrackPanelTab: TrackSet,
    options: {
      shouldCloseSidebarModal: boolean;
    } = { shouldCloseSidebarModal: true }
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const activeGenomeId = getBrowserActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

    if (options.shouldCloseSidebarModal) {
      dispatch(closeBrowserSidebarModal());
    }

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

export const updateTrackPanelTabForNewFocusObject = createAsyncThunk(
  'track-panel-slice/updateTrackPanelTabWhenFocusObjectChanges',
  (params: { genomeId: string; focusObjectId: string }) => {
    const { genomeId, focusObjectId } = params;
    const { type } = parseFocusObjectId(focusObjectId);
    let trackPanelTab;
    if (type === 'variant') {
      trackPanelTab = TrackSet.VARIATION;
    } else {
      trackPanelTab = TrackSet.GENOMIC;
    }

    return {
      genomeId,
      trackPanelTab: trackPanelTab
    };
  }
);

export const changeHighlightedTrackId =
  (
    highlightedTrackId: string
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
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
  },
  extraReducers: (builder) => {
    builder.addCase(
      updateTrackPanelTabForNewFocusObject.fulfilled,
      (state, action) => {
        const { genomeId, trackPanelTab } = action.payload;
        if (!state[genomeId]) {
          state[genomeId] = structuredClone(defaultTrackPanelStateForGenome);
        }
        if (state[genomeId].selectedTrackPanelTab !== trackPanelTab) {
          state[genomeId].selectedTrackPanelTab = trackPanelTab;
        }
      }
    );
  }
});

export const {
  setInitialTrackPanelDataForGenome,
  updateTrackPanelForGenome,
  deleteGenomeTrackPanelData
} = trackPanelSlice.actions;

export default trackPanelSlice.reducer;
