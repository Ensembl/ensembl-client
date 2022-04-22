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

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import type { DrawerView } from './types';
import type { RootState } from 'src/store';

type DrawerStateForGenome = {
  drawerView: DrawerView | null;
};

type DrawerState = {
  [genomeId: string]: DrawerStateForGenome;
};

export const closeDrawer =
  (): ThunkAction<void, any, void, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const activeGenomeId = getBrowserActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

    dispatch(
      changeDrawerViewForGenome({
        genomeId: activeGenomeId,
        drawerView: null
      })
    );
  };

export const changeDrawerViewAndOpen =
  (drawerView: DrawerView): ThunkAction<void, any, void, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const activeGenomeId = getBrowserActiveGenomeId(getState());

    if (!activeGenomeId) {
      return;
    }

    dispatch(
      changeDrawerViewForGenome({
        genomeId: activeGenomeId,
        drawerView
      })
    );
  };

export const defaultDrawerStateForGenome: DrawerStateForGenome = {
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

export const { changeDrawerViewForGenome } = drawerSlice.actions;

export default drawerSlice.reducer;
