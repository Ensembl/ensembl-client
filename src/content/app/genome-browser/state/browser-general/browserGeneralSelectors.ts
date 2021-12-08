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

import { getGenomeInfo } from 'src/shared/state/genome/genomeSelectors';
import { getEnsObjectById } from 'src/shared/state/ens-object/ensObjectSelectors';

import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';
import { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

export const getBrowserActiveGenomeId = (state: RootState) =>
  state.browser.browserGeneral.activeGenomeId;

export const getBrowserActiveGenomeInfo = (state: RootState) => {
  const allGenomesInfo = getGenomeInfo(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? allGenomesInfo[activeGenomeId] : null;
};

export const getBrowserActiveEnsObjectIds = (state: RootState) =>
  state.browser.browserGeneral.activeEnsObjectIds;

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
  state.browser.browserGeneral.trackStates;

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
    ? state.browser.browserGeneral.trackStates[activeGenomeId]
    : null;
};

export const getAllChrLocations = (state: RootState) =>
  state.browser.browserGeneral.chrLocations;

export const getChrLocation = (state: RootState) => {
  const chrLocations = getAllChrLocations(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? chrLocations[activeGenomeId] : null;
};

export const getActualChrLocation = (state: RootState) => {
  const locations = state.browser.browserGeneral.actualChrLocations;
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
  state.browser.browserGeneral.regionEditorActive;

export const getRegionFieldActive = (state: RootState) =>
  state.browser.browserGeneral.regionFieldActive;

export const isFocusObjectPositionDefault = (state: RootState) =>
  state.browser.browserGeneral.isObjectInDefaultPosition;
