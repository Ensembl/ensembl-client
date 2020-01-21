import { ActionType, getType } from 'typesafe-actions';

import * as actions from './entityViewerSidebarActions';

import {
  initialState,
  EntityViewerSidebarState
} from './entityViewerSidebarState';

export default function entityViewerSidebarReducer(
  state: EntityViewerSidebarState = initialState,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
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
