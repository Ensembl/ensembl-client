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

import { getGenomes } from 'src/shared/state/genome/genomeSelectors';
import { getFocusObjectById } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';

import type { RootState } from 'src/store';
import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import type {
  FocusGene,
  FocusLocation
} from 'src/shared/types/focus-object/focusObjectTypes';

export const getBrowserActiveGenomeId = (state: RootState) =>
  state.browser.browserGeneral.activeGenomeId;

export const getBrowserActiveGenome = (state: RootState) => {
  const allGenomes = getGenomes(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? allGenomes[activeGenomeId] : null;
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

// TODO: Seems redundant since we don't use ChromosomeNavigator anywhere now. Should we remove this?
export const getDefaultChrLocation = (state: RootState) => {
  const activeFocusObjectId = getBrowserActiveFocusObjectId(state);
  const activeFocusObject =
    activeFocusObjectId && getFocusObjectById(state, activeFocusObjectId);
  if (!activeFocusObject) {
    return null;
  }
  // TODO: Type assertion is a temporary fix as FocusVariant doesn't have location. Remove if there is a better fix or get rid of the whole function (check comment above).
  const { chromosome, start, end } = (
    activeFocusObject as FocusGene | FocusLocation
  ).location;

  return [chromosome, start, end] as ChrLocation;
};

export const getRegionEditorActive = (state: RootState) =>
  state.browser.browserGeneral.regionEditorActive;

export const getRegionFieldActive = (state: RootState) =>
  state.browser.browserGeneral.regionFieldActive;
