import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as customDownloadActions from './customDownloadActions';
import {
  CustomDownloadState,
  defaultCustomDownloadState
} from './customDownloadState';

function preFilter(
  state: CustomDownloadState = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.updateSelectedPreFilters):
      return { ...state, preFilterStatuses: action.payload };
    default:
      return state;
  }
}

export default combineReducers({
  preFilter
});
