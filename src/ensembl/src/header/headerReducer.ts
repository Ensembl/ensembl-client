import { ActionType, getType } from 'typesafe-actions';

import * as header from './headerActions';

import { HeaderState, defaultState } from './headerState';

export default (
  state: HeaderState = defaultState,
  action: ActionType<typeof header>
): HeaderState => {
  switch (action.type) {
    case getType(header.toggleAccount):
      return { ...state, accountExpanded: !state.accountExpanded };
    case getType(header.toggleLaunchbar):
      return { ...state, launchbarExpanded: !state.launchbarExpanded };
    default:
      return state;
  }
};
