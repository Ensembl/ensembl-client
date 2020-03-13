import { ActionType, getType } from 'typesafe-actions';

import {
  initialEntityViewerGeneViewState,
  EntityViewerGeneViewState,
  EntityViewerGeneViewObjectState
} from './entityViewerGeneViewState';
import * as actions from './entityViewerGeneViewActions';

export default function entityViewerGeneReducer(
  state: EntityViewerGeneViewState = initialEntityViewerGeneViewState,
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
  state: { [activeObjectId: string]: EntityViewerGeneViewObjectState } = {},
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
