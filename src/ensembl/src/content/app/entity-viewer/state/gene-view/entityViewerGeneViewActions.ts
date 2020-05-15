import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { batch } from 'react-redux';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import {
  EntityViewerGeneViewUIState,
  GeneViewTabName,
  GeneFunctionTabName,
  GeneRelationshipsTabName
} from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneViewState';

import { RootState } from 'src/store';

export const updateActiveGeneViewUIState = createAction(
  'entity-viewer/update-active-gene-view-object-state'
)<{
  activeGenomeId: string;
  activeObjectId: string;
  fragment: Partial<EntityViewerGeneViewUIState>;
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
    updateActiveGeneViewUIState({
      activeGenomeId,
      activeObjectId,
      fragment: {
        selectedGeneTabName: selectedTabName
      }
    })
  );
};

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

  if (activeGenomeId && activeObjectId) {
    dispatch(
      updateActiveGeneViewUIState({
        activeGenomeId,
        activeObjectId,
        fragment: {
          geneFunction: {
            selectedTabName
          }
        }
      })
    );
  }
};

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

  if (activeGenomeId && activeObjectId) {
    dispatch(
      updateActiveGeneViewUIState({
        activeGenomeId,
        activeObjectId,
        fragment: {
          geneRelationships: {
            selectedTabName
          }
        }
      })
    );
  }
};

export const setGeneViewMode: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (view: string) => (dispatch) => {
  const geneFunctionViews: { [key: string]: string } = {
    protein: GeneFunctionTabName.PROTEINS,
    variants: GeneFunctionTabName.VARIANTS
  };
  const geneRelationshipsViews: { [key: string]: string } = {
    orthologues: GeneRelationshipsTabName.ORTHOLOGUES
  };

  if (geneFunctionViews[view]) {
    batch(() => {
      dispatch(setActiveGeneTab(GeneViewTabName.GENE_FUNCTION));
      dispatch(setActiveGeneFunctionTab(geneFunctionViews[view]));
    });
  } else if (geneRelationshipsViews[view]) {
    batch(() => {
      dispatch(setActiveGeneTab(GeneViewTabName.GENE_RELATIONSHIPS));
      dispatch(setActiveGeneRelationshipsTab(geneRelationshipsViews[view]));
    });
  }
};
