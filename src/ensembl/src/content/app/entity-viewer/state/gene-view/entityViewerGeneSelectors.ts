import { RootState } from 'src/store';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { defaultEntityViewerGeneObjectState } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneState';

export const getEntityViewerActiveGenomeConfiguration = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);

  if (!activeGenomeId || !activeObjectId) {
    return defaultEntityViewerGeneObjectState;
  }
  return (
    state.entityViewer.gene?.[activeGenomeId]?.[activeObjectId] ||
    defaultEntityViewerGeneObjectState
  );
};

export const getEntityViewerActiveGeneTab = (state: RootState) =>
  getEntityViewerActiveGenomeConfiguration(state).selectedGeneTab;

export const getEntityViewerActiveGeneFunction = (state: RootState) =>
  getEntityViewerActiveGenomeConfiguration(state).geneFunction ||
  defaultEntityViewerGeneObjectState.geneFunction;

export const getEntityViewerActiveGeneRelationships = (state: RootState) =>
  getEntityViewerActiveGenomeConfiguration(state).geneRelationships ||
  defaultEntityViewerGeneObjectState.geneRelationships;
