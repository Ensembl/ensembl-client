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

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import { RootState } from 'src/store';

export const isSpeciesSidebarOpen = (state: RootState) => {
  const activeGenomeId = getActiveGenomeId(state);

  if (!activeGenomeId) {
    return false;
  }
  return state.speciesPage.sidebar[activeGenomeId]?.isSidebarOpen ?? true;
};

export const getIsSpeciesSidebarModalOpened = (state: RootState) =>
  Boolean(getSpeciesSidebarModalView(state));

export const getSpeciesSidebarModalView = (state: RootState) => {
  const activeGenomeId = getActiveGenomeId(state);
  return activeGenomeId
    ? state.speciesPage.sidebar[activeGenomeId]?.sidebarModalView
    : null;
};
