import { ActionType, getType } from 'typesafe-actions';

import * as ensObjectActions from './ensObjectActions';
import { EnsObjectsState, defaultEnsObjectsState } from './ensObjectState';

export default function ensObjectsReducer(
  state: EnsObjectsState = defaultEnsObjectsState,
  action: ActionType<typeof ensObjectActions>
) {
  switch (action.type) {
    case getType(ensObjectActions.fetchEnsObjectAsyncActions.success):
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
