/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createAction } from 'typesafe-actions';
import { batch } from 'react-redux';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { RootState } from 'src/store';
import { DrawerView } from 'src/content/app/browser/drawer/drawerState';

import { getBrowserActiveGenomeId } from '../browserSelectors';

export const changeDrawerViewForGenome = createAction(
  'drawer/update-drawer-view',
  (drawerViewForGenome: { [genomeId: string]: string }) => drawerViewForGenome
)();

export const changeDrawerView: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (drawerView: DrawerView) => (dispatch, getState: () => RootState) => {
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

export const changeDrawerViewAndOpen: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (drawerView: DrawerView) => (dispatch, getState: () => RootState) => {
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

export const toggleDrawer: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (isDrawerOpened: boolean) => (dispatch, getState: () => RootState) => {
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

export const closeDrawer: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = () => (dispatch, getState: () => RootState) => {
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
