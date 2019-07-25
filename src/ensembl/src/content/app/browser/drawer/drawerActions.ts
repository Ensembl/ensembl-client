import { createAction } from 'typesafe-actions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';

export const changeDrawerViewForGenome = createAction(
  'drawer/update-drawer-view',
  (resolve) => {
    return (drawerViewForGenome: { [genomeId: string]: string }) =>
      resolve(drawerViewForGenome);
  }
);

export const changeDrawerView: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (drawerView: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    changeDrawerViewForGenome({
      [activeGenomeId]: drawerView
    })
  );
};

export const toggleDrawerForGenome = createAction(
  'drawer/toggle-drawer',
  (resolve) => {
    return (isDrawerOpenedForGenome: { [genomeId: string]: boolean }) =>
      resolve(isDrawerOpenedForGenome);
  }
);

export const toggleDrawer: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (isDrawerOpened: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    toggleDrawerForGenome({
      [activeGenomeId]: isDrawerOpened
    })
  );
};
