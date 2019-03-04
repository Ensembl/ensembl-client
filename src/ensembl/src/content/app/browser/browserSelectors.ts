import { RootState } from 'src/rootReducer';
import {
  BrowserOpenState,
  BrowserNavStates,
  ChrLocation
} from './browserState';

export const getBrowserActivated = (state: RootState): boolean =>
  state.browser.browserActivated;

export const getBrowserOpenState = (state: RootState): BrowserOpenState =>
  state.browser.browserOpenState;

export const getDrawerView = (state: RootState): string =>
  state.browser.drawerView;

export const getDrawerOpened = (state: RootState): boolean =>
  state.browser.drawerOpened;

export const getTrackPanelOpened = (state: RootState): boolean =>
  state.browser.trackPanelOpened;

export const getBrowserNavOpened = (state: RootState): boolean =>
  state.browser.browserNavOpened;

export const getBrowserNavStates = (state: RootState): BrowserNavStates =>
  state.browser.browserNavStates;

export const getChrLocation = (state: RootState): ChrLocation =>
  state.browser.chrLocation;

export const getDefaultChrLocation = (state: RootState): ChrLocation =>
  state.browser.defaultChrLocation;

export const getTrackPanelModalOpened = (state: RootState): boolean =>
  state.browser.trackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState): string =>
  state.browser.trackPanelModalView;

export const getGenomeSelectorActive = (state: RootState): boolean =>
  state.browser.genomeSelectorActive;
