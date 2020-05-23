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
import { getEnsObjectById } from 'src/shared/state/ens-object/ensObjectSelectors';

export const getEntityViewerActiveGenomeId = (state: RootState) =>
  state.entityViewer.general.activeGenomeId;

export const getEntityViewerActiveEnsObjectIds = (state: RootState) =>
  state.entityViewer.general.activeEnsObjectIds;

export const getEntityViewerActiveEnsObjectId = (state: RootState) => {
  const activeEnsObjectIds = getEntityViewerActiveEnsObjectIds(state);
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return activeGenomeId ? activeEnsObjectIds[activeGenomeId] : null;
};

export const getEntityViewerActiveEnsObject = (state: RootState) => {
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);
  if (!activeObjectId) {
    return null;
  }
  return getEnsObjectById(state, activeObjectId);
};
