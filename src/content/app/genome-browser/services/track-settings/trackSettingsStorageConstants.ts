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
  getDefaultGeneTrackSettings,
  getDefaultFocusGeneTrackSettings,
  getDefaultRegularTrackSettings
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

import { TrackType } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';

export const GB_TRACK_SETTINGS_STORE_NAME = 'genome-browser-track-settings';

// keep a list of which settings are allowed for which known types of tracks
export const trackSettingFieldsMap = new Map<string, Set<string>>();
trackSettingFieldsMap.set(
  TrackType.GENE,
  new Set(Object.keys(getDefaultGeneTrackSettings()))
);
trackSettingFieldsMap.set(
  TrackType.FOCUS_GENE,
  new Set(Object.keys(getDefaultFocusGeneTrackSettings()))
);
trackSettingFieldsMap.set(
  TrackType.REGULAR,
  new Set(Object.keys(getDefaultRegularTrackSettings()))
);
