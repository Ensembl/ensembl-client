import { ActionType, getType } from 'typesafe-actions';

import * as headerActions from './headerActions';

import { HeaderState, defaultState } from './headerState';

export default (
  state: HeaderState = defaultState,
  action: ActionType<typeof headerActions>
): HeaderState => {
  switch (action.type) {
    case getType(headerActions.toggleAccount):
      return { ...state, accountExpanded: !state.accountExpanded };
    case getType(headerActions.toggleLaunchbar):
      return { ...state, launchbarExpanded: !state.launchbarExpanded };
    case getType(headerActions.changeCurrentApp):
      return { ...state, currentApp: action.payload };
    default:
      return state;
  }
};
