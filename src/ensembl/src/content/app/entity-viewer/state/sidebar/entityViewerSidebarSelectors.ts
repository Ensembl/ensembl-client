import { getEntityViewerActiveGenomeId } from '../general/entityViewerGeneralSelectors';

import { RootState } from 'src/store';

export const getEntityViewerSidebarTabName = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return activeGenomeId
    ? state.entityViewer.sidebar[activeGenomeId].activeTabName
    : null;
};
