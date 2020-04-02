import { RootState } from 'src/store';
import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { defaultEntityViewerGeneViewUIState } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';

export const getEntityViewerActiveGenomeConfiguration = (state: RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);

  if (!activeGenomeId || !activeObjectId) {
    return defaultEntityViewerGeneViewUIState;
  }
  return (
    state.entityViewer.geneView?.[activeGenomeId]?.[activeObjectId] ||
    defaultEntityViewerGeneViewUIState
  );
};

export const getEntityViewerActiveGeneTab = (state: RootState) =>
  getEntityViewerActiveGenomeConfiguration(state).selectedGeneTabName;

export const getEntityViewerActiveGeneFunction = (state: RootState) =>
  getEntityViewerActiveGenomeConfiguration(state).geneFunction ||
  defaultEntityViewerGeneViewUIState.geneFunction;

export const getEntityViewerActiveGeneRelationships = (state: RootState) =>
  getEntityViewerActiveGenomeConfiguration(state).geneRelationships ||
  defaultEntityViewerGeneViewUIState.geneRelationships;
