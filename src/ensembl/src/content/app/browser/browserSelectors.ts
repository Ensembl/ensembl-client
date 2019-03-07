import { RootState } from 'src/rootReducer';
import {
  BrowserOpenState,
  BrowserNavStates,
  ChrLocation
} from './browserState';
import { TrackType } from './track-panel/trackPanelConfig';

export const getBrowserActivated = (state: RootState): boolean =>
  state.browser.browserInfo.browserActivated;

export const getBrowserOpenState = (state: RootState): BrowserOpenState =>
  state.browser.browserInfo.browserOpenState;

export const getDrawerView = (state: RootState): string =>
  state.browser.browserInfo.drawerView;

export const getDrawerOpened = (state: RootState): boolean =>
  state.browser.browserInfo.drawerOpened;

export const getTrackPanelOpened = (state: RootState): boolean =>
  state.browser.browserInfo.trackPanelOpened;

export const getBrowserNavOpened = (state: RootState): boolean =>
  state.browser.browserInfo.browserNavOpened;

export const getBrowserNavStates = (state: RootState): BrowserNavStates =>
  state.browser.browserInfo.browserNavStates;

export const getChrLocation = (state: RootState): ChrLocation =>
  state.browser.browserInfo.chrLocation;

export const getDefaultChrLocation = (state: RootState): ChrLocation =>
  state.browser.browserInfo.defaultChrLocation;

export const getTrackPanelModalOpened = (state: RootState): boolean =>
  state.browser.browserInfo.trackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState): string =>
  state.browser.browserInfo.trackPanelModalView;

export const getGenomeSelectorActive = (state: RootState): boolean =>
  state.browser.browserInfo.genomeSelectorActive;

export const getSelectedBrowserTab = (state: RootState): TrackType =>
  state.browser.browserInfo.selectedBrowserTab;
