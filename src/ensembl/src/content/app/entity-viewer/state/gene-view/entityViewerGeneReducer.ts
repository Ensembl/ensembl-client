import { ActionType, getType } from 'typesafe-actions';

import {
  initialEntityViewerGeneState,
  EntityViewerGeneState,
  EntityViewerGeneObjectState
} from './entityViewerGeneState';
import * as actions from './entityViewerGeneActions';

export default function entityViewerGeneReducer(
  state: EntityViewerGeneState = initialEntityViewerGeneState,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.updateActiveGeneObjectState):
      return {
        ...state,
        [action.payload.activeGenomeId]: entityViewerGeneObjectReducer(
          state[action.payload.activeGenomeId],
          action
        )
      };
    default:
      return state;
  }
}

function entityViewerGeneObjectReducer(
  state: { [activeObjectId: string]: EntityViewerGeneObjectState } = {},
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.updateActiveGeneObjectState):
      return {
        ...state,
        [action.payload.activeObjectId]: action.payload.data
      };
    default:
      return state;
  }
}
