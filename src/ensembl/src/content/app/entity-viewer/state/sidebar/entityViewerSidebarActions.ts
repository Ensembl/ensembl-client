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

import { createAction } from 'typesafe-actions';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from '../general/entityViewerGeneralSelectors';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import {
  EntityViewerSidebarGenomeState,
  SidebarTabName,
  ToggleStatus,
  EntityViewerSidebarUIState,
  SidebarModalView
} from './entityViewerSidebarState';
import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';

export const updateGenomeState = createAction(
  'entity-viewer-sidebar/update-genome-ui-state'
)<{ genomeId: string; fragment: Partial<EntityViewerSidebarGenomeState> }>();

export const setSidebarTabName = (
  tabName: SidebarTabName
): ThunkAction<void, any, null, Action<string>> => (
  dispatch,
  getState: () => RootState
) => {
  const genomeId = getEntityViewerActiveGenomeId(getState());

  if (!genomeId) {
    return;
  }

  dispatch(
    updateGenomeState({
      genomeId,
      fragment: { selectedTabName: tabName }
    })
  );
};

export const toggleSidebar = (
  status?: ToggleStatus
): ThunkAction<void, any, null, Action<string>> => (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();

  const genomeId = getEntityViewerActiveGenomeId(state);

  if (!genomeId) {
    return;
  }

  if (status === undefined) {
    const isCurrentlyOpen = isEntityViewerSidebarOpen(state);
    status = isCurrentlyOpen ? Status.CLOSED : Status.OPEN;
  }

  dispatch(updateGenomeState({ genomeId, fragment: { status } }));
};

export const openSidebar = () => toggleSidebar(Status.OPEN);

export const closeSidebar = () => toggleSidebar(Status.CLOSED);

export const updateEntityUIState = createAction(
  'entity-viewer-sidebar/update-entity-ui-state'
)<{
  genomeId: string;
  entityId: string;
  fragment: Partial<EntityViewerSidebarUIState>;
}>();

export const updateEntityUI = (
  fragment: Partial<EntityViewerSidebarUIState>
): ThunkAction<void, any, null, Action<string>> => (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();
  const genomeId = getEntityViewerActiveGenomeId(state);
  const entityId = getEntityViewerActiveEntityId(state);

  if (!genomeId || !entityId) {
    return;
  }

  dispatch(updateEntityUIState({ genomeId, entityId, fragment }));
};

export const openSidebarModal = (
  sidebarModalView: SidebarModalView
): ThunkAction<void, any, null, Action<string>> => (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();

  const genomeId = getEntityViewerActiveGenomeId(state);
  if (!genomeId) {
    return;
  }

  dispatch(
    updateGenomeState({
      genomeId,
      fragment: {
        sidebarModalView
      }
    })
  );
};

export const closeSidebarModal = (): ThunkAction<
  void,
  any,
  null,
  Action<string>
> => (dispatch, getState: () => RootState) => {
  const state = getState();
  const genomeId = getEntityViewerActiveGenomeId(state);

  if (!genomeId) {
    return;
  }

  dispatch(
    updateGenomeState({
      genomeId,
      fragment: {
        sidebarModalView: null
      }
    })
  );
};
