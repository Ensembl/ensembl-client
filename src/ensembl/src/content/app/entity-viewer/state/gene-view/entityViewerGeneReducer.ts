import { ActionType, getType } from 'typesafe-actions';

import {
  defaultEntityViewerGeneObjectStates,
  initialEntityViewerGeneState,
  EntityViewerGeneState,
  EntityViewerGeneObjectStates
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
        [action.payload.activeGenomeId]: activeGeneObjectStates(
          state[action.payload.activeGenomeId],
          action
        )
      };
    default:
      return state;
  }
}

function activeGeneObjectStates(
  state: EntityViewerGeneObjectStates = defaultEntityViewerGeneObjectStates,
  action: ActionType<typeof actions>
): EntityViewerGeneObjectStates {
  switch (action.type) {
    case getType(actions.updateActiveGeneObjectState):
      return {
        ...state,
        [action.payload.activeObjectId]: action.payload.data
      } as EntityViewerGeneObjectStates;
    default:
      return state;
  }
}
