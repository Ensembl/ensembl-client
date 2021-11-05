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

import {
  createSlice,
  Action,
  PayloadAction,
  ThunkAction
} from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import { getBrowserActiveGenomeId } from 'src/content/app/browser/browserSelectors';

import type { DrawerView } from './types';
import type { RootState } from 'src/store';

type DrawerStateForGenome = {
  isDrawerOpened: boolean;
  drawerView: DrawerView | null;
};

type DrawerState = {
  [genomeId: string]: DrawerStateForGenome;
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
          // <-- is this action even necessary?
          genomeId: activeGenomeId,
          isOpen: false
        })
      );

      dispatch(
        changeDrawerViewForGenome({
          genomeId: activeGenomeId,
          drawerView: null
        })
      );
    });
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
        toggleDrawerForGenome({
          // <-- is this action even necessary?
          genomeId: activeGenomeId,
          isOpen: true
        })
      );

      dispatch(
        changeDrawerViewForGenome({
          genomeId: activeGenomeId,
          drawerView
        })
      );
    });
  };

export const defaultDrawerStateForGenome: DrawerStateForGenome = {
  isDrawerOpened: false,
  drawerView: null
};

const ensureDrawerStateForGenome = (state: DrawerState, genomeId: string) => {
  if (!state[genomeId]) {
    state[genomeId] = { ...defaultDrawerStateForGenome };
  }
};

const drawerSlice = createSlice({
  name: 'genome-browser-drawer',
  initialState: {} as DrawerState,
  reducers: {
    // TODO: discuss whether we need this part of the state at all;
    // isn't { drawerView: null } sufficient to represent a closed drawer?
    toggleDrawerForGenome(
      state,
      action: PayloadAction<{ genomeId: string; isOpen: boolean }>
    ) {
      const { genomeId, isOpen } = action.payload;
      ensureDrawerStateForGenome(state, genomeId);
      state[genomeId].isDrawerOpened = isOpen;
    },
    changeDrawerViewForGenome(
      state,
      action: PayloadAction<{ genomeId: string; drawerView: DrawerView | null }>
    ) {
      const { genomeId, drawerView } = action.payload;
      ensureDrawerStateForGenome(state, genomeId);
      state[genomeId].drawerView = drawerView;
    }
  }
});

export const { toggleDrawerForGenome, changeDrawerViewForGenome } =
  drawerSlice.actions;

export default drawerSlice.reducer;
