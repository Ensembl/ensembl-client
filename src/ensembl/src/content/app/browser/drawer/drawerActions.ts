import { createAction } from 'typesafe-actions';
import { batch } from 'react-redux';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';

export const changeDrawerViewForGenome = createAction(
  'drawer/update-drawer-view',
  (drawerViewForGenome: { [genomeId: string]: string }) => drawerViewForGenome
)();

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

export const changeDrawerViewAndOpen: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (drawerView: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }
  batch(() => {
    dispatch(
      changeDrawerViewForGenome({
        [activeGenomeId]: drawerView
      })
    );

    dispatch(toggleDrawer(true));
  });
};

export const toggleDrawerForGenome = createAction(
  'drawer/toggle-drawer',
  (isDrawerOpenedForGenome: { [genomeId: string]: boolean }) =>
    isDrawerOpenedForGenome
)();

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

export const closeDrawer: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  batch(() => {
    dispatch(
      toggleDrawerForGenome({
        [activeGenomeId]: false
      })
    );

    dispatch(
      changeDrawerViewForGenome({
        [activeGenomeId]: ''
      })
    );
  });
};
