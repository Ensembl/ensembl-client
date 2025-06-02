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

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type MainContentBottomView = 'epigenomes-list' | 'dataviz';

export type SidebarView = 'default' | 'epigenome-filters';

type StatePerGenome = {
  mainContentBottomView: MainContentBottomView;
  isEpigenomesSelectorOpen: boolean;
  isSidebarOpen: boolean;
  sidebarView: SidebarView;
};

type State = Record<string, StatePerGenome>;

const initialStateForGenome: StatePerGenome = {
  mainContentBottomView: 'dataviz',
  isEpigenomesSelectorOpen: false,
  isSidebarOpen: true,
  sidebarView: 'default'
};

const ensureStateForGenome = (state: State, genomeId: string) => {
  if (!(genomeId in state)) {
    state[genomeId] = structuredClone(initialStateForGenome);
  }
};

const uiSlice = createSlice({
  name: 'regulatory-activity-viewer-ui',
  initialState: {} as State,
  reducers: {
    setMainContentBottomView(
      state,
      action: PayloadAction<{ genomeId: string; view: MainContentBottomView }>
    ) {
      const { genomeId, view } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].mainContentBottomView = view;
    },
    openEpigenomesSelector(state, action: PayloadAction<{ genomeId: string }>) {
      const { genomeId } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].isEpigenomesSelectorOpen = true;
    },
    closeEpigenomesSelector(
      state,
      action: PayloadAction<{ genomeId: string }>
    ) {
      const { genomeId } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].isEpigenomesSelectorOpen = false;
    },
    openSidebar(state, action: PayloadAction<{ genomeId: string }>) {
      const { genomeId } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].isSidebarOpen = true;
    },
    closeSidebar(state, action: PayloadAction<{ genomeId: string }>) {
      const { genomeId } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].isSidebarOpen = false;
    },
    setSidebarView(
      state,
      action: PayloadAction<{ genomeId: string; view: SidebarView }>
    ) {
      const { genomeId, view } = action.payload;
      ensureStateForGenome(state, genomeId);
      state[genomeId].sidebarView = view;
    }
  }
});

export const {
  setMainContentBottomView,
  setSidebarView,
  openSidebar,
  closeSidebar,
  openEpigenomesSelector,
  closeEpigenomesSelector
} = uiSlice.actions;

export default uiSlice.reducer;
