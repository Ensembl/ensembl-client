import { createAction, createStandardAction } from 'typesafe-actions';
import analyticsTracking from 'src/services/analytics-service';

export const toggleAccount = createStandardAction('header/toggle-account')();

export const toggleLaunchbar = createStandardAction(
  'header/toggle-launchbar'
)();

export const changeCurrentApp = createAction(
  'header/change-current-app',
  (resolve) => {
    return (appName: string) => {
      analyticsTracking.setPageDimension(appName);
      return resolve(appName);
    };
  }
);
