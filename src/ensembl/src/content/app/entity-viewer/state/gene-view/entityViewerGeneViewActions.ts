import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import {
  EntityViewerGeneViewUIStateState,
  GeneViewTabName,
  GeneFunctionTabName,
  GeneRelationshipsTabName,
  EntityViewerGeneFunctionState,
  EntityViewerGeneRelationshipsState
} from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';

import { RootState } from 'src/store';

export const updateActiveGeneViewObjectState = createAction(
  'entity-viewer/update-active-gene-view-object-state'
)<{
  activeGenomeId: string;
  activeObjectId: string;
  fragment: Partial<EntityViewerGeneViewUIStateState>;
}>();

export const setActiveGeneTab: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (selectedTabName: GeneViewTabName) => (
  dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(getState());
  const activeObjectId = getEntityViewerActiveEnsObjectId(getState());

  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  dispatch(
    updateActiveGeneViewObjectState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        selectedGeneTabName: selectedTabName
      }
    })
  );
};

export const updateActiveGeneViewObjectGeneFunctionState = createAction(
  'entity-viewer/update-active-gene-view-object-gene-function-state'
)<{
  activeGenomeId: string;
  activeObjectId: string;
  fragment: Partial<EntityViewerGeneFunctionState>;
}>();

export const setActiveGeneFunctionTab: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (selectedTabName: GeneFunctionTabName) => (
  dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(getState());
  const activeObjectId = getEntityViewerActiveEnsObjectId(getState());

  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  dispatch(
    updateActiveGeneViewObjectState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        geneFunction: {
          selectedTabName
        }
      }
    })
  );
};

export const updateActiveGeneViewObjectGeneRelationshipsState = createAction(
  'entity-viewer/update-active-gene-view-object-gene-relationships-state'
)<{
  activeGenomeId: string;
  activeObjectId: string;
  fragment: Partial<EntityViewerGeneRelationshipsState>;
}>();

export const setActiveGeneRelationshipsTab: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (selectedTabName: GeneRelationshipsTabName) => (
  dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(getState());
  const activeObjectId = getEntityViewerActiveEnsObjectId(getState());

  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  dispatch(
    updateActiveGeneViewObjectState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        geneRelationships: {
          selectedTabName
        }
      }
    })
  );
};
