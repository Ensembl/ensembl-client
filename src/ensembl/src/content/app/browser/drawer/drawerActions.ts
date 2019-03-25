import { createAction } from 'typesafe-actions';

import { getDrawerAnalyticsObject } from 'src/analyticsHelper';

export const changeDrawerView = createAction(
  'drawer/change-drawer-view',
  (resolve) => {
    return (drawerView: string) =>
      resolve(drawerView, getDrawerAnalyticsObject('User Interaction'));
  }
);

export const toggleDrawer = createAction('drawer/toggle-drawer', (resolve) => {
  return (drawerOpened?: boolean) =>
    resolve(drawerOpened, getDrawerAnalyticsObject('User Interaction'));
});
