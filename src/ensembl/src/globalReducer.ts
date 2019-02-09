import { ActionType, getType } from 'typesafe-actions';

import * as global from './globalActions';
import { GlobalState, defaultState } from './globalState';

export default function globalReducer(
  state: GlobalState = defaultState,
  action: ActionType<typeof global>
) {
  switch (action.type) {
    case getType(global.updateBreakpointWidth):
      return { ...state, breakpointWidth: action.payload };
    default:
      return state;
  }
}
