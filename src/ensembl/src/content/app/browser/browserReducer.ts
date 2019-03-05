import { ActionType, getType } from 'typesafe-actions';

import * as browser from './browserActions';
import {
  BrowserState,
  defaultState,
  trackPanelState,
  drawerState
} from './browserState';

export default (
  state: BrowserState = defaultState,
  action: ActionType<typeof browser>
): BrowserState => {
  switch (action.type) {
    case getType(browser.updateBrowserActivated):
      return { ...state, browserActivated: action.payload };
    case getType(browser.toggleTrackPanel):
      return trackPanelState(state, action.payload);
    case getType(browser.changeDrawerView):
      return {
        ...state,
        drawerView: action.payload
      };
    case getType(browser.toggleDrawer):
      return drawerState(state, action.payload);
    case getType(browser.toggleBrowserNav):
      return { ...state, browserNavOpened: !state.browserNavOpened };
    case getType(browser.updateBrowserNavStates):
      return { ...state, browserNavStates: action.payload };
    case getType(browser.updateChrLocation):
      return { ...state, chrLocation: action.payload };
    case getType(browser.updateDefaultChrLocation):
      return {
        ...state,
        chrLocation: action.payload,
        defaultChrLocation: action.payload
      };
    case getType(browser.openTrackPanelModal):
      return {
        ...state,
        trackPanelModalOpened: true,
        trackPanelModalView: action.payload
      };
    case getType(browser.closeTrackPanelModal):
      return {
        ...state,
        trackPanelModalOpened: false,
        trackPanelModalView: ''
      };
    case getType(browser.toggleGenomeSelector):
      return { ...state, genomeSelectorActive: action.payload };
    default:
      return state;
  }
};
