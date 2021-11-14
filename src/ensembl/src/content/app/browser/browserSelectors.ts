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

import { RootState } from 'src/store';
import { ChrLocation, defaultBrowserNavIconsState } from './browserState';

import { getGenomeInfo } from 'src/shared/state/genome/genomeSelectors';
import { getEnsObjectById } from 'src/shared/state/ens-object/ensObjectSelectors';

import { Status } from 'src/shared/types/status';

export const getBrowserActivated = (state: RootState) =>
  state.browser.browserInfo.browserActivated;

export const getBrowserActiveGenomeId = (state: RootState) =>
  state.browser.browserEntity.activeGenomeId;

export const getBrowserActiveGenomeInfo = (state: RootState) => {
  const allGenomesInfo = getGenomeInfo(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? allGenomesInfo[activeGenomeId] : null;
};

export const getBrowserActiveEnsObjectIds = (state: RootState) =>
  state.browser.browserEntity.activeEnsObjectIds;

export const getBrowserActiveEnsObjectId = (state: RootState) => {
  const activeEnsObjectIds = getBrowserActiveEnsObjectIds(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? activeEnsObjectIds[activeGenomeId] : null;
};

export const getBrowserActiveEnsObject = (state: RootState) => {
  const activeObjectId = getBrowserActiveEnsObjectId(state);
  if (!activeObjectId) {
    return null;
  }
  return getEnsObjectById(state, activeObjectId);
};

export const getBrowserTrackStates = (state: RootState) =>
  state.browser.browserEntity.trackStates;

export const getBrowserTrackState = (
  state: RootState,
  params: {
    genomeId: string;
    categoryName: string;
    trackId: string;
  } & (
    | {
        objectId: string;
        tracksGroup: 'objectTracks';
      }
    | {
        tracksGroup: 'commonTracks';
      }
  )
) => {
  const { genomeId, tracksGroup, categoryName, trackId } = params;
  const allBrowserTrackStates = getBrowserTrackStates(state);
  const savedTrackStatus =
    tracksGroup === 'objectTracks'
      ? allBrowserTrackStates?.[genomeId]?.[tracksGroup]?.[params.objectId]?.[
          categoryName
        ]?.[trackId]
      : allBrowserTrackStates?.[genomeId]?.[tracksGroup]?.[categoryName]?.[
          trackId
        ];
  return savedTrackStatus ?? Status.SELECTED;
};

export const getBrowserActiveGenomeTrackStates = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return activeGenomeId
    ? state.browser.browserEntity.trackStates[activeGenomeId]
    : null;
};

export const getBrowserNavOpenState = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  if (!activeGenomeId) {
    return false;
  }

  return state.browser.browserNav.browserNavOpenState[activeGenomeId] || false;
};

export const getBrowserNavIconStates = (state: RootState) => {
  return (
    state.browser.browserNav.browserNavIconStates || defaultBrowserNavIconsState
  );
};

export const getAllChrLocations = (state: RootState) =>
  state.browser.browserLocation.chrLocations;

export const getChrLocation = (state: RootState) => {
  const chrLocations = getAllChrLocations(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? chrLocations[activeGenomeId] : null;
};

export const getActualChrLocation = (state: RootState) => {
  const locations = state.browser.browserLocation.actualChrLocations;
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? locations[activeGenomeId] : null;
};

export const getDefaultChrLocation = (state: RootState) => {
  const activeEnsObjectId = getBrowserActiveEnsObjectId(state);
  const activeEnsObject =
    activeEnsObjectId && getEnsObjectById(state, activeEnsObjectId);
  if (!activeEnsObject) {
    return null;
  }
  const { chromosome, start, end } = activeEnsObject.location;

  return [chromosome, start, end] as ChrLocation;
};

export const getRegionEditorActive = (state: RootState) =>
  state.browser.browserLocation.regionEditorActive;

export const getRegionFieldActive = (state: RootState) =>
  state.browser.browserLocation.regionFieldActive;

export const getBrowserCogList = (state: RootState) =>
  state.browser.trackConfig.browserCogList;

export const getBrowserCogTrackList = (state: RootState) =>
  state.browser.trackConfig.browserCogTrackList;

export const getBrowserSelectedCog = (state: RootState) =>
  state.browser.trackConfig.selectedCog;

export const getTrackConfigNames = (state: RootState) =>
  state.browser.trackConfig.trackConfigNames;

export const getTrackConfigLabel = (state: RootState) =>
  state.browser.trackConfig.trackConfigLabel;

export const getApplyToAll = (state: RootState) =>
  state.browser.trackConfig.applyToAll;

export const isFocusObjectPositionDefault = (state: RootState) =>
  state.browser.browserLocation.isObjectInDefaultPosition;
