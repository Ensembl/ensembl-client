import { createAction, createStandardAction } from 'typesafe-actions';
import analyticsTracking from 'src/services/analytics-service';
import { CustomDimensions } from 'src/analyticsHelper';

export const toggleAccount = createStandardAction('header/toggle-account')();

export const toggleLaunchbar = createStandardAction(
  'header/toggle-launchbar'
)();

export const changeCurrentApp = createAction(
  'header/change-current-app',
  (resolve) => {
    return (appName: string) => {
      analyticsTracking.sendCustomDimensionEvent({
        diemension: CustomDimensions.PAGEVIEW,
        value: appName
      });
      return resolve(appName);
    };
  }
);
