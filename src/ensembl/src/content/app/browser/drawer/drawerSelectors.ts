import { RootState } from 'src/store';
import { getBrowserActiveEnsObjectId } from '../browserSelectors';

export const getDrawerView = (state: RootState) => {
  const activeGenomeId = getBrowserActiveEnsObjectId(state);
  return activeGenomeId ? state.drawer.drawerView[activeGenomeId] : '';
};

export const getIsDrawerOpened = (state: RootState) => {
  const activeGenomeId = getBrowserActiveEnsObjectId(state);
  return activeGenomeId ? state.drawer.isDrawerOpened[activeGenomeId] : false;
};
