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

import { getBrowserActiveGenomeId } from '../browser-general/browserGeneralSelectors';
import { defaultTrackSettingsForGenome } from './trackSettingsSlice';

import type { RootState } from 'src/store';

export const getBrowserCogList = (state: RootState) => {
  return state.browser.trackSettings.browserTrackCogs.cogList;
};

export const getBrowserSelectedCog = (state: RootState) => {
  return state.browser.trackSettings.browserTrackCogs.selectedCog;
};

export const getTrackSettingsForTrackId = (
  state: RootState,
  trackId: string
) => {
  const genomeId = getBrowserActiveGenomeId(state);
  if (!genomeId || !state.browser.trackSettings.settings[genomeId]) {
    return null;
  }
  return state.browser.trackSettings.settings[genomeId].tracks[trackId];
};

export const getAllTrackSettings = (state: RootState) => {
  const genomeId = getBrowserActiveGenomeId(state);
  if (!genomeId || !state.browser.trackSettings.settings[genomeId]) {
    return null;
  }
  return state.browser.trackSettings.settings[genomeId];
};

export const getApplyToAllSettings = (state: RootState) => {
  const genomeId = getBrowserActiveGenomeId(state);
  if (!genomeId || !state.browser.trackSettings.settings[genomeId]) {
    return defaultTrackSettingsForGenome.shouldApplyToAll;
  }
  return (
    state.browser.trackSettings.settings[genomeId]?.shouldApplyToAll ?? false
  );
};
