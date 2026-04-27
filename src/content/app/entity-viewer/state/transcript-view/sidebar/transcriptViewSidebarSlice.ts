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

export const sidebarTabNames = ['Overview', 'External references'] as const;
export const defaultSidebarTabName = sidebarTabNames[0];

export type SidebarTabName = (typeof sidebarTabNames)[number];

export const sidebarModalViews = ['search', 'bookmarks', 'download'];

export type SidebarModalView = (typeof sidebarModalViews)[number];

type StateForTranscript = {
  isOpen: boolean;
  selectedTabName: SidebarTabName;
  sidebarModalView: SidebarModalView | null;
};

type State = {
  [genomeId: string]: {
    [transcriptId: string]: StateForTranscript;
  };
};

const initialStateForTranscript: StateForTranscript = {
  isOpen: true,
  selectedTabName: sidebarTabNames[0],
  sidebarModalView: null
};

const ensureTranscriptState = (
  state: State,
  genomeId: string,
  transcriptId: string
) => {
  if (!state[genomeId]) {
    state[genomeId] = {};
  }
  if (!state[genomeId][transcriptId]) {
    state[genomeId][transcriptId] = structuredClone(initialStateForTranscript);
  }
};

const transcriptViewSidebarSlice = createSlice({
  name: 'entity-viewer-transcript-view-sidebar',
  initialState: {} as State,
  reducers: {
    openSidebar(
      state,
      action: PayloadAction<{
        genomeId: string;
        transcriptId: string;
      }>
    ) {
      const { genomeId, transcriptId } = action.payload;
      ensureTranscriptState(state, genomeId, transcriptId);
      state[genomeId][transcriptId].isOpen = true;
    },
    closeSidebar(
      state,
      action: PayloadAction<{
        genomeId: string;
        transcriptId: string;
      }>
    ) {
      const { genomeId, transcriptId } = action.payload;
      ensureTranscriptState(state, genomeId, transcriptId);
      state[genomeId][transcriptId].isOpen = false;
    },
    toggleSidebar(
      state,
      action: PayloadAction<{
        genomeId: string;
        transcriptId: string;
      }>
    ) {
      const { genomeId, transcriptId } = action.payload;
      ensureTranscriptState(state, genomeId, transcriptId);
      state[genomeId][transcriptId].isOpen =
        !state[genomeId][transcriptId].isOpen;
    },
    setSelectedTab(
      state,
      action: PayloadAction<{
        genomeId: string;
        transcriptId: string;
        selectedTabName: SidebarTabName;
      }>
    ) {
      const { genomeId, transcriptId, selectedTabName } = action.payload;
      ensureTranscriptState(state, genomeId, transcriptId);
      state[genomeId][transcriptId].selectedTabName = selectedTabName;
    },
    setSidebarModalView(
      state,
      action: PayloadAction<{
        genomeId: string;
        transcriptId: string;
        view: SidebarModalView | null;
      }>
    ) {
      const { genomeId, transcriptId, view } = action.payload;
      ensureTranscriptState(state, genomeId, transcriptId);
      state[genomeId][transcriptId].sidebarModalView = view;
    },
    closeSidebarModal(
      state,
      action: PayloadAction<{
        genomeId: string;
        transcriptId: string;
      }>
    ) {
      const { genomeId, transcriptId } = action.payload;
      ensureTranscriptState(state, genomeId, transcriptId);
      state[genomeId][transcriptId].sidebarModalView = null;
    }
  }
});

export const {
  openSidebar,
  closeSidebar,
  toggleSidebar,
  setSelectedTab,
  setSidebarModalView,
  closeSidebarModal
} = transcriptViewSidebarSlice.actions;

export default transcriptViewSidebarSlice.reducer;
