import { createAction } from 'typesafe-actions';

import { getDrawerAnalyticsObject } from 'src/analyticsHelper';
import { ActionCreator, Action, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';

export const changeDrawerViewForGenome = createAction(
  'drawer/update-drawer-view',
  (resolve) => {
    return (drawerView: { [genomeId: string]: string }) =>
      resolve(drawerView, getDrawerAnalyticsObject('User Interaction'));
  }
);

export const changeDrawerView: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (drawerViewForGenome: string) => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const activeGenomeId = getBrowserActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    changeDrawerViewForGenome({
      [activeGenomeId]: drawerViewForGenome
    })
  );
};

export const toggleDrawerForGenome = createAction(
  'drawer/toggle-drawer',
  (resolve) => {
    return (isDrawerOpened: { [genomeId: string]: boolean }) =>
      resolve(isDrawerOpened, getDrawerAnalyticsObject('User Interaction'));
  }
);

export const toggleDrawer: ActionCreator<
  ThunkAction<void, any, null, Action<boolean>>
> = (isDrawerOpened: boolean) => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
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
