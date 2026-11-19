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

export type SidebarModalView = 'search' | 'download';

export type SequenceViewerSidebarState = Readonly<{
  isSidebarOpen: boolean;
  sidebarModalView: Record<string, SidebarModalView | null>;
}>;

const initialState: SequenceViewerSidebarState = {
  isSidebarOpen: true,
  sidebarModalView: {}
};

const sequenceViewerSidebarSlice = createSlice({
  name: 'sequence-viewer-sidebar',
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
    openSidebarModal(
      state,
      action: PayloadAction<{
        genomeId: string;
        modalView: SidebarModalView | null;
      }>
    ) {
      const { genomeId, modalView } = action.payload;
      state.sidebarModalView[genomeId] = modalView;
    },
    closeSidebarModal(state, action: PayloadAction<{ genomeId: string }>) {
      const { genomeId } = action.payload;
      state.sidebarModalView[genomeId] = null;
    }
  }
});

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  openSidebarModal,
  closeSidebarModal
} = sequenceViewerSidebarSlice.actions;

export default sequenceViewerSidebarSlice.reducer;
