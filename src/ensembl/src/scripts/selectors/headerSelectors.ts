import { RootState } from '../reducers';

export const getAccountExpanded = (state: RootState): boolean =>
  state.header.accountExpanded;

export const getCurrentApp = (state: RootState): string =>
  state.header.currentApp;

export const getLaunchbarExpanded = (state: RootState): boolean =>
  state.header.launchbarExpanded;
