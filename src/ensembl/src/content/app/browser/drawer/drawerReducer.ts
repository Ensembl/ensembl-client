import { ActionType, getType } from 'typesafe-actions';

import { DrawerState, defaultDrawerState } from './drawerState';
import * as drawerActions from './drawerActions';

export default function drawer(
  state: DrawerState = defaultDrawerState,
  action: ActionType<typeof drawerActions>
): DrawerState {
  switch (action.type) {
    case getType(drawerActions.changeDrawerView):
      return {
        ...state,
        drawerView: action.payload
      };
    case getType(drawerActions.toggleDrawer):
      return {
        ...state,
        drawerOpened: action.payload,
        drawerView: action.payload ? state.drawerView : ''
      };
    default:
      return state;
  }
}
