import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as browserActions from './browserActions';
import {
  BrowserState,
  defaultBrowserState,
  trackPanelState,
  drawerState,
  ObjectInfoState,
  defaultObjectInfoState
} from './browserState';

function browserInfo(
  state: BrowserState = defaultBrowserState,
  action: ActionType<typeof browserActions>
): BrowserState {
  switch (action.type) {
    case getType(browserActions.updateBrowserActivated):
      return { ...state, browserActivated: action.payload };
    case getType(browserActions.toggleTrackPanel):
      return trackPanelState(state, action.payload);
    case getType(browserActions.changeDrawerView):
      return {
        ...state,
        drawerView: action.payload
      };
    case getType(browserActions.toggleDrawer):
      return drawerState(state, action.payload);
    case getType(browserActions.toggleBrowserNav):
      return { ...state, browserNavOpened: !state.browserNavOpened };
    case getType(browserActions.updateBrowserNavStates):
      return { ...state, browserNavStates: action.payload };
    case getType(browserActions.updateChrLocation):
      return { ...state, chrLocation: action.payload };
    case getType(browserActions.updateDefaultChrLocation):
      return {
        ...state,
        chrLocation: action.payload,
        defaultChrLocation: action.payload
      };
    case getType(browserActions.openTrackPanelModal):
      return {
        ...state,
        trackPanelModalOpened: true,
        trackPanelModalView: action.payload
      };
    case getType(browserActions.closeTrackPanelModal):
      return {
        ...state,
        trackPanelModalOpened: false,
        trackPanelModalView: ''
      };
    case getType(browserActions.toggleGenomeSelector):
      return { ...state, genomeSelectorActive: action.payload };
    case getType(browserActions.selectBrowserTab):
      return { ...state, selectedBrowserTab: action.payload };
    default:
      return state;
  }
}

function objectInfo(
  state: ObjectInfoState = defaultObjectInfoState,
  action: ActionType<typeof browserActions>
): ObjectInfoState {
  switch (action.type) {
    case getType(browserActions.fetchObjectInfo.failure):
      return { ...state, browserInfoFetchFailed: true };
    case getType(browserActions.fetchObjectInfo.request):
      return {
        ...state,
        browserInfoFetchFailed: false,
        browserInfoFetching: true
      };
    case getType(browserActions.fetchObjectInfo.success):
      type BrowserInfo = {
        object_info: {};
        track_categories: [];
      };

      const json = action.payload as BrowserInfo;

      return {
        ...state,
        browserInfoFetchFailed: false,
        browserInfoFetching: false,
        objectInfo: json.object_info,
        trackCategories: json.track_categories
      };
    default:
      return state;
  }
}

export default combineReducers({
  browserInfo,
  objectInfo
});
