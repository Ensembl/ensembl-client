import { createAction } from 'typesafe-actions';

import buildAnalyticsObject from 'src/analyticsHelper';

export const toggleAccount = createAction(
  'header/toggle-account',
  (resolve) => {
    return () =>
      resolve(
        undefined,
        buildAnalyticsObject({ category: 'Header', label: 'Navigation' })
      );
  }
);

export const toggleLaunchbar = createAction(
  'header/toggle-launchbar',
  (resolve) => {
    return () =>
      resolve(
        undefined,
        buildAnalyticsObject({ category: 'Header', label: 'Navigation' })
      );
  }
);

export const changeCurrentApp = createAction(
  'header/change-current-app',
  (resolve) => {
    return (currentApp: string) =>
      resolve(
        currentApp,
        buildAnalyticsObject({ category: 'Header', label: 'Navigation' })
      );
  }
);
