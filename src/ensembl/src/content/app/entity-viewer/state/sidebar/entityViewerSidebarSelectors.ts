import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from '../general/entityViewerGeneralSelectors';

import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';
import { EntityViewerSidebarUIState } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

export const getEntityViewerGenomeUIState = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return activeGenomeId
    ? (state.entityViewer.sidebar[
        activeGenomeId
      ] as EntityViewerSidebarUIState) || null
    : null;
};

export const getEntityViewerSidebarPayload = (state: RootState) => {
  const activeEntityId = getEntityViewerActiveEnsObjectId(state);
  return activeEntityId
    ? getEntityViewerGenomeUIState(state)?.entities[activeEntityId] || null
    : null;
};

export const getEntityViewerSidebarTabName = (state: RootState) => {
  const activeEntityId = getEntityViewerActiveEnsObjectId(state);
  return activeEntityId
    ? getEntityViewerGenomeUIState(state)?.selectedTabName || null
    : null;
};

export const isEntityViewerSidebarOpen = (state: RootState): boolean => {
  const activeEntityId = getEntityViewerActiveEnsObjectId(state);
  return activeEntityId
    ? getEntityViewerGenomeUIState(state)?.status === Status.OPEN
    : false;
};
