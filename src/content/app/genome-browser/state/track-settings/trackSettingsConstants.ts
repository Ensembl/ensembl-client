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

import type {
  GeneTrackSettings,
  RegularTrackSettings,
  GeneTrack,
  FocusGeneTrack,
  RegularTrack,
  TrackSettings
} from './trackSettingsSlice';

import { Status } from 'src/shared/types/status';

export enum TrackType {
  GENE = 'gene',
  FOCUS_GENE = 'gene-focus',
  REGULAR = 'regular'
}

export const getDefaultGeneTrackSettings = (): GeneTrackSettings => ({
  showSeveralTranscripts: false,
  showTranscriptIds: false,
  showTrackName: false,
  showFeatureLabels: true
});

export const getDefaultRegularTrackSettings = (): RegularTrackSettings => ({
  showTrackName: false
});

export const buildDefaultGeneTrack = (trackId: string): GeneTrack => ({
  id: trackId,
  trackType: TrackType.GENE,
  status: Status.SELECTED,
  settings: getDefaultGeneTrackSettings()
});

export const buildDefaultFocusGeneTrack = (
  trackId: string
): FocusGeneTrack => ({
  id: trackId,
  trackType: TrackType.FOCUS_GENE,
  settings: getDefaultGeneTrackSettings()
});

export const buildDefaultRegularTrack = (trackId: string): RegularTrack => ({
  id: trackId,
  trackType: TrackType.REGULAR,
  status: Status.SELECTED,
  settings: getDefaultGeneTrackSettings()
});

export const isGeneTrack = (
  trackSettings: TrackSettings
): trackSettings is GeneTrack | FocusGeneTrack => {
  return [TrackType.GENE, TrackType.FOCUS_GENE].includes(
    trackSettings.trackType
  );
};
