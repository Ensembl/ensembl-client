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

import { TrackSet } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import pick from 'lodash/pick';

export type PreviouslyViewedObject = {
  genome_id: string;
  object_id: string;
  object_type: string;
  label: string;
};

export type PreviouslyViewedObjects = {
  [genomeId: string]: PreviouslyViewedObject[];
};

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
  trackPanelModalView: string;
  bookmarks: PreviouslyViewedObject[];
  previouslyViewedObjects: PreviouslyViewedObject[];
  highlightedTrackId: string;
  collapsedTrackIds: string[];
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  isTrackPanelModalOpened: false,
  bookmarks: [],
  previouslyViewedObjects: [],
  selectedTrackPanelTab: TrackSet.GENOMIC,
  trackPanelModalView: '',
  highlightedTrackId: '',
  isTrackPanelOpened: true,
  collapsedTrackIds: []
};

export const getInitialTrackPanelState = (): TrackPanelState => {
  const genomeId = browserStorageService.getActiveGenomeId();
  return genomeId ? { [genomeId]: getTrackPanelStateForGenome(genomeId) } : {};
};

export const getTrackPanelStateForGenome = (
  genomeId: string
): TrackPanelStateForGenome => {
  const storedTrackPanel =
    browserStorageService.getTrackPanels()[genomeId] || {};
  return {
    ...defaultTrackPanelStateForGenome,
    ...storedTrackPanel
  };
};

export const pickPersistentTrackPanelProperties = (
  trackPanel: Partial<TrackPanelStateForGenome>
) => {
  const persistentProperties = [
    'selectedTrackPanelTab',
    'collapsedTrackIds',
    'previouslyViewedObjects'
  ];
  return pick(trackPanel, persistentProperties);
};
