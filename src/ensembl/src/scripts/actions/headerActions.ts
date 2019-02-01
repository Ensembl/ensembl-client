import { createAction } from 'typesafe-actions';

export const toggleAccount = createAction('header/toggle-account');
export const toggleLaunchbar = createAction('header/toggle-launchbar');

export const changeCurrentApp = createAction(
  'header/change-current-app',
  (resolve) => {
    return (currentApp: string) => resolve(currentApp);
  }
);
