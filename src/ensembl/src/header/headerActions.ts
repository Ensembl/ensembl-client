import { createAction } from 'typesafe-actions';
import analyticsTracking from 'src/services/analytics-service';

export const toggleAccount = createAction('header/toggle-account')();

export const toggleLaunchbar = createAction('header/toggle-launchbar')();

export const changeCurrentApp = createAction(
  'header/change-current-app',
  (appName: string) => {
    analyticsTracking.setAppDimension(appName);
    return appName;
  }
)();
