import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as browserActions from './customDownloadActions';
import * as drawerActions from './drawer/drawerActions';
import * as trackPanelActions from './track-panel/trackPanelActions';
import {
  CustomDownloadState,
  defaultCustomDownloadState
} from './customDownloadState';

function preFilter(
  state: CustomDownloadState = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(browserActions.updateBrowserActivated):
      return { ...state, browserActivated: action.payload };
    case getType(trackPanelActions.toggleTrackPanel):
      return {
        ...state,
        browserOpenState: action.payload
          ? BrowserOpenState.SEMI_EXPANDED
          : BrowserOpenState.EXPANDED
      };
    case getType(drawerActions.toggleDrawer):
      return {
        ...state,
        browserOpenState: action.payload
          ? BrowserOpenState.COLLAPSED
          : BrowserOpenState.SEMI_EXPANDED
      };
    default:
      return state;
  }
}

export default combineReducers({
  preFilter
});
