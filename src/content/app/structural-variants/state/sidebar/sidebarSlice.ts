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

export type SidebarView = 'default' | 'configuration';

export type SidebarModalView = 'search';

type State = {
  isSidebarOpen: boolean;
  sidebarView: SidebarView;
  sidebarModalView: SidebarModalView | null;
};

const initialState: State = {
  isSidebarOpen: true,
  sidebarView: 'default',
  sidebarModalView: null
};

const sidebarSlice = createSlice({
  name: 'structural-variants-viewer-ui',
  initialState,
  reducers: {
    openSidebar(state) {
      state.isSidebarOpen = true;
    },
    closeSidebar(state) {
      state.isSidebarOpen = false;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarView(state, action: PayloadAction<{ view: SidebarView }>) {
      const { view } = action.payload;
      state.isSidebarOpen = true; // open sidebar if it is closed
      state.sidebarModalView = null; // close sidebar modal if it is open
      state.sidebarView = view;
    },
    openSidebarModal(state, action: PayloadAction<{ view: SidebarModalView }>) {
      state.sidebarModalView = action.payload.view;
    },
    closeSidebarModal(state) {
      state.sidebarModalView = null;
    },
    toggleSidebarModal(
      state,
      action: PayloadAction<{ view: SidebarModalView }>
    ) {
      const view = action.payload.view;
      if (state.sidebarModalView === view) {
        state.sidebarModalView = null;
      } else {
        state.sidebarModalView = view;
      }
    }
  }
});

export const {
  setSidebarView,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  openSidebarModal,
  closeSidebarModal,
  toggleSidebarModal
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
