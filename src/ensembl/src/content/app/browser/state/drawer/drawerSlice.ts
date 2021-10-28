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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { DrawerView } from './types';

type DrawerStateForGenome = {
  isDrawerOpened: boolean;
  drawerView: DrawerView | null;
};

type DrawerState = {
  [genomeId: string]: DrawerStateForGenome;
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
      action: PayloadAction<{ genomeId: string; drawerView: DrawerView }>
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
