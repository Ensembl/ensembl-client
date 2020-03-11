import { createAction } from 'typesafe-actions';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';
import { getEntityViewerActiveGenomeConfiguration } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneSelectors';
import { EntityViewerGeneObjectState } from 'src/content/app/entity-viewer/state/gene-view/entityViewerGeneState';

import { RootState } from 'src/store';

export const updateActiveGeneObjectState = createAction(
  'entity-viewer/update-state-for-active-genome',
  (payload: {
    activeGenomeId: string;
    activeObjectId: string;
    data: EntityViewerGeneObjectState;
  }) => {
    const { activeGenomeId, activeObjectId, data } = payload;
    return { activeGenomeId, activeObjectId, data: cloneDeep(data) };
  }
)();

export const setActiveGeneTab: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (selectedTab: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(getState());
  const activeObjectId = getEntityViewerActiveEnsObjectId(getState());

  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  dispatch(
    updateActiveGeneObjectState({
      activeGenomeId,
      activeObjectId,
      data: set(
        getEntityViewerActiveGenomeConfiguration(getState()),
        'selectedGeneTab',
        selectedTab
      )
    })
  );
};

export const setActiveGeneFunctionTab: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (selectedTab: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(getState());
  const activeObjectId = getEntityViewerActiveEnsObjectId(getState());

  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  dispatch(
    updateActiveGeneObjectState({
      activeGenomeId,
      activeObjectId,
      data: set(
        getEntityViewerActiveGenomeConfiguration(getState()),
        'geneFunction.selectedTab',
        selectedTab
      )
    })
  );
};

export const setActiveGeneRelationshipsTab: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (selectedTab: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getEntityViewerActiveGenomeId(getState());
  const activeObjectId = getEntityViewerActiveEnsObjectId(getState());

  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  dispatch(
    updateActiveGeneObjectState({
      activeGenomeId,
      activeObjectId,
      data: set(
        getEntityViewerActiveGenomeConfiguration(getState()),
        'geneRelationships.selectedTab',
        selectedTab
      )
    })
  );
};
