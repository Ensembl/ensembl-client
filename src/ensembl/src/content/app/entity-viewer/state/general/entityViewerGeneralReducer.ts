import { ActionType, getType } from 'typesafe-actions';

import {
  initialState,
  EntityViewerGeneralState
} from './entityViewerGeneralState';
import * as actions from './entityViewerGeneralActions';

export default function entityViewerReducer(
  state: EntityViewerGeneralState = initialState,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.setActiveGenomeId): {
      return {
        ...state,
        activeGenomeId: action.payload
      };
    }
    case getType(actions.updateEntityViewerActiveEnsObjectIds):
      return { ...state, activeEnsObjectIds: action.payload };
    default:
      return state;
  }
}
