import { createAction } from 'typesafe-actions';

import { getHeaderAnalyticsObject } from 'src/analyticsHelper';

export const toggleAccount = createAction(
  'header/toggle-account',
  (resolve) => {
    return () => resolve(undefined, getHeaderAnalyticsObject('Navigation'));
  }
);

export const toggleLaunchbar = createAction(
  'header/toggle-launchbar',
  (resolve) => {
    return () => resolve(undefined, getHeaderAnalyticsObject('Navigation'));
  }
);
