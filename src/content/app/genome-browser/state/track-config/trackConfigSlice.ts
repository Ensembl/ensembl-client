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

import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';
import browserTrackConfigStorageService from 'src/content/app/genome-browser/components/browser-track-config/services/browserTrackConfigStorageService';

import { updateTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { getBrowserTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import type { RootState } from 'src/store';
import type { BrowserTrackStates } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';

export type CogList = {
  [key: string]: number;
};

export enum TrackType {
  GENE = 'gene',
  REGULAR = 'regular'
}

export type GeneTrackConfig = {
  showSeveralTranscripts: boolean;
  showTranscriptIds: boolean;
  showTrackName: boolean;
  showFeatureLabel: boolean;
  trackType: TrackType.GENE;
};

export type RegularTrackConfig = {
  showTrackName: boolean;
  trackType: TrackType.REGULAR;
};

export type TrackConfig = GeneTrackConfig | RegularTrackConfig;

export type TrackConfigs = {
  [trackId: string]: TrackConfig;
};
4;

export type TrackConfigsForGenome = Readonly<{
  shouldApplyToAll: boolean;
  tracks: TrackConfigs;
}>;

export type GenomeTrackConfigs = {
  [genomeId: string]: TrackConfigsForGenome;
};

/**
 *
 * The cogs, which rely on the information about tracks sent from the genome browser,
 * are genome-independent. I.e. if a genome changes, but both the list of the tracks
 * and the height of the tracks remains the same, from the genome browser’s point of view,
 * nothing has really changed.
 * Hopefully, we’ll be able to to remove the cogs from the redux state altogether
 */
type TrackConfigState = {
  browserTrackCogs: {
    cogList: CogList;
    selectedCog: string | null;
  };
  configs: GenomeTrackConfigs;
};

export const defaultTrackConfigsForGenome: TrackConfigsForGenome = {
  shouldApplyToAll: false,
  tracks: {}
};

export const getDefaultGeneTrackConfig = (): GeneTrackConfig => ({
  showSeveralTranscripts: false,
  showTranscriptIds: false,
  showTrackName: false,
  showFeatureLabel: true,
  trackType: TrackType.GENE
});

export const getDefaultRegularTrackConfig = (): RegularTrackConfig => ({
  showTrackName: false,
  trackType: TrackType.REGULAR
});

export const updateTrackStatesAndSave: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (payload: BrowserTrackStates) => (dispatch, getState: () => RootState) => {
  dispatch(updateTrackStates(payload));
  const trackStates = getBrowserTrackStates(getState());
  browserStorageService.saveTrackStates(trackStates);
};

export const saveTrackConfigsForGenome: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (genomeId: string) => (_, getState: () => RootState) => {
  const state = getState();
  const trackConfigsForGenome = state.browser.trackConfig.configs[genomeId];
  const fieldsForSaving = pick(trackConfigsForGenome, [
    'shouldApplyToAll',
    'tracks'
  ]);

  browserTrackConfigStorageService.setTrackConfigs({
    genomeId,
    fragment: fieldsForSaving
  });
};

// TODO: get proper data from the backend in order not to hack track id
export const getTrackType = (trackId: string) => {
  if (trackId.startsWith('gene')) {
    return TrackType.GENE;
  } else {
    return TrackType.REGULAR;
  }
};

const initialState: TrackConfigState = {
  browserTrackCogs: {
    cogList: {},
    selectedCog: null
  },
  configs: {}
};

const browserTrackConfigSlice = createSlice({
  name: 'genome-browser-track-config',
  initialState: initialState,
  reducers: {
    setInitialTrackConfigsForGenome(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackConfigs: Partial<TrackConfigsForGenome>;
      }>
    ) {
      const { genomeId, trackConfigs } = action.payload;
      state.configs[genomeId] = {
        ...defaultTrackConfigsForGenome,
        ...trackConfigs
      };
    },
    updateCogList(state, action: PayloadAction<CogList>) {
      const browserCogList = action.payload;
      state.browserTrackCogs.cogList = browserCogList;
    },
    updateSelectedCog(state, action: PayloadAction<string | null>) {
      const selectedCog = action.payload;
      state.browserTrackCogs.selectedCog = selectedCog;
    },
    updateApplyToAll(
      state,
      action: PayloadAction<{
        genomeId: string;
        isSelected: boolean;
      }>
    ) {
      const { genomeId, isSelected } = action.payload;
      state.configs[genomeId].shouldApplyToAll = isSelected;
    },
    updateTrackName(
      state,
      action: PayloadAction<{
        genomeId: string;
        selectedCog: string;
        isTrackNameShown: boolean;
      }>
    ) {
      const { genomeId, selectedCog, isTrackNameShown } = action.payload;
      const trackConfigState = state.configs[genomeId].tracks[selectedCog];
      trackConfigState.showTrackName = isTrackNameShown;
    },
    updateFeatureLabel(
      state,
      action: PayloadAction<{
        genomeId: string;
        selectedCog: string;
        isTrackLabelShown: boolean;
      }>
    ) {
      const { genomeId, selectedCog, isTrackLabelShown } = action.payload;
      const trackConfigState = state.configs[genomeId].tracks[selectedCog];

      if (trackConfigState.trackType !== TrackType.GENE) {
        return;
      }

      trackConfigState.showFeatureLabel = isTrackLabelShown;
    },
    updateShowSeveralTranscripts(
      state,
      action: PayloadAction<{
        genomeId: string;
        selectedCog: string;
        isSeveralTranscriptsShown: boolean;
      }>
    ) {
      const { genomeId, selectedCog, isSeveralTranscriptsShown } =
        action.payload;
      const trackConfigState = state.configs[genomeId].tracks[selectedCog];

      if (trackConfigState.trackType !== TrackType.GENE) {
        return;
      }

      trackConfigState.showSeveralTranscripts = isSeveralTranscriptsShown;
    },
    updateShowTranscriptIds(
      state,
      action: PayloadAction<{
        genomeId: string;
        selectedCog: string;
        isTranscriptIdsShown: boolean;
      }>
    ) {
      const { genomeId, selectedCog, isTranscriptIdsShown } = action.payload;
      const trackConfigState = state.configs[genomeId].tracks[selectedCog];

      if (trackConfigState.trackType !== TrackType.GENE) {
        return;
      }

      trackConfigState.showTranscriptIds = isTranscriptIdsShown;
    },
    deleteTrackConfigsForGenome(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      delete state.configs[genomeId];
    }
  }
});

export const {
  setInitialTrackConfigsForGenome,
  updateCogList,
  updateSelectedCog,
  updateApplyToAll,
  updateTrackName,
  updateFeatureLabel,
  updateShowSeveralTranscripts,
  updateShowTranscriptIds,
  deleteTrackConfigsForGenome
} = browserTrackConfigSlice.actions;

export default browserTrackConfigSlice.reducer;
