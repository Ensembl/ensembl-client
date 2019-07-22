import { createStandardAction } from 'typesafe-actions';

export const toggleAccount = createStandardAction('header/toggle-account')();

export const toggleLaunchbar = createStandardAction(
  'header/toggle-launchbar'
)();

export const changeCurrentApp = createStandardAction(
  'header/change-current-app'
)<string>();
