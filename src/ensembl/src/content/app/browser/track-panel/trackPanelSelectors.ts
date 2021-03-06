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
import { getBrowserActiveGenomeId } from '../browserSelectors';
import { defaultTrackPanelStateForGenome } from './trackPanelState';

export const getActiveTrackPanel = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const activeTrackPanel =
    activeGenomeId && state.browser.trackPanel[activeGenomeId];

  return activeTrackPanel || defaultTrackPanelStateForGenome;
};

export const getIsTrackPanelModalOpened = (state: RootState) =>
  getActiveTrackPanel(state).isTrackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState) =>
  getActiveTrackPanel(state).trackPanelModalView;

export const getSelectedTrackPanelTab = (state: RootState) =>
  getActiveTrackPanel(state).selectedTrackPanelTab;

export const getIsTrackPanelOpened = (state: RootState) =>
  getActiveTrackPanel(state).isTrackPanelOpened;

export const getActiveGenomeBookmarks = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return (activeGenomeId && getActiveTrackPanel(state).bookmarks) || [];
};

export const getActiveGenomePreviouslyViewedObjects = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return (
    (activeGenomeId && getActiveTrackPanel(state).previouslyViewedObjects) || []
  );
};

export const getHighlightedTrackId = (state: RootState) =>
  getActiveTrackPanel(state).highlightedTrackId;

export const isTrackCollapsed = (state: RootState, trackId: string) => {
  const trackPanel = getActiveTrackPanel(state);
  return trackPanel.collapsedTrackIds.includes(trackId);
};
