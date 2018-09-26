import { ActionType, getType } from 'typesafe-actions';

import * as browser from '../actions/browserActions';

import {
  DrawerSection,
  drawerSectionConfig
} from '../configs/drawerSectionConfig';

export type BrowserAction = ActionType<typeof browser>;

export enum BrowserOpenState {
  EXPANDED = 'expanded',
  SEMI_EXPANDED = 'semi-expanded',
  COLLAPSED = 'collapsed'
}

export type BrowserState = Readonly<{
  browserOpenState: BrowserOpenState;
  currentDrawerSection: string;
  currentTrack: string;
  drawerOpened: boolean;
  drawerSections: DrawerSection[];
  trackPanelOpened: boolean;
}>;

export const defaultState: BrowserState = {
  browserOpenState: BrowserOpenState.SEMI_EXPANDED,
  currentDrawerSection: '',
  currentTrack: '',
  drawerOpened: false,
  drawerSections: [],
  trackPanelOpened: true
};

const trackPanelState = (state: BrowserState) => {
  const trackPanelOpened: boolean = !state.trackPanelOpened;
  const browserOpenState: BrowserOpenState = trackPanelOpened
    ? BrowserOpenState.SEMI_EXPANDED
    : BrowserOpenState.EXPANDED;

  return {
    ...state,
    browserOpenState,
    trackPanelOpened
  };
};

const drawerState = (state: BrowserState, drawerOpened: boolean) => {
  if (drawerOpened === true) {
    return {
      ...state,
      browserOpenState: BrowserOpenState.COLLAPSED,
      drawerOpened
    };
  } else {
    return {
      ...defaultState
    };
  }
};

export default (
  state: BrowserState = defaultState,
  action: BrowserAction
): BrowserState => {
  switch (action.type) {
    case getType(browser.toggleTrackPanel):
      return trackPanelState(state);
    case getType(browser.changeCurrentTrack):
      return {
        ...state,
        currentDrawerSection: '',
        currentTrack: action.payload,
        drawerSections: drawerSectionConfig[action.payload]
      };
    case getType(browser.toggleDrawer):
      return drawerState(state, !state.drawerOpened);
    case getType(browser.openDrawer):
      return drawerState(state, true);
    case getType(browser.closeDrawer):
      return drawerState(state, false);
    case getType(browser.changeCurrentDrawerSection):
      return { ...state, currentDrawerSection: action.payload };
    default:
      return state;
  }
};
