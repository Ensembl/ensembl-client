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
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { getBrowserActiveGenomeId } from '../browserSelectors';

import { RootState } from 'src/store';
import { DrawerView } from 'src/content/app/browser/drawer/drawerState';

export const changeDrawerViewForGenome = createAction(
  'drawer/update-drawer-view',
  (drawerViewForGenome: { [genomeId: string]: DrawerView | null }) =>
    drawerViewForGenome
)();

export const changeDrawerView =
  (drawerView: DrawerView): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

export const changeDrawerViewAndOpen =
  (drawerView: DrawerView): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

export const toggleDrawer =
  (isDrawerOpened: boolean): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

export const closeDrawer =
  (): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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
          [activeGenomeId]: null
        })
      );
    });
  };

export const setActiveDrawerTrackId = createAction(
  'browser/set-active-drawer-track-id'
)<{ [genomeId: string]: string | null }>();

export const setActiveDrawerTranscriptId = createAction(
  'browser/set-active-drawer-transcript-id'
)<{ [genomeId: string]: string | null }>();
