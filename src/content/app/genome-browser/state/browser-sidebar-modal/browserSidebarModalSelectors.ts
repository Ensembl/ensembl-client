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
import { defaultBrowserSidebarModalStateForGenome } from './browserSidebarModalSlice';

import type { RootState } from 'src/store';

export const getActiveBrowserSidebarModal = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const activeBrowserSidebarModal =
    activeGenomeId && state.browser.browserSidebarModal[activeGenomeId];

  return activeBrowserSidebarModal || defaultBrowserSidebarModalStateForGenome;
};

export const getIsBrowserSidebarModalOpened = (state: RootState) =>
  Boolean(getActiveBrowserSidebarModal(state).browserSidebarModalView);

export const getBrowserSidebarModalView = (state: RootState) =>
  getActiveBrowserSidebarModal(state).browserSidebarModalView;
