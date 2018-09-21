import { createAction } from 'typesafe-actions';

export const toggleTrackPanel = createAction('browser/toggle-track-panel');
export const changeCurrentTrack = createAction(
  'browser/change-current-track',
  (resolve) => {
    return (currentTrack: string) => resolve(currentTrack);
  }
);

export const toggleDrawer = createAction('browser/toggle-drawer');
export const openDrawer = createAction('browser/open-drawer');
export const closeDrawer = createAction('browser/close-drawer');
export const changeCurrentDrawerSection = createAction(
  'browser/change-current-drawer-section',
  (resolve) => {
    return (currentDrawerSection: string) => resolve(currentDrawerSection);
  }
);
