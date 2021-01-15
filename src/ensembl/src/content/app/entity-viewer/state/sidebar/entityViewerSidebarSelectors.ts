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
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from '../general/entityViewerGeneralSelectors';

import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';
import { EntityViewerSidebarGenomeState } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

export const getEntityViewerGenomeState = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return activeGenomeId
    ? (state.entityViewer.sidebar[
        activeGenomeId
      ] as EntityViewerSidebarGenomeState) || null
    : null;
};

export const getEntityViewerSidebarUIState = (state: RootState) => {
  const activeEntityId = getEntityViewerActiveEnsObjectId(state);
  return activeEntityId
    ? getEntityViewerGenomeState(state)?.entities[activeEntityId]?.uIState ||
        null
    : null;
};

export const getEntityViewerSidebarTabName = (state: RootState) => {
  const activeEntityId = getEntityViewerActiveEnsObjectId(state);
  return activeEntityId
    ? getEntityViewerGenomeState(state)?.selectedTabName || null
    : null;
};

export const isEntityViewerSidebarOpen = (state: RootState): boolean => {
  const activeEntityId = getEntityViewerActiveEnsObjectId(state);
  return activeEntityId
    ? getEntityViewerGenomeState(state)?.status === Status.OPEN
    : false;
};

export const getActiveGenomeBookmarks = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return (activeGenomeId && getEntityViewerGenomeState(state)?.bookmarks) || [];
};

export const getActiveGenomePreviouslyViewedObjects = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return (
    (activeGenomeId && getEntityViewerGenomeState(state)?.previouslyViewedObjects) || []
  );
};

export const isEntityViewerSidebarModalOpen = (state: RootState) => getEntityViewerGenomeState(state)?.isSidebarModalOpened || false;
export const getEntityViewerSidebarModalView = (state: RootState) => getEntityViewerGenomeState(state)?.sidebarModalView || '';
