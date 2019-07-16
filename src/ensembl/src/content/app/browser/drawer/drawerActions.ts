import { createAction } from 'typesafe-actions';

import buildAnalyticsObject from 'src/analyticsHelper';

export const changeDrawerView = createAction(
  'drawer/change-drawer-view',
  (resolve) => {
    return (drawerView: string) =>
      resolve(
        drawerView,
        buildAnalyticsObject({ category: 'Drawer', label: 'User Interaction' })
      );
  }
);

export const toggleDrawer = createAction('drawer/toggle-drawer', (resolve) => {
  return (drawerOpened?: boolean) =>
    resolve(
      drawerOpened,
      buildAnalyticsObject({ category: 'Drawer', label: 'User Interaction' })
    );
});
