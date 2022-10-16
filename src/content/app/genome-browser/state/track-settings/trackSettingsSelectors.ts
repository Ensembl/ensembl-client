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

import type {
  TrackSettingsForGenome,
  TrackSettings
} from './trackSettingsSlice';
import type { RootState } from 'src/store';

export const getTrackSettingsForTrackId = (
  state: RootState,
  trackId: string
): TrackSettings | null => {
  const allTrackSettingsForGenome = getAllTrackSettings(state);
  return (
    allTrackSettingsForGenome?.settingsForIndividualTracks[trackId] ?? null
  );
};

// FIXME: rename to getAllTrackSettingsForGenome; probably reguire genome id, or rename to getAllTrackSettingsForActiveGenome
export const getAllTrackSettings = (
  state: RootState
): TrackSettingsForGenome | null => {
  const genomeId = getBrowserActiveGenomeId(state) ?? '';
  return state.browser.trackSettings[genomeId] ?? null;
};

export const getAllTrackSettingsForGenome = (
  state: RootState,
  genomeId: string
): TrackSettingsForGenome | null => {
  return state.browser.trackSettings[genomeId] ?? null;
};

export const getApplyToAllSettings = (state: RootState) => {
  const allTrackSettingsForGenome = getAllTrackSettings(state);
  return (
    allTrackSettingsForGenome?.settingsForAllTracks.shouldApplyToAll ?? false
  );
};
