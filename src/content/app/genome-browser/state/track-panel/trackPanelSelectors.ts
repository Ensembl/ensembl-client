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

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { defaultTrackPanelStateForGenome } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

import { RootState } from 'src/store';

export const getActiveTrackPanel = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const activeTrackPanel =
    activeGenomeId && state.browser.trackPanel[activeGenomeId];

  return activeTrackPanel || defaultTrackPanelStateForGenome;
};

export const getSelectedTrackPanelTab = (state: RootState) =>
  getActiveTrackPanel(state).selectedTrackPanelTab;

export const getIsTrackPanelOpened = (state: RootState) =>
  getActiveTrackPanel(state).isTrackPanelOpened;
