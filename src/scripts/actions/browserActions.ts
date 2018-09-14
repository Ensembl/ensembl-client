import { createAction } from 'typesafe-actions';

export const toggleTrackPanel = createAction('browser/toggle-track-panel');
export const updateTrack = createAction(
  'browser/update-track',
  (resolve) => {
    return (currentTrack: string) => resolve(currentTrack);
  }
);

export const toggleDrawer = createAction('browser/toggle-drawer');
export const openDrawer = createAction('browser/open-drawer');
export const closeDrawer = createAction('browser/close-drawer');
