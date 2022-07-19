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
import { getFocusObjectById } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';

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

export const getBrowserActiveFocusObjectIds = (state: RootState) =>
  state.browser.browserGeneral.activeFocusObjectIds;

export const getBrowserActiveFocusObjectId = (state: RootState) => {
  const activeFocusObjectIds = getBrowserActiveFocusObjectIds(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? activeFocusObjectIds[activeGenomeId] : null;
};

export const getBrowserActiveFocusObject = (state: RootState) => {
  const activeObjectId = getBrowserActiveFocusObjectId(state);
  if (!activeObjectId) {
    return null;
  }
  return getFocusObjectById(state, activeObjectId);
};

export const getBrowserTrackStates = (state: RootState) =>
  state.browser.browserGeneral.trackStates;

export const getBrowserTrackState = (
  state: RootState,
  params: {
    genomeId: string;
  } & (
    | {
        objectId: string;
        tracksGroup: 'objectTracks';
      }
    | {
        categoryName: string;
        tracksGroup: 'commonTracks';
        trackId: string;
      }
  )
) => {
  const { genomeId, tracksGroup } = params;
  const allBrowserTrackStates = getBrowserTrackStates(state);
  const savedTrackStatus =
    tracksGroup === 'objectTracks'
      ? allBrowserTrackStates?.[genomeId]?.[tracksGroup]?.[params.objectId]
          ?.status
      : allBrowserTrackStates?.[genomeId]?.[tracksGroup]?.[
          params.categoryName
        ]?.[params.trackId];
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
  const activeFocusObjectId = getBrowserActiveFocusObjectId(state);
  const activeFocusObject =
    activeFocusObjectId && getFocusObjectById(state, activeFocusObjectId);
  if (!activeFocusObject) {
    return null;
  }
  const { chromosome, start, end } = activeFocusObject.location;

  return [chromosome, start, end] as ChrLocation;
};

export const getRegionEditorActive = (state: RootState) =>
  state.browser.browserGeneral.regionEditorActive;

export const getRegionFieldActive = (state: RootState) =>
  state.browser.browserGeneral.regionFieldActive;
