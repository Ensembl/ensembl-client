import { createAction } from 'typesafe-actions';

import { TrackType } from './trackPanelConfig';
import { getTrackPanelAnalyticsObject } from 'src/analyticsHelper';

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

export const selectBrowserTab = createAction(
  'select-browser-tab',
  (resolve) => {
    return (selectedBrowserTab: TrackType) => resolve(selectedBrowserTab);
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
