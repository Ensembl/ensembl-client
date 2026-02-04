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

type State = {
  isSidebarOpen: boolean;
  sidebarView: SidebarView;
};

const initialState: State = {
  isSidebarOpen: true,
  sidebarView: 'default'
};

const uiSlice = createSlice({
  name: 'structural-variants-viewer-ui',
  initialState,
  reducers: {
    openSidebar(state) {
      state.isSidebarOpen = true;
    },
    closeSidebar(state) {
      state.isSidebarOpen = false;
    },
    setSidebarView(state, action: PayloadAction<{ view: SidebarView }>) {
      const { view } = action.payload;
      state.sidebarView = view;
    }
  }
});

export const { setSidebarView, openSidebar, closeSidebar } = uiSlice.actions;

export default uiSlice.reducer;
