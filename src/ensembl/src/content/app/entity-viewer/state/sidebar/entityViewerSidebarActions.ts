import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from '../general/entityViewerGeneralSelectors';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import {
  EntityViewerSidebarGenomeState,
  EntityViewerSidebarPayload,
  SidebarTabName,
  SidebarStatus
} from './entityViewerSidebarState';
import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';

import { entityViewerSidebarSampleData } from './sampleData';

export const updateGenomeState = createAction(
  'entity-viewer-sidebar/update-genome-ui-state'
)<{ genomeId: string; fragment: Partial<EntityViewerSidebarGenomeState> }>();

export const setSidebarTabName: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (tabName: SidebarTabName) => (dispatch, getState: () => RootState) => {
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

export const toggleSidebar: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (status?: SidebarStatus) => (dispatch, getState: () => RootState) => {
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

export const updateEntityState = createAction(
  'entity-viewer-sidebar/update-entity-state'
)<{
  genomeId: string;
  entityId: string;
  fragment: Partial<EntityViewerSidebarPayload>;
}>();

export const fetchSidebarPayload: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = () => (dispatch, getState: () => RootState) => {
  const state = getState();
  const genomeId = getEntityViewerActiveGenomeId(state);
  const entityId = getEntityViewerActiveEnsObjectId(state);

  if (!genomeId || !entityId) {
    return;
  }

  const sidebarPayload =
    entityViewerSidebarSampleData[genomeId].entities[entityId] || null;

  dispatch(updateEntityState({ genomeId, entityId, fragment: sidebarPayload }));
};

export const updateEntityUIState = createAction(
  'entity-viewer-sidebar/update-entity-ui-state'
)<{
  genomeId: string;
  entityId: string;
  fragment: Partial<EntityViewerSidebarPayload>;
}>();
