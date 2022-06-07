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

import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';
import browserTrackConfigStorageService from 'src/content/app/genome-browser/components/browser-track-config/services/browserTrackConfigStorageService';

import { updateTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { getBrowserTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getGenomeTrackCategoriesById } from 'src/shared/state/genome/genomeSelectors';
import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';

import type { RootState } from 'src/store';
import type { BrowserTrackStates } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import type { GenomeTrackCategory } from 'src/shared/state/genome/genomeTypes';

export type CogList = {
  [key: string]: number;
};

export enum TrackType {
  GENE = 'gene',
  REGULAR = 'regular'
}

export const getTrackType = (trackId: string) => {
  if (trackId.startsWith('gene')) {
    return TrackType.GENE;
  } else {
    return TrackType.REGULAR;
  }
};

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

export type TrackConfigsForGenome = Readonly<{
  applyToAllConfig: {
    isSelected?: boolean;
  };
  browserCogList: CogList;
  selectedCog: string | null;
  tracks: TrackConfigs;
}>;

export type GenomeTrackConfigs = {
  [genomeId: string]: TrackConfigsForGenome;
};

export const defaultTrackConfigsForGenome: TrackConfigsForGenome = {
  applyToAllConfig: {
    isSelected: false
  },
  browserCogList: {},
  selectedCog: null,
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

export const loadTrackConfigsState: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const state = getState();
  const genomeId = getActiveGenomeId(state);

  if (!genomeId) {
    return;
  }

  const trackCategories = getGenomeTrackCategoriesById(state);

  dispatch(setInitialTrackConfigsForGenome({ genomeId, trackCategories }));
};

export const updateTrackStatesAndSave: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (payload: BrowserTrackStates) => (dispatch, getState: () => RootState) => {
  dispatch(updateTrackStates(payload));
  const trackStates = getBrowserTrackStates(getState());
  browserStorageService.saveTrackStates(trackStates);
};

export const prepareTrackConfigs = (trackCategories: GenomeTrackCategory[]) => {
  const defaultTrackConfigs: TrackConfigs = {};

  defaultTrackConfigs['gene-focus'] = {
    showSeveralTranscripts: false,
    showTranscriptIds: false,
    showTrackName: false,
    showFeatureLabel: true,
    trackType: TrackType.GENE
  };

  trackCategories.forEach((category) => {
    category.track_list.forEach((track) => {
      const trackId = track.track_id.replace('track:', '');
      const trackType = getTrackType(trackId);

      if (trackType === TrackType.GENE) {
        defaultTrackConfigs[trackId] = getDefaultGeneTrackConfig();
      } else {
        defaultTrackConfigs[trackId] = getDefaultRegularTrackConfig();
      }
    });
  });
  return { tracks: defaultTrackConfigs };
};

export const getTrackConfigsForGenome = (
  genomeId: string,
  trackCategories: GenomeTrackCategory[]
): TrackConfigsForGenome => {
  return genomeId
    ? {
        ...defaultTrackConfigsForGenome,
        ...prepareTrackConfigs(trackCategories),
        ...getPersistentTrackConfigsForGenome(genomeId)
      }
    : defaultTrackConfigsForGenome;
};

export const getPersistentTrackConfigsForGenome = (
  genomeId: string
): Partial<TrackConfigsForGenome> => {
  const trackConfigs = browserTrackConfigStorageService.getTrackConfigs();

  if (!genomeId || !trackConfigs[genomeId]) {
    return {};
  }

  return trackConfigs[genomeId];
};

const browserTrackConfigSlice = createSlice({
  name: 'genome-browser-track-config',
  initialState: {} as GenomeTrackConfigs,
  reducers: {
    setInitialTrackConfigsForGenome(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackCategories: GenomeTrackCategory[] | null;
      }>
    ) {
      const { genomeId, trackCategories } = action.payload;

      if (!state[genomeId] && trackCategories) {
        state[genomeId] = getTrackConfigsForGenome(genomeId, trackCategories);

        browserTrackConfigStorageService.setTrackConfigs({
          genomeId,
          fragment: state[genomeId]
        });
      }
    },
    updateCogList(
      state,
      action: PayloadAction<{
        genomeId: string;
        browserCogList: CogList;
      }>
    ) {
      const { genomeId, browserCogList } = action.payload;
      state[genomeId].browserCogList = browserCogList;
      browserTrackConfigStorageService.setTrackConfigs({
        genomeId,
        fragment: { browserCogList }
      });
    },
    updateSelectedCog(
      state,
      action: PayloadAction<{
        genomeId: string;
        selectedCog: string | null;
      }>
    ) {
      const { genomeId, selectedCog } = action.payload;
      state[genomeId].selectedCog = selectedCog;
      browserTrackConfigStorageService.setTrackConfigs({
        genomeId,
        fragment: { selectedCog }
      });
    },
    updateApplyToAll(
      state,
      action: PayloadAction<{
        genomeId: string;
        isSelected: boolean;
      }>
    ) {
      const { genomeId, isSelected } = action.payload;
      state[genomeId].applyToAllConfig.isSelected = isSelected;
      browserTrackConfigStorageService.setTrackConfigs({
        genomeId,
        fragment: { applyToAllConfig: { isSelected } }
      });
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
      const trackConfigState = state[genomeId].tracks[selectedCog];
      trackConfigState.showTrackName = isTrackNameShown;
      const fragment = {
        tracks: {
          [selectedCog]: {
            ...trackConfigState
          }
        }
      };
      browserTrackConfigStorageService.setTrackConfigs({
        genomeId,
        fragment
      });
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
      const trackConfigState = state[genomeId].tracks[selectedCog];

      if (trackConfigState.trackType !== TrackType.GENE) {
        return;
      }

      // TODO: check if trackConfigState is a reference and the actual state is not getting updated
      trackConfigState.showFeatureLabel = isTrackLabelShown;

      const fragment = {
        tracks: {
          [selectedCog]: {
            ...trackConfigState
          }
        }
      };
      browserTrackConfigStorageService.setTrackConfigs({
        genomeId,
        fragment
      });
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
      const trackConfigState = state[genomeId].tracks[selectedCog];

      if (trackConfigState.trackType !== TrackType.GENE) {
        return;
      }

      // TODO: check if trackConfigState is a reference and the actual state is not getting updated
      trackConfigState.showSeveralTranscripts = isSeveralTranscriptsShown;

      const fragment = {
        tracks: {
          [selectedCog]: {
            ...trackConfigState
          }
        }
      };
      browserTrackConfigStorageService.setTrackConfigs({
        genomeId,
        fragment
      });
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
      const trackConfigState = state[genomeId].tracks[selectedCog];

      if (trackConfigState.trackType !== TrackType.GENE) {
        return;
      }

      // TODO: check if trackConfigState is a reference and the actual state is not getting updated
      trackConfigState.showTranscriptIds = isTranscriptIdsShown;

      const fragment = {
        tracks: {
          [selectedCog]: {
            ...trackConfigState
          }
        }
      };
      browserTrackConfigStorageService.setTrackConfigs({
        genomeId,
        fragment
      });
    },
    deleteTrackConfigsForGenome(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      delete state[genomeId];
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
