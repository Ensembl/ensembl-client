import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from '../general/entityViewerGeneralSelectors';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import {
  EntityViewerSidebarUIState,
  EntityViewerSidebarPayload,
  SidebarTabName,
  SidebarStatus
} from './entityViewerSidebarState';
import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';

import { entityViewerSidebarSampleData } from './sampleData';

export const updateGenomeUIState = createAction(
  'entity-viewer-sidebar/update-genome-ui-state'
)<{ genomeId: string; fragment: Partial<EntityViewerSidebarUIState> }>();

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
    updateGenomeUIState({
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
  dispatch(updateGenomeUIState({ genomeId, fragment: { status } }));
};

export const openSidebar = () => toggleSidebar(Status.OPEN);

export const closeSidebar = () => toggleSidebar(Status.CLOSED);

export const updateEntityUIState = createAction(
  'entity-viewer-sidebar/update-object-ui-state'
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

  dispatch(
    updateEntityUIState({ genomeId, entityId, fragment: sidebarPayload })
  );
};
