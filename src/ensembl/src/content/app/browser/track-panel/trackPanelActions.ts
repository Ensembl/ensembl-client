import { createAction } from 'typesafe-actions';

import { TrackType } from './trackPanelConfig';
import { getTrackPanelAnalyticsObject } from 'src/analyticsHelper';
import browserStorageService from '../browser-storage-service';

export const toggleTrackPanel = createAction(
  'track-panel/toggle-track-panel',
  (resolve) => {
    return (trackPanelOpened?: boolean) =>
      resolve(
        trackPanelOpened,
        getTrackPanelAnalyticsObject('User Interaction')
      );
  }
);

export const selectBrowserTabAndSave = createAction(
  'select-browser-tab',
  (resolve) => {
    return (selectedBrowserTab: TrackType) => {
      browserStorageService.saveSelectedBrowserTab(selectedBrowserTab);
      return resolve(selectedBrowserTab);
    };
  }
);

export const openTrackPanelModal = createAction(
  'track-panel/open-track-panel-modal',
  (resolve) => {
    return (trackPanelModalView: string) =>
      resolve(
        trackPanelModalView,
        getTrackPanelAnalyticsObject('User Interaction')
      );
  }
);

export const closeTrackPanelModal = createAction(
  'track-panel/close-track-panel-modal',
  (resolve) => {
    return () => resolve(undefined, getTrackPanelAnalyticsObject('Navigation'));
  }
);
