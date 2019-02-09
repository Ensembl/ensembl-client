import { createAction } from 'typesafe-actions';

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
