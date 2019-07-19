export type DrawerState = Readonly<{
  drawerOpened: { [genomeId: string]: boolean };
  drawerView: { [genomeId: string]: string };
}>;

export const defaultDrawerState = {
  drawerOpened: {},
  drawerView: {}
};
