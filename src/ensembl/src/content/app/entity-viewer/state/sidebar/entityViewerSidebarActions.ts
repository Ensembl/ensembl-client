import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { getEntityViewerActiveGenomeId } from '../general/entityViewerGeneralSelectors';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import {
  EntityViewerSidebarStateForGenome,
  SidebarTabName,
  SidebarStatus
} from './entityViewerSidebarState';
import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';

export const updateSidebar = createAction(
  'entity-viewer-sidebar/update-sidebar'
)<{ genomeId: string; fragment: Partial<EntityViewerSidebarStateForGenome> }>();

export const setSidebarTabName: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (tabName: SidebarTabName) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(getState());
  if (!activeGenomeId) {
    return;
  }
  dispatch(
    updateSidebar({
      genomeId: activeGenomeId,
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
  dispatch(updateSidebar({ genomeId, fragment: { status } }));
};

export const openSidebar = () => toggleSidebar(Status.OPEN);

export const closeSidebar = () => toggleSidebar(Status.CLOSED);
