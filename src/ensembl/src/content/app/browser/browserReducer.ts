import { ActionType, getType } from 'typesafe-actions';

import * as browser from './browserActions';
import {
  BrowserState,
  defaultState,
  trackPanelState,
  drawerState
} from './browserState';

import { drawerSectionConfig } from './drawer/drawerSectionConfig';

export default (
  state: BrowserState = defaultState,
  action: ActionType<typeof browser>
): BrowserState => {
  switch (action.type) {
    case getType(browser.toggleTrackPanel):
      return trackPanelState(state, action.payload);
    case getType(browser.changeCurrentTrack):
      return {
        ...state,
        currentDrawerSection: '',
        currentTrack: action.payload,
        drawerSections: drawerSectionConfig[action.payload]
      };
    case getType(browser.toggleDrawer):
      return drawerState(state, action.payload);
    case getType(browser.changeCurrentDrawerSection):
      return { ...state, currentDrawerSection: action.payload };
    case getType(browser.toggleBrowserNav):
      return { ...state, browserNavOpened: !state.browserNavOpened };
    case getType(browser.updateBrowserNavStates):
      return { ...state, browserNavStates: action.payload };
    case getType(browser.updateChrLocation):
      return { ...state, chrLocation: action.payload };
    default:
      return state;
  }
};
