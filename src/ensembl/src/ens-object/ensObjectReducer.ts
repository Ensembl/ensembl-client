import { ActionType, getType } from 'typesafe-actions';

import * as ensObjectActions from './ensObjectActions';
import { EnsObjectsState, defaultEnsObjectsState } from './ensObjectState';

import { LoadingState } from 'src/shared/types/loading-state';
import { EnsObject } from './ensObjectTypes';

const buildLoadingObject = (id: string) => ({
  [id]: {
    loadingStatus: LoadingState.LOADING,
    data: null
  }
});

const buildLoadedObject = (payload: { id: string; data: EnsObject }) => ({
  [payload.id]: {
    data: payload.data,
    loadingStatus: LoadingState.SUCCESS
  }
});

export default function ensObjectsReducer(
  state: EnsObjectsState = defaultEnsObjectsState,
  action: ActionType<typeof ensObjectActions>
) {
  switch (action.type) {
    case getType(ensObjectActions.fetchEnsObjectAsyncActions.request):
      return {
        ...state,
        ...buildLoadingObject(action.payload)
      };

    case getType(ensObjectActions.fetchEnsObjectAsyncActions.success):
      return {
        ...state,
        ...buildLoadedObject(action.payload)
      };

    default:
      return state;
  }
}
