import { createAction } from 'typesafe-actions';
import { BrowserNavStates, ChrLocation } from './browserState';

export const toggleTrackPanel = createAction(
  'browser/toggle-track-panel',
  (resolve) => {
    return (trackPanelOpened?: boolean) => resolve(trackPanelOpened);
  }
);

export const changeCurrentTrack = createAction(
  'browser/change-current-track',
  (resolve) => {
    return (currentTrack: string) => resolve(currentTrack);
  }
);

export const toggleDrawer = createAction('browser/toggle-drawer', (resolve) => {
  return (drawerOpened?: boolean) => resolve(drawerOpened);
});

export const changeCurrentDrawerSection = createAction(
  'browser/change-current-drawer-section',
  (resolve) => {
    return (currentDrawerSection: string) => resolve(currentDrawerSection);
  }
);

export const toggleBrowserNav = createAction(
  'browser/toggle-browser-navigation'
);

export const updateBrowserNavStates = createAction(
  'browser/update-browser-nav-states',
  (resolve) => {
    return (browserNavStates: BrowserNavStates) => resolve(browserNavStates);
  }
);

export const updateChrLocation = createAction(
  'browser/update-chromosome-location',
  (resolve) => {
    return (chrLocation: ChrLocation) => resolve(chrLocation);
  }
);

export const updateDefaultChrLocation = createAction(
  'browser/update-default-chromosome-location',
  (resolve) => {
    return (chrLocation: ChrLocation) => resolve(chrLocation);
  }
);
