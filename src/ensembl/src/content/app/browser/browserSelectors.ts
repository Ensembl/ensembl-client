import { RootState } from 'src/rootReducer';
import {
  BrowserOpenState,
  BrowserNavStates,
  ChrLocation
} from './browserState';
import { DrawerSection } from './drawer/drawerSectionConfig';

export const getBrowserOpenState = (state: RootState): BrowserOpenState =>
  state.browser.browserOpenState;

export const getCurrentDrawerSection = (state: RootState): string =>
  state.browser.currentDrawerSection;

export const getCurrentTrack = (state: RootState): string =>
  state.browser.currentTrack;

export const getDrawerOpened = (state: RootState): boolean =>
  state.browser.drawerOpened;

export const getDrawerSections = (state: RootState): DrawerSection[] =>
  state.browser.drawerSections;

export const getTrackPanelOpened = (state: RootState): boolean =>
  state.browser.trackPanelOpened;

export const getBrowserNavOpened = (state: RootState): boolean =>
  state.browser.browserNavOpened;

export const getBrowserNavStates = (state: RootState): BrowserNavStates =>
  state.browser.browserNavStates;

export const getChrLocation = (state: RootState): ChrLocation =>
  state.browser.chrLocation;
