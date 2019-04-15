import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as customDownloadActions from './customDownloadActions';
import {
  CustomDownloadState,
  defaultCustomDownloadState
} from './customDownloadState';

function preFilterPanel(
  state: CustomDownloadState = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.updateSelectedPreFilter):
      return { ...state, selectedPreFilter: action.payload };
    case getType(customDownloadActions.togglePreFiltersPanel):
      return { ...state, showPreFiltersPanel: action.payload };
    default:
      return state;
  }
}

function contentPanel(
  state: CustomDownloadState = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.toggleTabButton):
      return { ...state, selectedTabButton: action.payload };
    case getType(customDownloadActions.setAttributes):
      return { ...state, attributes: action.payload };
    default:
      return state;
  }
}

export default combineReducers({
  preFilterPanel,
  contentPanel
});
