import { RootState } from 'src/store';

export const getDrawerView = (state: RootState): string =>
  state.drawer.drawerView;

export const getDrawerOpened = (state: RootState): boolean =>
  state.drawer.drawerOpened;
