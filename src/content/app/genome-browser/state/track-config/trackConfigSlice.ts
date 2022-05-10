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

import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';

import { updateTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { getBrowserTrackStates } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { BrowserTrackStates } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { RootState } from 'src/store';
import browserTrackConfigStorageService from '../../components/browser-track-config/services/browser-track-config-storage-service';
import { GenomeTrackCategory } from 'src/shared/state/genome/genomeTypes';

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
  showMoreTranscripts: boolean;
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
// export type TrackConfig =
//   | ({ trackType: TrackType.GENE } & GeneTrackConfig)
//   | ({ trackType: TrackType.REGULAR } & RegularTrackConfig);

export type TrackInfo = {
  [trackId: string]: TrackConfig;
};

export type TrackConfigStateForObject = Readonly<{
  applyToAllConfig: {
    isSelected?: boolean;
  };
  browserCogList: CogList;
  selectedCog: string | null;
  tracks: TrackInfo;
}>;

export type TrackConfigState = {
  [genomeId: string]: TrackConfigStateForObject;
};

export const defaultTrackConfigStateForObject: TrackConfigStateForObject = {
  applyToAllConfig: {
    isSelected: false
  },
  browserCogList: {},
  selectedCog: null,
  tracks: {}
};

export const updateTrackStatesAndSave: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (payload: BrowserTrackStates) => (dispatch, getState: () => RootState) => {
  dispatch(updateTrackStates(payload));
  const trackStates = getBrowserTrackStates(getState());
  browserStorageService.saveTrackStates(trackStates);
};

export const getTracksStateInfo = (
  genomeId: string,
  trackCategories: GenomeTrackCategory[]
) => {
  const tracksInfo: TrackInfo = {};

  tracksInfo['gene-focus'] = {
    showMoreTranscripts: false,
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
        tracksInfo[trackId] = {
          showMoreTranscripts: false,
          showTranscriptIds: false,
          showTrackName: false,
          showFeatureLabel: true,
          trackType
        };
      } else {
        tracksInfo[trackId] = {
          showTrackName: false,
          trackType
        };
      }
    });
  });
  return { tracks: tracksInfo };
};

export const getTrackConfigStateForObject = (
  genomeId: string,
  trackCategories: GenomeTrackCategory[]
): TrackConfigStateForObject => {
  return genomeId
    ? {
        ...defaultTrackConfigStateForObject,
        ...getTracksStateInfo(genomeId, trackCategories),
        ...getPersistentTrackConfigStateForObject(genomeId)
      }
    : defaultTrackConfigStateForObject;
};

export const getPersistentTrackConfigStateForObject = (
  genomeId: string
): Partial<TrackConfigStateForObject> => {
  const trackConfigState =
    browserTrackConfigStorageService.getTrackConfigState();
  if (!genomeId || !trackConfigState[genomeId]) {
    return {};
  }
  return trackConfigState[genomeId] || {};
};

const browserTrackConfigSlice = createSlice({
  name: 'genome-browser-track-config',
  initialState: {} as TrackConfigState,
  reducers: {
    setInitialTrackConfigDataForObject(
      state,
      action: PayloadAction<{
        genomeId: string;
        trackCategories: GenomeTrackCategory[];
      }>
    ) {
      const { genomeId, trackCategories } = action.payload;
      if (!state[genomeId]) {
        state[genomeId] = getTrackConfigStateForObject(
          genomeId,
          trackCategories
        );
      }
      browserTrackConfigStorageService.setTrackConfigState({
        genomeId: genomeId,
        fragment: state[genomeId]
      });
    },
    updateCogList(
      state,
      action: PayloadAction<{
        genomeId: string;
        objectId: string;
        browserCogList: CogList;
      }>
    ) {
      const { genomeId, browserCogList } = action.payload;
      state[genomeId].browserCogList = browserCogList;
      browserTrackConfigStorageService.setTrackConfigState({
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
      browserTrackConfigStorageService.setTrackConfigState({
        genomeId,
        fragment: { selectedCog }
      });
    },
    updateApplyToAll(
      state,
      action: PayloadAction<{
        genomeId: string;
        objectId: string;
        isSelected: boolean;
      }>
    ) {
      const { genomeId, isSelected } = action.payload;
      state[genomeId].applyToAllConfig.isSelected = isSelected;
      browserTrackConfigStorageService.setTrackConfigState({
        genomeId,
        fragment: { applyToAllConfig: { isSelected } }
      });
    },
    updateTrackConfigNames(
      state,
      action: PayloadAction<{
        genomeId: string;
        objectId: string;
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
      browserTrackConfigStorageService.setTrackConfigState({
        genomeId,
        fragment
      });
    },
    updateTrackConfigLabel(
      state,
      action: PayloadAction<{
        genomeId: string;
        objectId: string;
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
      browserTrackConfigStorageService.setTrackConfigState({
        genomeId,
        fragment
      });
    }
  }
});

export const {
  setInitialTrackConfigDataForObject,
  updateCogList,
  updateSelectedCog,
  updateApplyToAll,
  // updateApplyToAllTrackNames,
  // updateApplyToAllTrackLabels,
  updateTrackConfigNames,
  updateTrackConfigLabel
} = browserTrackConfigSlice.actions;

export default browserTrackConfigSlice.reducer;
