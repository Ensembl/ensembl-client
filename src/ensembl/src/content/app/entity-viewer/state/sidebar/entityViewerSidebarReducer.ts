import { ActionType, getType } from 'typesafe-actions';

import * as generalActions from '../general/entityViewerGeneralActions';
import * as actions from './entityViewerSidebarActions';

import {
  initialState,
  buildInitialStateForGenome,
  EntityViewerSidebarState
} from './entityViewerSidebarState';

export default function entityViewerSidebarReducer(
  state: EntityViewerSidebarState = initialState,
  action: ActionType<typeof actions | typeof generalActions.setActiveGenomeId>
) {
  switch (action.type) {
    case getType(generalActions.setActiveGenomeId):
      return state[action.payload]
        ? state
        : {
            ...state,
            ...buildInitialStateForGenome(action.payload)
          };
    case getType(actions.setSidebarTabName): {
      return {
        ...state,
        activeTabName: action.payload
      };
    }
    default:
      return state;
  }
}
