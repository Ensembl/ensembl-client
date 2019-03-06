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

export const getBrowserCogList = (state: RootState): CogList => {
  return state.browser.browserCogList;
};

export const getBrowserCogTrackList = (state: RootState): Array<number> => {
  return state.browser.browserCogTrackList;
};

export const getBrowserSelectedCog = (state: RootState): number | null => {
  return state.browser.selectedCog;
};

export const getTrackConfigNames = (state: RootState): Any => {
  return state.browser.trackConfigNames;
};

export const getTrackConfigLabel = (state: RootState): Any => {
  return state.browser.trackConfigLabel;
};

export const getApplyToAll = (state: RootState): boolean => {
  return state.browser.applyToAll;
};
