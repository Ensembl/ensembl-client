import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { getEntityViewerActiveGenomeId } from '../general/entityViewerGeneralSelectors';

import {
  EntityViewerSidebarStateForGenome,
  SidebarTabName
} from './entityViewerSidebarState';
import { RootState } from 'src/store';

export const updateSidebar = createAction(
  'entity-viewer-sidebar/update-sidebar'
)<{ genomeId: string; data: Partial<EntityViewerSidebarStateForGenome> }>();

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
      data: { activeTabName: tabName }
    })
  );
};
