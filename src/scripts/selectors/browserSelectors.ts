import { RootState } from '../reducers';
import { BrowserOpenState } from '../reducers/browserReducer';
import { DrawerSection } from '../configs/drawerSectionConfig';

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
