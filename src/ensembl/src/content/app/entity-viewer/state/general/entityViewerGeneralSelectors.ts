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

export const getEntityViewerActiveGenomeId = (state: RootState) =>
  state.entityViewer.general.activeGenomeId;

export const getEntityViewerActiveEntityIds = (state: RootState) =>
  state.entityViewer.general.activeEntityIds;

export const getEntityViewerActiveEntityId = (state: RootState) => {
  const activeEntityIds = getEntityViewerActiveEntityIds(state);
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return activeGenomeId ? activeEntityIds[activeGenomeId] : null;
};
