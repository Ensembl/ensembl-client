import { getEntityViewerActiveGenomeId } from '../general/entityViewerGeneralSelectors';

import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';

export const getEntityViewerSidebarTabName = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return activeGenomeId
    ? state.entityViewer.sidebar[activeGenomeId].selectedTabName
    : null;
};

export const isEntityViewerSidebarOpen = (state: RootState): boolean => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return activeGenomeId
    ? state.entityViewer.sidebar[activeGenomeId].status === Status.OPEN
    : false;
};
