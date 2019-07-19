import { RootState } from 'src/store';

export const getDrawerView = (state: RootState) => state.drawer.drawerView;

export const getDrawerOpened = (state: RootState) => state.drawer.drawerOpened;
