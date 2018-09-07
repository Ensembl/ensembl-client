import { ActionType, getType } from 'typesafe-actions';

import * as header from '../actions/headerActions';

export type HeaderAction = ActionType<typeof header>;

export type HeaderState = Readonly<{
  accountExpanded: boolean;
  launchbarExpanded: boolean;
}>;

const defaultState: HeaderState = {
  accountExpanded: false,
  launchbarExpanded: true
};

export default (
  state: HeaderState = defaultState,
  action: HeaderAction
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
