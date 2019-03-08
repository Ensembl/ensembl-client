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

export const getGenomeSelectorActive = (state: RootState): boolean =>
  state.browser.browserInfo.genomeSelectorActive;

export const getSelectedBrowserTab = (state: RootState): TrackType =>
  state.browser.browserInfo.selectedBrowserTab;

export const getObjectFetchFailed = (state: RootState) =>
  state.browser.object.objectFetchFailed;

export const getObjectFetching = (state: RootState) =>
  state.browser.object.objectFetching;

export const getObjectInfo = (state: RootState) =>
  state.browser.object.objectInfo;

export const getTrackCategories = (state: RootState): [] =>
  state.browser.object.trackCategories;

export const getExampleObjects = (state: RootState) =>
  state.browser.exampleObjects.examples;
