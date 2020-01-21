import { ActionType, getType } from 'typesafe-actions';

import { initialState, EntityViewerState } from './entityViewerState';
import * as entityViewerActions from './entityViewerActions';

export default function entityViewerReducer(
  state: EntityViewerState = initialState,
  action: ActionType<typeof entityViewerActions>
) {
  switch (action.type) {
    case getType(entityViewerActions.setActiveGenomeId): {
      return {
        ...state,
        activeGenomeId: action.payload
      };
    }
    default:
      return state;
  }
}
