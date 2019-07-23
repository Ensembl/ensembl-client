import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';

export const getDrawerView = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? state.drawer.drawerView[activeGenomeId] : '';
};

export const getIsDrawerOpened = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? state.drawer.isDrawerOpened[activeGenomeId] : false;
};
