import { RootState } from 'src/store';
import { getEnsObjectById } from 'src/shared/state/ens-object/ensObjectSelectors';

import { getQueryParamsMap } from 'src/global/globalHelper';

export const getEntityViewerActiveGenomeId = (state: RootState) =>
  state.entityViewer.general.activeGenomeId;

export const getEntityViewerActiveEnsObjectIds = (state: RootState) =>
  state.entityViewer.general.activeEnsObjectIds;

export const getEntityViewerActiveEnsObjectId = (state: RootState) => {
  const activeEnsObjectIds = getEntityViewerActiveEnsObjectIds(state);
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  return activeGenomeId ? activeEnsObjectIds[activeGenomeId] : null;
};

export const getEntityViewerActiveEnsObject = (state: RootState) => {
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);
  if (!activeObjectId) {
    return null;
  }
  return getEnsObjectById(state, activeObjectId);
};

export const getEntityViewerQueryParams = (
  state: RootState
): { [key: string]: string } => getQueryParamsMap(state.router.location.search);
