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
import pick from 'lodash/pick';

import trackSettingsStorageService from 'src/content/app/genome-browser/components/track-settings-panel/services/trackSettingsStorageService';

import type { RootState } from 'src/store';

export type CogList = {
  [key: string]: number;
};

export enum TrackType {
  GENE = 'gene',
  REGULAR = 'regular'
}

export type GeneTrackSettings = {
  showSeveralTranscripts: boolean;
  showTranscriptIds: boolean;
  showTrackName: boolean;
  showFeatureLabels: boolean;
  trackType: TrackType.GENE;
};

export type RegularTrackSettings = {
  showTrackName: boolean;
  trackType: TrackType.REGULAR;
};

export type Settings = GeneTrackSettings | RegularTrackSettings;

export type TrackSettings = {
  [trackId: string]: Settings;
};

export type TrackSettingsForGenome = Readonly<{
  shouldApplyToAll: boolean;
  tracks: TrackSettings;
}>;

export type GenomeTrackSettings = {
  [genomeId: string]: TrackSettingsForGenome;
};

/**
 *
 * The cogs, which rely on the information about tracks sent from the genome browser,
 * are genome-independent. I.e. if a genome changes, but both the list of the tracks
 * and the height of the tracks remains the same, from the genome browser’s point of view,
 * nothing has really changed.
 * Hopefully, we’ll be able to to remove the cogs from the redux state altogether
 */
type TrackSettingsState = {
  selectedCog: string | null;
  settings: GenomeTrackSettings;
};

export const defaultTrackSettingsForGenome: TrackSettingsForGenome = {
  shouldApplyToAll: false,
  tracks: {}
};

export const getDefaultGeneTrackSettings = (): GeneTrackSettings => ({
  showSeveralTranscripts: false,
  showTranscriptIds: false,
  showTrackName: false,
  showFeatureLabels: true,
  trackType: TrackType.GENE
});

export const getDefaultRegularTrackSettings = (): RegularTrackSettings => ({
  showTrackName: false,
  trackType: TrackType.REGULAR
});

export const saveTrackSettingsForGenome: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (genomeId: string) => (_, getState: () => RootState) => {
  const state = getState();
  const trackSettingsForGenome = state.browser.trackSettings.settings[genomeId];
  const fieldsForSaving = pick(trackSettingsForGenome, [
    'shouldApplyToAll',
    'tracks'
  ]);

  trackSettingsStorageService.setTrackSettings({
    genomeId,
    fragment: fieldsForSaving
  });
};

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

const initialState: TrackSettingsState = {
  selectedCog: null,
  settings: {}
};

const trackSettingsSlice = createSlice({
  name: 'genome-track-settings',
  initialState,
  reducers: {
    setInitialTrackSettingsForGenome(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackSettings: Partial<TrackSettingsForGenome>;
      }>
    ) {
      const { genomeId, trackSettings } = action.payload;
      state.settings[genomeId] = {
        ...defaultTrackSettingsForGenome,
        ...trackSettings
      };
    },
    updateSelectedCog(state, action: PayloadAction<string | null>) {
      const selectedCog = action.payload;
      state.selectedCog = selectedCog;
    },
    updateApplyToAll(
      state,
      action: PayloadAction<{
        genomeId: string;
        isSelected: boolean;
      }>
    ) {
      const { genomeId, isSelected } = action.payload;
      state.settings[genomeId].shouldApplyToAll = isSelected;
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
      const trackSettingsState = state.settings[genomeId].tracks[trackId];
      trackSettingsState.showTrackName = isTrackNameShown;
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
      const trackSettingsState = state.settings[genomeId].tracks[trackId];

      if (trackSettingsState.trackType !== TrackType.GENE) {
        return;
      }

      trackSettingsState.showFeatureLabels = areFeatureLabelsShown;
    },
    updateShowSeveralTranscripts(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackId: string;
        isSeveralTranscriptsShown: boolean;
      }>
    ) {
      const { genomeId, trackId, isSeveralTranscriptsShown } = action.payload;
      const trackSettingsState = state.settings[genomeId].tracks[trackId];

      if (trackSettingsState.trackType !== TrackType.GENE) {
        return;
      }

      trackSettingsState.showSeveralTranscripts = isSeveralTranscriptsShown;
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
      const trackSettingsState = state.settings[genomeId].tracks[trackId];

      if (trackSettingsState.trackType !== TrackType.GENE) {
        return;
      }

      trackSettingsState.showTranscriptIds = shouldShowTranscriptIds;
    },
    deleteTrackSettingsForGenome(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      delete state.settings[genomeId];
    }
  }
});

export const {
  setInitialTrackSettingsForGenome,
  updateSelectedCog,
  updateApplyToAll,
  updateTrackName,
  updateFeatureLabelsVisibility,
  updateShowSeveralTranscripts,
  updateShowTranscriptIds,
  deleteTrackSettingsForGenome
} = trackSettingsSlice.actions;

export default trackSettingsSlice.reducer;
