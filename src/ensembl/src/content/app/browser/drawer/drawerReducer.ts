import { ActionType, getType } from 'typesafe-actions';

import { DrawerState, defaultDrawerState } from './drawerState';
import * as drawerActions from './drawerActions';

export default function drawer(
  state: DrawerState = defaultDrawerState,
  action: ActionType<typeof drawerActions>
): DrawerState {
  switch (action.type) {
    case getType(drawerActions.changeDrawerViewForGenome):
      return {
        ...state,
        drawerView: { ...state.drawerView, ...action.payload }
      };
    case getType(drawerActions.toggleDrawerForGenome):
      return {
        ...state,
        isDrawerOpened: { ...state.isDrawerOpened, ...action.payload }
      };
    default:
      return state;
  }
}
