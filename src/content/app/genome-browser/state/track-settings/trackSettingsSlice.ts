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
  type PayloadAction
} from '@reduxjs/toolkit';

import * as trackSettingsStorageService from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageService';

import { getAllTrackSettingsForGenome } from './trackSettingsSelectors';

import { isGeneTrack, TrackType } from './trackSettingsConstants';

import type { TrackActivityStatus } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import type { RootState } from 'src/store';

// FIXME: check if this type can be deleted/moved?
export type CogList = {
  [key: string]: number;
};

export type GeneTrackSettings = {
  showSeveralTranscripts: boolean;
  showTranscriptIds: boolean;
  showTrackName: boolean;
  showFeatureLabels: boolean;
};

export type RegularTrackSettings = {
  showTrackName: boolean;
};

export type GeneTrack = {
  id: string;
  trackType: TrackType.GENE;
  status: TrackActivityStatus;
  settings: GeneTrackSettings;
};

export type FocusGeneTrack = {
  id: string;
  trackType: TrackType.FOCUS_GENE;
  settings: GeneTrackSettings;
};

export type RegularTrack = {
  id: string;
  trackType: TrackType.REGULAR;
  status: TrackActivityStatus;
  settings: RegularTrackSettings;
};

export type TrackSettings = GeneTrack | FocusGeneTrack | RegularTrack;

export type TrackSettingsPerTrack = {
  [trackId: string]: TrackSettings;
};

export type TrackSettingsForGenome = Readonly<{
  settingsForAllTracks: {
    shouldApplyToAll: boolean;
  };
  settingsForIndividualTracks: TrackSettingsPerTrack;
}>;

export type GenomeTrackSettings = {
  [genomeId: string]: TrackSettingsForGenome;
};

type TrackSettingsState = {
  [genomeId: string]: TrackSettingsForGenome;
};

// FIXME: this constant is now meaningless?
export const defaultTrackSettingsForGenome: TrackSettingsForGenome = {
  settingsForAllTracks: {
    shouldApplyToAll: false
  },
  settingsForIndividualTracks: {}
};

export const saveTrackSettingsForGenome = createAsyncThunk(
  'genome-browser-track-settings/save-track-settings-for-genome',
  async (genomeId: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const trackSettingsForGenome = getAllTrackSettingsForGenome(
      state,
      genomeId
    );
    if (!trackSettingsForGenome) {
      return; // shouldn't happen
    }

    const trackSettingsArray = Object.values(
      trackSettingsForGenome.settingsForIndividualTracks
    );

    // trackSettingsStorageService.saveTrackSettingsForGenome(genomeId, trackSettingsArray);
    trackSettingsStorageService.updateTrackSettingsForGenome(
      genomeId,
      trackSettingsArray
    );
  }
);

// TODO: get proper data from the backend in order not to hack track id
export const getTrackType = (trackId: string) => {
  if (!trackId) {
    return null;
  }

  if (trackId.startsWith('gene') || trackId === 'focus') {
    return TrackType.GENE;
  } else {
    return TrackType.REGULAR;
  }
};

const initialState: TrackSettingsState = {};

const trackSettingsSlice = createSlice({
  name: 'genome-track-settings',
  initialState,
  reducers: {
    setInitialTrackSettingsForGenome(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackSettings: TrackSettingsPerTrack;
      }>
    ) {
      const { genomeId, trackSettings } = action.payload;
      state[genomeId] = {
        ...defaultTrackSettingsForGenome,
        settingsForIndividualTracks: {
          ...trackSettings // would need to check whether these fields are actually valid for a given track
        }
      };
    },
    updateApplyToAll(
      state,
      action: PayloadAction<{
        genomeId: string;
        isSelected: boolean;
      }>
    ) {
      const { genomeId, isSelected } = action.payload;
      state[genomeId].settingsForAllTracks.shouldApplyToAll = isSelected;
    },
    updateTrackName(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackId: string;
        isTrackNameShown: boolean;
      }>
    ) {
      const { genomeId, trackId, isTrackNameShown } = action.payload;
      const trackSettingsState =
        state[genomeId].settingsForIndividualTracks[trackId];
      trackSettingsState.settings.showTrackName = isTrackNameShown;
    },
    updateFeatureLabelsVisibility(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackId: string;
        areFeatureLabelsShown: boolean;
      }>
    ) {
      const { genomeId, trackId, areFeatureLabelsShown } = action.payload;
      const trackSettingsState =
        state[genomeId].settingsForIndividualTracks[trackId];

      if (!isGeneTrack(trackSettingsState)) {
        return;
      }

      trackSettingsState.settings.showFeatureLabels = areFeatureLabelsShown;
    },
    updateShowSeveralTranscripts(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackId: string;
        areSeveralTranscriptsShown: boolean;
      }>
    ) {
      const { genomeId, trackId, areSeveralTranscriptsShown } = action.payload;
      const trackSettingsState =
        state[genomeId].settingsForIndividualTracks[trackId];

      if (!isGeneTrack(trackSettingsState)) {
        return;
      }

      trackSettingsState.settings.showSeveralTranscripts =
        areSeveralTranscriptsShown;
    },
    updateShowTranscriptIds(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackId: string;
        shouldShowTranscriptIds: boolean;
      }>
    ) {
      const { genomeId, trackId, shouldShowTranscriptIds } = action.payload;
      const trackSettingsState =
        state[genomeId].settingsForIndividualTracks[trackId];

      if (!isGeneTrack(trackSettingsState)) {
        return;
      }

      trackSettingsState.settings.showTranscriptIds = shouldShowTranscriptIds;
    },
    deleteTrackSettingsForGenome(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      delete state[genomeId];
    }
  }
});

export const {
  setInitialTrackSettingsForGenome,
  updateApplyToAll,
  updateTrackName,
  updateFeatureLabelsVisibility,
  updateShowSeveralTranscripts,
  updateShowTranscriptIds,
  deleteTrackSettingsForGenome
} = trackSettingsSlice.actions;

export default trackSettingsSlice.reducer;
