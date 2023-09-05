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

import { TrackType } from './trackSettingsConstants';

import type { RootState } from 'src/store';

export type GeneTrackSettings = {
  several: boolean; // meaning, whether to show several transcripts or just one
  'transcript-label': boolean; // show transcript ids
  name: boolean; // show the name of the track
  label: boolean; // show labels (symbols or stable ids) of genes
  isVisible: boolean;
};

export type VariantTrackSettings = {
  'label-snv-id': boolean;
  'label-snv-alleles': boolean;
  'label-other-id': boolean;
  'label-other-alleles': boolean;
  'show-extents': boolean;
  name: boolean;
  isVisible: boolean;
};

export type FocusGeneTrackSettings = Omit<GeneTrackSettings, 'isVisible'>;
export type FocusVariantTrackSettings = Omit<VariantTrackSettings, 'isVisible'>;

export type RegularTrackSettings = {
  name: boolean;
  isVisible: boolean;
};

export type GeneTrack = {
  id: string;
  trackType: TrackType.GENE;
  settings: GeneTrackSettings;
};

export type FocusGeneTrack = {
  id: string;
  trackType: TrackType.FOCUS_GENE;
  settings: FocusGeneTrackSettings;
};

export type FocusVariantTrack = {
  id: string;
  trackType: TrackType.FOCUS_VARIANT;
  settings: FocusVariantTrackSettings;
};

export type RegularTrack = {
  id: string;
  trackType: TrackType.REGULAR;
  settings: RegularTrackSettings;
};

export type TrackSettings =
  | GeneTrack
  | FocusGeneTrack
  | FocusVariantTrack
  | RegularTrack;

export type TrackSettingsPerTrack = {
  [trackId: string]: TrackSettings;
};

export type TrackSettingsForGenome = Readonly<{
  settingsForIndividualTracks: TrackSettingsPerTrack;
}>;

export type GenomeTrackSettings = {
  [genomeId: string]: TrackSettingsForGenome;
};

type TrackSettingsState = {
  [genomeId: string]: TrackSettingsForGenome;
};

export const defaultTrackSettingsForGenome: TrackSettingsForGenome = {
  settingsForIndividualTracks: {}
};

export const updateTrackSettingsAndSave = createAsyncThunk(
  'genome-browser-track-settings/update-track-settings-and-save',
  async (
    params: {
      genomeId: string;
      setting: string;
      isEnabled: boolean;
    },
    thunkAPI
  ) => {
    const { genomeId, setting, isEnabled } = params;
    const state = thunkAPI.getState() as RootState;
    const allTrackSettingsForGenome = getAllTrackSettingsForGenome(
      state,
      genomeId
    );

    if (!allTrackSettingsForGenome) {
      return; // shouldn't happen
    }

    const newTrackSettingsForGenome = structuredClone(
      allTrackSettingsForGenome
    );

    const trackMap = newTrackSettingsForGenome.settingsForIndividualTracks;

    for (const [, track] of Object.entries(trackMap)) {
      if (setting in track.settings) {
        track.settings[setting as keyof typeof track.settings] = isEnabled;

        await trackSettingsStorageService.updateTrackSettings(genomeId, track);
      }
    }

    return {
      genomeId,
      settingsForGenome: newTrackSettingsForGenome
    };
  }
);

export const updateTrackVisibilityAndSave = createAsyncThunk(
  'genome-browser-track-settings/update-track-visibility-and-save',
  async (
    params: {
      genomeId: string;
      trackId: string;
      isVisible: boolean;
    },
    thunkAPI
  ) => {
    const { genomeId, trackId, isVisible } = params;
    const state = thunkAPI.getState() as RootState;
    const allTrackSettingsForGenome = getAllTrackSettingsForGenome(
      state,
      genomeId
    );
    const trackSettings =
      allTrackSettingsForGenome?.settingsForIndividualTracks[trackId];

    if (!trackSettings) {
      return; // shouldn't happen
    }

    const newTrackSettings = structuredClone(trackSettings);
    (newTrackSettings.settings as { isVisible: boolean }).isVisible = isVisible;

    await trackSettingsStorageService.updateTrackSettings(
      genomeId,
      newTrackSettings
    );

    return {
      genomeId,
      trackId,
      trackSettings: newTrackSettings
    };
  }
);

// TODO: get proper data from the backend in order not to hack track id
export const getTrackType = (trackId: string) => {
  if (!trackId) {
    return null;
  }

  if (trackId.startsWith('gene') || trackId === 'focus') {
    return TrackType.GENE;
  } else if (trackId === 'focus-variant') {
    return TrackType.FOCUS_VARIANT;
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
          ...state[genomeId]?.settingsForIndividualTracks,
          ...trackSettings
        }
      };
    },
    addSettingsForTrack(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackId: string;
        trackSettings: TrackSettings;
      }>
    ) {
      const { genomeId, trackId, trackSettings } = action.payload;
      if (!state[genomeId]) {
        state[genomeId] = { settingsForIndividualTracks: {} };
      }
      state[genomeId].settingsForIndividualTracks[trackId] = trackSettings;
    },
    deleteTrackSettingsForGenome(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      delete state[genomeId];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateTrackSettingsAndSave.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      const { genomeId, settingsForGenome } = action.payload;
      state[genomeId] = settingsForGenome;
    });
    builder.addCase(updateTrackVisibilityAndSave.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      const { genomeId, trackId, trackSettings } = action.payload;
      state[genomeId].settingsForIndividualTracks[trackId] = trackSettings;
    });
  }
});

export const {
  setInitialTrackSettingsForGenome,
  deleteTrackSettingsForGenome,
  addSettingsForTrack
} = trackSettingsSlice.actions;

export default trackSettingsSlice.reducer;
