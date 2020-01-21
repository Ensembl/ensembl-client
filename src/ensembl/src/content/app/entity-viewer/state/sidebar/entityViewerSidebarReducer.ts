import { ActionType, getType } from 'typesafe-actions';

import * as generalActions from '../general/entityViewerGeneralActions';
import * as actions from './entityViewerSidebarActions';

import {
  initialState,
  buildInitialStateForGenome,
  EntityViewerSidebarState
} from './entityViewerSidebarState';

// type EntityViewerSidebarReducer = (
//   state: EntityViewerSidebarState,
//   action: ActionType<typeof actions | typeof generalActions>
// ) => EntityViewerSidebarState;
// const entityViewerSidebarReducer: EntityViewerSidebarReducer = (

export default function entityViewerSidebarReducer(
  state: EntityViewerSidebarState = initialState,
  action: ActionType<typeof actions | typeof generalActions>
) {
  switch (action.type) {
    case getType(generalActions.setActiveGenomeId):
      return state[action.payload]
        ? state
        : {
            ...state,
            ...buildInitialStateForGenome(action.payload)
          };
    case getType(actions.updateSidebar): {
      const oldStateFragment = state[action.payload.genomeId];
      const newStateFragment = { ...oldStateFragment, ...action.payload.data };
      return {
        ...state,
        [action.payload.genomeId]: newStateFragment
      };
    }
    default:
      return state;
  }
}
