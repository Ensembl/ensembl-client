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
  getBrowserActiveEnsObjectId,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getEnsObjectById } from 'src/shared/state/ens-object/ensObjectSelectors';

import { ChrLocation } from 'src/content/app/genome-browser/state/browser-location/browserLocationSlice';
import { RootState } from 'src/store';

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

export const isFocusObjectPositionDefault = (state: RootState) =>
  state.browser.browserLocation.isObjectInDefaultPosition;
