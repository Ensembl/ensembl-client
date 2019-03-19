import { RootState } from 'src/store';
import {
  BrowserOpenState,
  BrowserNavStates,
  ChrLocation,
  CogList
} from './browserState';
import { TrackType } from './track-panel/trackPanelConfig';

export const getBrowserActivated = (state: RootState): boolean =>
  state.browser.browserInfo.browserActivated;

export const getBrowserOpenState = (state: RootState): BrowserOpenState =>
  state.browser.browserInfo.browserOpenState;

export const getBrowserNavOpened = (state: RootState): boolean =>
  state.browser.browserNav.browserNavOpened;

export const getBrowserNavStates = (state: RootState): BrowserNavStates =>
  state.browser.browserNav.browserNavStates;

export const getChrLocation = (state: RootState): ChrLocation =>
  state.browser.browserLocation.chrLocation;

export const getDefaultChrLocation = (state: RootState): ChrLocation =>
  state.browser.browserLocation.defaultChrLocation;

export const getGenomeSelectorActive = (state: RootState): boolean =>
  state.browser.browserLocation.genomeSelectorActive;

export const getBrowserCogList = (state: RootState): number =>
  state.browser.trackConfig.browserCogList;

export const getBrowserCogTrackList = (state: RootState): CogList =>
  state.browser.trackConfig.browserCogTrackList;

export const getBrowserSelectedCog = (state: RootState): string =>
  state.browser.trackConfig.selectedCog;

export const getTrackConfigNames = (state: RootState): any =>
  state.browser.trackConfig.trackConfigNames;

export const getTrackConfigLabel = (state: RootState): any =>
  state.browser.trackConfig.trackConfigLabel;

export const getApplyToAll = (state: RootState): boolean =>
  state.browser.trackConfig.applyToAll;

export const getTrackPanelModalOpened = (state: RootState): boolean =>
  state.browser.trackPanel.trackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState): string =>
  state.browser.trackPanel.trackPanelModalView;

export const getSelectedBrowserTab = (state: RootState): TrackType =>
  state.browser.trackPanel.selectedBrowserTab;

export const getTrackPanelOpened = (state: RootState): boolean =>
  state.browser.trackPanel.trackPanelOpened;

export const getDrawerView = (state: RootState): string =>
  state.browser.drawer.drawerView;

export const getDrawerOpened = (state: RootState): boolean =>
  state.browser.drawer.drawerOpened;

export const getObjectFetchFailed = (state: RootState) =>
  state.browser.object.objectFetchFailed;

export const getObjectFetching = (state: RootState) =>
  state.browser.object.objectFetching;

export const getObjectInfo = (state: RootState) =>
  state.browser.object.objectInfo;

export const getTrackCategories = (state: RootState): [] =>
  state.browser.object.trackCategories;

export const getExampleObjectsFetchFailed = (state: RootState) =>
  state.browser.exampleObjects.exampleObjectsFetchFailed;

export const getExampleObjectsFetching = (state: RootState) =>
  state.browser.exampleObjects.exampleObjectsFetching;

export const getExampleObjects = (state: RootState) =>
  state.browser.exampleObjects.examples;
