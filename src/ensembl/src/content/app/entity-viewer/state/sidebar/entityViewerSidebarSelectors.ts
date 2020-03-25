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

export const getEntityViewerSidebarPayload = (state: RootState) => {
  const activeEntityId = getEntityViewerActiveEnsObjectId(state);
  return activeEntityId
    ? getEntityViewerGenomeState(state)?.entities[activeEntityId].payload ||
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
