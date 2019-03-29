export type DrawerState = Readonly<{
  drawerOpened: boolean;
  drawerView: string;
}>;

export const defaultDrawerState = {
  drawerOpened: false,
  drawerView: ''
};
