export type DrawerState = Readonly<{
  isDrawerOpened: { [genomeId: string]: boolean };
  drawerView: { [genomeId: string]: string };
}>;

export const defaultDrawerState = {
  isDrawerOpened: {},
  drawerView: {}
};
