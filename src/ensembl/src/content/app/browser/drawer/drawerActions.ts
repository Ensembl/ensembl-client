import { createAction } from 'typesafe-actions';

export const changeDrawerView = createAction(
  'drawer/change-drawer-view',
  (resolve) => {
    return (drawerView: string) => resolve(drawerView);
  }
);

export const toggleDrawer = createAction('drawer/toggle-drawer', (resolve) => {
  return (drawerOpened?: boolean) => resolve(drawerOpened);
});
